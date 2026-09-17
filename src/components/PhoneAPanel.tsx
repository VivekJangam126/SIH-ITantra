import React, { useState, useEffect, useRef } from 'react';
import { Language, PriorityLevel } from '../types';
import { SUPPORTED_LANGUAGES, EMERGENCY_PHRASES } from '../data/languages';
import { tacticalAudio } from '../utils/audioSynthesizer';

interface PhoneAPanelProps {
  txLanguage: Language;
  onSelectTxLanguage: (lang: Language) => void;
  currentTranscript: string;
  onUpdateTranscript: (text: string, isEmergency: boolean) => void;
  onTransmit: (text: string, priority: PriorityLevel) => void;
  isTransmitting: boolean;
  payloadBytes: number;
  confidence: number;
}

export const PhoneAPanel: React.FC<PhoneAPanelProps> = ({
  txLanguage,
  onSelectTxLanguage,
  currentTranscript,
  onUpdateTranscript,
  onTransmit,
  isTransmitting,
  payloadBytes,
  confidence
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const [showPresets, setShowPresets] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [customInputMode, setCustomInputMode] = useState(false);
  const [batteryLevel, setBatteryLevel] = useState(88);

  const recognitionRef = useRef<any>(null);
  const audioAnimationRef = useRef<number | null>(null);

  // Initialize Web Speech Recognition if available
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = txLanguage.speechCode;

        recognition.onresult = (event: any) => {
          let interimTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              const text = event.results[i][0].transcript;
              onUpdateTranscript(text, true);
            } else {
              interimTranscript += event.results[i][0].transcript;
            }
          }
          if (interimTranscript) {
            onUpdateTranscript(interimTranscript, true);
          }
        };

        recognition.onerror = () => {
          setIsRecording(false);
        };

        recognition.onend = () => {
          setIsRecording(false);
        };

        recognitionRef.current = recognition;
      }
    }
  }, [txLanguage, onUpdateTranscript]);

  const startRecording = () => {
    setIsRecording(true);
    tacticalAudio.playPttStart();

    // Start animated visualizer waveform
    let frame = 0;
    const animateWave = () => {
      frame++;
      setAudioLevel(0.3 + Math.sin(frame * 0.3) * 0.4 + Math.random() * 0.3);
      audioAnimationRef.current = requestAnimationFrame(animateWave);
    };
    audioAnimationRef.current = requestAnimationFrame(animateWave);

    if (recognitionRef.current) {
      try {
        recognitionRef.current.lang = txLanguage.speechCode;
        recognitionRef.current.start();
      } catch {
        // May already be started
      }
    }
  };

  const stopRecordingAndSend = () => {
    if (!isRecording) return;
    setIsRecording(false);
    tacticalAudio.playPttEnd();

    if (audioAnimationRef.current) {
      cancelAnimationFrame(audioAnimationRef.current);
    }
    setAudioLevel(0);

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // ignore
      }
    }

    // Auto transmit recorded speech or current transcript
    onTransmit(currentTranscript, 'EMERGENCY');
  };

  const handleSelectPreset = (phraseText: string, isEmerg: boolean) => {
    onUpdateTranscript(phraseText, isEmerg);
    setShowPresets(false);
    onTransmit(phraseText, isEmerg ? 'EMERGENCY' : 'ROUTINE');
  };

  return (
    <div className="glass-panel rounded-xl flex flex-col overflow-hidden h-full bg-[#1a1f26]/80 border border-[#3b494c] shadow-lg relative">
      {/* Panel Header */}
      <div className="p-4 border-b border-[#3b494c] flex justify-between items-center bg-[#201f1f]">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#bac9cc] text-[22px]">smartphone</span>
          <h2 className="font-sans-tactical text-lg font-bold text-[#e5e2e1]">Phone A</h2>
          <span className="text-xs text-[#849396] font-mono-tactical hidden sm:inline">(Tx Node)</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="px-2 py-0.5 bg-[#353534] text-[#bac9cc] font-mono-tactical text-[10px] rounded uppercase tracking-widest border border-[#3b494c]">
            Offline
          </span>
          <div
            title={`Battery: ${batteryLevel}%`}
            onClick={() => setBatteryLevel(prev => (prev > 30 ? prev - 25 : 95))}
            className="flex items-center cursor-pointer text-[#00daf3] hover:text-[#c3f5ff]"
          >
            <span className="material-symbols-outlined text-[20px]">
              {batteryLevel > 75 ? 'battery_5_bar' : batteryLevel > 40 ? 'battery_3_bar' : 'battery_1_bar'}
            </span>
          </div>
        </div>
      </div>

      {/* Main Content Body */}
      <div className="p-4 flex-1 flex flex-col gap-4 overflow-y-auto">
        {/* Language Selector */}
        <div className="relative">
          <div
            id="tx-lang-selector"
            onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
            className="bg-[#1c1b1b] border border-[#3b494c] rounded p-3 cursor-pointer hover:border-[#00daf3] transition-colors group select-none"
          >
            <div className="font-mono-tactical text-xs text-[#bac9cc] mb-1 uppercase tracking-wider">
              TX Language
            </div>
            <div className="flex justify-between items-center">
              <span className="font-mono-tactical text-lg font-bold text-[#00daf3]">
                {txLanguage.name}
              </span>
              <span className="material-symbols-outlined text-[#bac9cc] group-hover:text-[#00daf3] transition-transform duration-200" style={{ transform: isLangDropdownOpen ? 'rotate(180deg)' : 'none' }}>
                expand_more
              </span>
            </div>
          </div>

          {/* Language Dropdown Menu */}
          {isLangDropdownOpen && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-[#201f1f] border border-[#00daf3] rounded shadow-2xl z-50 max-h-56 overflow-y-auto">
              {SUPPORTED_LANGUAGES.map(lang => (
                <button
                  key={lang.code}
                  onClick={() => {
                    onSelectTxLanguage(lang);
                    setIsLangDropdownOpen(false);
                  }}
                  className={`w-full px-4 py-2.5 text-left font-mono-tactical text-sm flex items-center justify-between hover:bg-[#353534] transition-colors ${
                    lang.code === txLanguage.code ? 'bg-[#00daf3]/15 text-[#00daf3] font-bold' : 'text-[#e5e2e1]'
                  }`}
                >
                  <span>{lang.name}</span>
                  <span className="text-xs text-[#bac9cc]">{lang.nativeName}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Mic Control Button Area */}
        <div className="flex-1 flex flex-col items-center justify-center my-4 min-h-[160px]">
          <div className="relative flex flex-col items-center">
            <button
              id="ptt-mic-button"
              onMouseDown={startRecording}
              onMouseUp={stopRecordingAndSend}
              onTouchStart={startRecording}
              onTouchEnd={stopRecordingAndSend}
              className={`w-32 h-32 rounded-full flex flex-col items-center justify-center transition-all active:scale-95 duration-150 border-2 select-none shadow-xl ${
                isRecording
                  ? 'bg-[#ff562c] text-white border-white scale-105 shadow-[0_0_30px_rgba(255,86,44,0.8)]'
                  : 'bg-[#2a2a2a] border-[#00daf3] text-[#00daf3] pulse-ring hover:bg-[#00daf3] hover:text-[#001f24]'
              }`}
            >
              <span
                className="material-symbols-outlined text-4xl mb-1"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                {isRecording ? 'graphic_eq' : 'mic'}
              </span>
              <span className="font-mono-tactical text-[10px] uppercase tracking-widest font-bold">
                {isRecording ? 'RELEASE TO TX' : 'HOLD TO SPEAK'}
              </span>
            </button>

            {/* Audio Waveform visualization when recording */}
            {isRecording && (
              <div className="flex items-center gap-1 mt-3 h-5">
                {[4, 12, 18, 22, 16, 8, 14, 20, 10, 5].map((h, i) => (
                  <div
                    key={i}
                    className="w-1 bg-[#00daf3] rounded-full transition-all duration-75"
                    style={{
                      height: `${Math.max(4, h * audioLevel * (0.5 + (i % 3) * 0.3))}px`
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Quick preset phrases button */}
          <div className="flex gap-2 mt-3">
            <button
              id="preset-phrases-toggle"
              onClick={() => setShowPresets(!showPresets)}
              className="text-[11px] font-mono-tactical text-[#00daf3] hover:underline flex items-center gap-1 bg-[#353534]/60 px-2.5 py-1 rounded border border-[#3b494c]"
            >
              <span className="material-symbols-outlined text-[14px]">bolt</span>
              <span>Tactical Presets</span>
            </button>

            <button
              id="custom-input-toggle"
              onClick={() => setCustomInputMode(!customInputMode)}
              className="text-[11px] font-mono-tactical text-[#bac9cc] hover:text-[#e5e2e1] flex items-center gap-1 bg-[#353534]/60 px-2.5 py-1 rounded border border-[#3b494c]"
            >
              <span className="material-symbols-outlined text-[14px]">edit_note</span>
              <span>{customInputMode ? 'Hide Editor' : 'Edit Text'}</span>
            </button>
          </div>
        </div>

        {/* Preset list popup */}
        {showPresets && (
          <div className="bg-[#0e0e0e] border border-[#00daf3]/50 rounded p-2.5 space-y-1.5 shadow-xl text-xs font-mono-tactical">
            <div className="text-[10px] uppercase tracking-wider text-[#bac9cc] font-bold pb-1 border-b border-[#3b494c] flex justify-between items-center">
              <span>Select Emergency Phrase ({txLanguage.name.split(' ')[0]})</span>
              <button onClick={() => setShowPresets(false)} className="text-[#bac9cc] hover:text-white">✕</button>
            </div>
            {EMERGENCY_PHRASES.map(p => {
              const phraseInLang = p.translations[txLanguage.id] || p.translations['mr'];
              return (
                <button
                  key={p.id}
                  onClick={() => handleSelectPreset(phraseInLang.text, p.isEmergency)}
                  className="w-full text-left p-2 rounded bg-[#1c1b1b] hover:bg-[#353534] text-[#e5e2e1] flex items-start gap-2 transition-colors border border-transparent hover:border-[#00daf3]/40"
                >
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase mt-0.5 ${p.isEmergency ? 'bg-[#93000a] text-[#ffdad6]' : 'bg-[#00626e] text-[#c3f5ff]'}`}>
                    {p.isEmergency ? 'EMERG' : 'RTN'}
                  </span>
                  <span className="flex-1 font-sans-tactical">{phraseInLang.text}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Custom text editor mode */}
        {customInputMode && (
          <div className="bg-[#0e0e0e] border border-[#3b494c] rounded p-2 flex gap-2">
            <input
              type="text"
              value={currentTranscript}
              onChange={(e) => onUpdateTranscript(e.target.value, true)}
              placeholder="Enter custom speech transcript..."
              className="flex-1 bg-[#1c1b1b] border border-[#3b494c] rounded px-3 py-1.5 text-xs text-[#e5e2e1] focus:outline-none focus:border-[#00daf3]"
            />
            <button
              onClick={() => onTransmit(currentTranscript, 'EMERGENCY')}
              disabled={isTransmitting}
              className="px-3 py-1 bg-[#00e5ff] text-[#00626e] font-mono-tactical font-bold text-xs rounded hover:bg-[#00daf3] transition-colors"
            >
              TX
            </button>
          </div>
        )}

        {/* Live Transcript Display matching reference */}
        <div className="bg-[#0e0e0e] border-l-4 border-[#00daf3] p-4 rounded-r relative shadow-inner">
          <div className="font-mono-tactical text-xs text-[#bac9cc] mb-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#ff562c] animate-pulse"></span>
              <span className="font-semibold uppercase tracking-wider">Live Transcript</span>
            </div>
            {isTransmitting && (
              <span className="text-[10px] text-[#00daf3] font-bold animate-pulse">
                UPLOADING TO MESH...
              </span>
            )}
          </div>
          <p className="font-sans-tactical text-base font-medium text-[#e5e2e1] leading-relaxed">
            "{currentTranscript}"
          </p>
        </div>

        {/* Stats Grid at Bottom */}
        <div className="grid grid-cols-2 gap-3 mt-auto pt-2">
          <div className="bg-[#201f1f] p-3 rounded border border-[#3b494c]">
            <div className="font-mono-tactical text-[#bac9cc] mb-1 text-[10px] uppercase tracking-wider">
              Payload
            </div>
            <div className="font-mono-tactical text-[#e5e2e1] text-sm font-bold">
              {payloadBytes}B <span className="text-[#00daf3] text-xs font-normal">(98% compr)</span>
            </div>
          </div>
          <div className="bg-[#201f1f] p-3 rounded border border-[#3b494c]">
            <div className="font-mono-tactical text-[#bac9cc] mb-1 text-[10px] uppercase tracking-wider">
              Confidence
            </div>
            <div className="font-mono-tactical text-[#e5e2e1] text-sm font-bold">
              {confidence}%
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
