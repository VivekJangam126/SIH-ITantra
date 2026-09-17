/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useCallback, useEffect } from 'react';
import {
  NavTab,
  Language,
  PriorityLevel,
  TransmittedPacket,
  ChannelState,
  PipelineStatus,
  TacticalLogEntry,
  AppSettings,
  TacticalScenario
} from './types';
import { SUPPORTED_LANGUAGES, translateOffline, generateHexDump } from './data/languages';
import { tacticalAudio } from './utils/audioSynthesizer';
import { SideNavBar } from './components/SideNavBar';
import { TopAppBar } from './components/TopAppBar';
import { PhoneAPanel } from './components/PhoneAPanel';
import { ChannelMonitor } from './components/ChannelMonitor';
import { PhoneBPanel } from './components/PhoneBPanel';
import { ScenariosView } from './components/ScenariosView';
import { LinkQualityView } from './components/LinkQualityView';
import { LogsView } from './components/LogsView';
import { Modals } from './components/Modals';

export default function App() {
  // Navigation
  const [activeTab, setActiveTab] = useState<NavTab>('simulator');

  // Phone A & B State
  const [txLanguage, setTxLanguage] = useState<Language>(
    SUPPORTED_LANGUAGES.find(l => l.code === 'MR') || SUPPORTED_LANGUAGES[0]
  );
  const [rxLanguage, setRxLanguage] = useState<Language>(
    SUPPORTED_LANGUAGES.find(l => l.code === 'TA') || SUPPORTED_LANGUAGES[1]
  );

  const [currentTranscript, setCurrentTranscript] = useState<string>(
    'तीन लोक अडकले आहेत, मदतीची गरज आहे'
  );
  const [receivedText, setReceivedText] = useState<string>(
    'மூன்று பேர் சிக்கியுள்ளனர், உதவி தேவை'
  );
  const [phoneticText, setPhoneticText] = useState<string>(
    'Moondru per sikkiyullanar, udhavi thevai'
  );
  const [priority, setPriority] = useState<PriorityLevel>('EMERGENCY');
  const [lastReceivedTime, setLastReceivedTime] = useState<string>('Just now');
  const [payloadBytes, setPayloadBytes] = useState<number>(124);
  const [confidence, setConfidence] = useState<number>(94);
  const [isTransmitting, setIsTransmitting] = useState<boolean>(false);
  const [emergencyActive, setEmergencyActive] = useState<boolean>(false);

  // Channel & Mesh State
  const [channel, setChannel] = useState<ChannelState>({
    bandwidthKbps: 1.2,
    bandwidthLabel: '1.2 kbps (Weak)',
    latencyMs: 2400,
    packetLossRate: 2,
    isWorsened: false,
    snrDb: 18,
    radioMode: 'lora',
    activePacketsCount: 2
  });

  const [isMeshActive, setIsMeshActive] = useState<boolean>(true);
  const [signalQuality, setSignalQuality] = useState<'strong' | 'moderate' | 'weak' | 'none'>('weak');

  // Pipeline Status (matching initial visual state from screenshot)
  const [pipeline, setPipeline] = useState<PipelineStatus>({
    stt: 'done',
    sttTimeMs: 42,
    trans: 'done',
    transTimeMs: 65,
    decomp: 'done',
    decompTimeMs: 88
  });

  // Packets in Flight (Initial 2 packets matching reference image)
  const [packets, setPackets] = useState<TransmittedPacket[]>([
    {
      id: 'pkt_emerg_init',
      timestamp: '18:21:30',
      priority: 'EMERGENCY',
      fromLang: 'mr',
      toLang: 'ta',
      originalText: 'तीन लोक अडकले आहेत, मदतीची गरज आहे',
      translatedText: 'மூன்று பேர் சிக்கியுள்ளனர், உதவி தேவை',
      phoneticText: 'Moondru per sikkiyullanar, udhavi thevai',
      payloadBytes: 124,
      compressionRatio: 98,
      confidence: 94,
      status: 'transmitting',
      progress: 60,
      latencyMs: 2400,
      snrDb: 18,
      hexDump: 'FF 01 7E AA E0 A4 A4 E0 A5 80 E0 A4 A8 | CRC32: 8A4F'
    },
    {
      id: 'pkt_rtn_init',
      timestamp: '18:21:28',
      priority: 'ROUTINE',
      fromLang: 'mr',
      toLang: 'ta',
      originalText: 'पथक सुरक्षित आहे',
      translatedText: 'குழு பாதுகாப்பாக உள்ளது',
      phoneticText: 'Kuzhu paadhukaappaaga ulladhu',
      payloadBytes: 88,
      compressionRatio: 96,
      confidence: 99,
      status: 'queued',
      progress: 20,
      latencyMs: 2400,
      snrDb: 18,
      hexDump: '00 02 3B CC E0 A4 AA E0 A4 A5 E0 A4 95 | CRC32: 4F19'
    }
  ]);

  // Tactical Logs Initial Entries
  const [logs, setLogs] = useState<TacticalLogEntry[]>([
    {
      id: 'log_1',
      timestamp: '18:21:30.402',
      level: 'EMERGENCY',
      tag: 'PACKET_TX',
      message: 'EMERGENCY priority packet #8812 injected into 868MHz LoRa queue (Payload: 124B, Comp: 98.2%).',
      payloadHex: 'FF 01 7E AA E0 A4 A4 E0 A5 80 E0 A4 A8 20 E0 A4 B2 | CRC32: 8A4F'
    },
    {
      id: 'log_2',
      timestamp: '18:21:28.115',
      level: 'INFO',
      tag: 'PACKET_TX',
      message: 'ROUTINE telemetry packet #8811 sent across VHF relay channel.',
      payloadHex: '00 02 3B CC E0 A4 AA E0 A4 A5 E0 A4 95 20 E0 A4 B8 | CRC32: 4F19'
    },
    {
      id: 'log_3',
      timestamp: '18:21:25.800',
      level: 'RF',
      tag: 'RF_LINK',
      message: 'Modem synchronized on 868.1 MHz. SNR: +18.4 dB. Bit Error Rate: 0.002%.',
      payloadHex: 'A1 B2 C3 D4 E5 F6 07 18 29 3A 4B 5C 6D 7E 8F 90'
    },
    {
      id: 'log_4',
      timestamp: '18:21:20.104',
      level: 'INFO',
      tag: 'AUDIO_DSP',
      message: 'iTantra Neural Vocoder initialized in offline hardware acceleration mode.',
      payloadHex: '01 00 FF 20 00 11 44 22 66 88 AA CC EE 12 34 56'
    }
  ]);

  // App Settings
  const [settings, setSettings] = useState<AppSettings>({
    soundFxEnabled: true,
    autoPlayReceivedSpeech: false,
    speechRate: 1.0,
    speechPitch: 1.0,
    codecEngine: 'neural_vocoder_98',
    encryptionMode: 'AES-256-GCM',
    simulatedMeshHops: 2
  });

  // Modals state
  const [showDocModal, setShowDocModal] = useState<boolean>(false);
  const [showSupportModal, setShowSupportModal] = useState<boolean>(false);
  const [showSettingsModal, setShowSettingsModal] = useState<boolean>(false);

  // Helper to add log
  const addLog = useCallback((level: TacticalLogEntry['level'], tag: string, message: string, payloadHex?: string) => {
    const now = new Date();
    const timeStr = `${now.toTimeString().split(' ')[0]}.${now.getMilliseconds().toString().padStart(3, '0')}`;
    const newEntry: TacticalLogEntry = {
      id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      timestamp: timeStr,
      level,
      tag,
      message,
      payloadHex: payloadHex || generateHexDump(message, level === 'EMERGENCY')
    };
    setLogs(prev => [newEntry, ...prev]);
  }, []);

  // Update transcript from Phone A
  const handleUpdateTranscript = (text: string, isEmerg: boolean) => {
    setCurrentTranscript(text);
    const trans = translateOffline(text, txLanguage.id, rxLanguage.id);
    const bytes = Math.max(72, Math.round(text.length * 3.8));
    setPayloadBytes(bytes);
    setConfidence(trans.confidence);
  };

  // Transmit action across the Channel
  const handleTransmit = (text: string, priorityLevel: PriorityLevel = 'EMERGENCY') => {
    if (!text.trim()) return;

    setIsTransmitting(true);
    const transResult = translateOffline(text, txLanguage.id, rxLanguage.id);
    const bytes = Math.max(84, Math.round(text.length * 3.8));
    setPayloadBytes(bytes);
    setConfidence(transResult.confidence);

    // 1. Pipeline: Speech to Text (STT) starting
    setPipeline(prev => ({ ...prev, stt: 'processing' }));
    tacticalAudio.playPttStart();

    const hex = generateHexDump(text, priorityLevel === 'EMERGENCY');
    const packetId = `pkt_${Date.now()}`;

    const newPacket: TransmittedPacket = {
      id: packetId,
      timestamp: new Date().toTimeString().split(' ')[0],
      priority: priorityLevel,
      fromLang: txLanguage.id,
      toLang: rxLanguage.id,
      originalText: text,
      translatedText: transResult.translatedText,
      phoneticText: transResult.phoneticText,
      payloadBytes: bytes,
      compressionRatio: 98,
      confidence: transResult.confidence,
      status: 'transmitting',
      progress: 0,
      latencyMs: channel.latencyMs,
      snrDb: channel.snrDb,
      hexDump: hex
    };

    setPackets(prev => [newPacket, ...prev.slice(0, 3)]);
    addLog(
      priorityLevel === 'EMERGENCY' ? 'EMERGENCY' : 'INFO',
      'PACKET_TX',
      `Sent ${priorityLevel} packet: "${text.slice(0, 24)}..." (${bytes}B, ${txLanguage.code}→${rxLanguage.code})`,
      hex
    );

    // 2. Transition STT -> Trans
    setTimeout(() => {
      setPipeline(prev => ({ ...prev, stt: 'done', trans: 'processing' }));
    }, 400);

    // 3. Transition Trans -> Decomp
    setTimeout(() => {
      setPipeline(prev => ({ ...prev, trans: 'done', decomp: 'processing' }));
    }, 900);

    // 4. Arrive at Phone B
    const deliveryDelay = Math.max(1200, Math.min(channel.latencyMs, 3200));
    setTimeout(() => {
      setPipeline(prev => ({ ...prev, decomp: 'done' }));
      setIsTransmitting(false);
      setReceivedText(transResult.translatedText);
      setPhoneticText(transResult.phoneticText);
      setPriority(priorityLevel);
      setLastReceivedTime('Just now');

      if (priorityLevel === 'EMERGENCY') {
        tacticalAudio.playEmergencySiren();
      } else {
        tacticalAudio.playRogerBeep();
      }

      addLog(
        priorityLevel === 'EMERGENCY' ? 'EMERGENCY' : 'INFO',
        'PACKET_RX',
        `Phone B received ${priorityLevel} message: "${transResult.translatedText}"`,
        hex
      );

      // Auto-play received voice if enabled
      if (settings.autoPlayReceivedSpeech) {
        tacticalAudio.speakText(
          transResult.translatedText,
          rxLanguage.speechCode,
          settings.speechRate,
          settings.speechPitch
        );
      }
    }, deliveryDelay);
  };

  // Trigger Emergency Action
  const handleTriggerEmergency = () => {
    setEmergencyActive(true);
    tacticalAudio.playEmergencySiren();

    const emergText = 'तीन लोक अडकले आहेत, मदतीची गरज आहे';
    setCurrentTranscript(emergText);
    setPriority('EMERGENCY');

    handleTransmit(emergText, 'EMERGENCY');

    setTimeout(() => {
      setEmergencyActive(false);
    }, 4000);
  };

  // Execute scenario
  const handleExecuteScenario = (scenario: TacticalScenario) => {
    const sLang = SUPPORTED_LANGUAGES.find(l => l.id === scenario.sourceLang) || txLanguage;
    const tLang = SUPPORTED_LANGUAGES.find(l => l.id === scenario.targetLang) || rxLanguage;

    setTxLanguage(sLang);
    setRxLanguage(tLang);
    setCurrentTranscript(scenario.sourceText);
    setPayloadBytes(scenario.payloadBytes);
    setConfidence(scenario.confidence);

    setActiveTab('simulator');
    handleTransmit(scenario.sourceText, scenario.priority);
  };

  // Worsen / Restore Channel toggle
  const handleToggleWorsenLink = () => {
    setChannel(prev => {
      const isWorsened = !prev.isWorsened;
      const updated = {
        ...prev,
        isWorsened,
        bandwidthKbps: isWorsened ? 0.6 : 1.2,
        bandwidthLabel: isWorsened ? '0.6 kbps (Degraded)' : '1.2 kbps (Weak)',
        latencyMs: isWorsened ? 4800 : 2400,
        packetLossRate: isWorsened ? 18 : 2
      };
      addLog(
        'RF',
        'RF_LINK',
        isWorsened
          ? 'Link degraded to 0.6 kbps (Latency: 4800ms, Loss: 18%)'
          : 'Link restored to 1.2 kbps baseline'
      );
      return updated;
    });
  };

  // Clear Queue
  const handleClearQueue = () => {
    setPackets([]);
    addLog('INFO', 'PACKET_TX', 'Transmission queue cleared by operator');
  };

  // Inject Test Packet
  const handleInjectTestPacket = (prio: 'EMERGENCY' | 'ROUTINE') => {
    const txt = prio === 'EMERGENCY' ? 'तातडीने मदत पाठवा' : 'सेक्टर २ सुरक्षित आहे';
    handleTransmit(txt, prio);
  };

  // Cycle cellular signal
  const handleCycleSignal = () => {
    const nextMap: Record<string, 'strong' | 'moderate' | 'weak' | 'none'> = {
      strong: 'moderate',
      moderate: 'weak',
      weak: 'none',
      none: 'strong'
    };
    const next = nextMap[signalQuality];
    setSignalQuality(next);
    addLog('RF', 'CELL_LINK', `Cellular link switched to: ${next.toUpperCase()}`);
  };

  return (
    <div className="min-h-screen flex bg-[#131313] text-[#e5e2e1] antialiased select-none font-sans-tactical">
      {/* Side Navigation Bar matching exact specifications */}
      <SideNavBar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onTriggerEmergency={handleTriggerEmergency}
        onOpenDoc={() => setShowDocModal(true)}
        onOpenSupport={() => setShowSupportModal(true)}
        emergencyActive={emergencyActive}
      />

      {/* Main Workspace Area */}
      <main className="ml-64 flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Header Bar */}
        <TopAppBar
          onOpenSettings={() => setShowSettingsModal(true)}
          isMeshActive={isMeshActive}
          onToggleMesh={() => {
            setIsMeshActive(!isMeshActive);
            addLog('RF', 'MESH_MODE', isMeshActive ? 'Mesh Relay disabled' : 'P2P Mesh Relay active');
          }}
          signalQuality={signalQuality}
          onCycleSignal={handleCycleSignal}
        />

        {/* Dynamic View Selector */}
        {activeTab === 'simulator' && (
          <div className="flex-1 p-4 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-6 overflow-hidden">
            {/* Phone A (Transmitter) */}
            <PhoneAPanel
              txLanguage={txLanguage}
              onSelectTxLanguage={(lang) => {
                setTxLanguage(lang);
                addLog('INFO', 'TX_NODE', `TX Language changed to ${lang.name}`);
              }}
              currentTranscript={currentTranscript}
              onUpdateTranscript={handleUpdateTranscript}
              onTransmit={handleTransmit}
              isTransmitting={isTransmitting}
              payloadBytes={payloadBytes}
              confidence={confidence}
            />

            {/* Central Channel Monitor */}
            <ChannelMonitor
              channel={channel}
              onToggleWorsenLink={handleToggleWorsenLink}
              onClearQueue={handleClearQueue}
              packets={packets}
              onInjectTestPacket={handleInjectTestPacket}
            />

            {/* Phone B (Receiver) */}
            <PhoneBPanel
              rxLanguage={rxLanguage}
              onSelectRxLanguage={(lang) => {
                setRxLanguage(lang);
                addLog('INFO', 'RX_NODE', `RX Language changed to ${lang.name}`);
              }}
              receivedText={receivedText}
              phoneticText={phoneticText}
              priority={priority}
              timestamp={lastReceivedTime}
              pipeline={pipeline}
            />
          </div>
        )}

        {activeTab === 'scenarios' && (
          <ScenariosView onExecuteScenario={handleExecuteScenario} />
        )}

        {activeTab === 'link-quality' && (
          <LinkQualityView
            channel={channel}
            onUpdateChannel={(updated) => setChannel(prev => ({ ...prev, ...updated }))}
          />
        )}

        {activeTab === 'logs' && (
          <LogsView logs={logs} onClearLogs={() => setLogs([])} />
        )}
      </main>

      {/* Modals Container */}
      <Modals
        showDocModal={showDocModal}
        onCloseDocModal={() => setShowDocModal(false)}
        showSupportModal={showSupportModal}
        onCloseSupportModal={() => setShowSupportModal(false)}
        showSettingsModal={showSettingsModal}
        onCloseSettingsModal={() => setShowSettingsModal(false)}
        settings={settings}
        onUpdateSettings={(updated) => setSettings(prev => ({ ...prev, ...updated }))}
      />
    </div>
  );
}
