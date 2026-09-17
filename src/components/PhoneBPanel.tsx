import React, { useState } from 'react';
import { Language, PipelineStatus, PriorityLevel } from '../types';
import { SUPPORTED_LANGUAGES } from '../data/languages';
import { tacticalAudio } from '../utils/audioSynthesizer';

interface PhoneBPanelProps {
  rxLanguage: Language;
  onSelectRxLanguage: (lang: Language) => void;
  receivedText: string;
  phoneticText: string;
  priority: PriorityLevel;
  timestamp: string;
  pipeline: PipelineStatus;
}

export const PhoneBPanel: React.FC<PhoneBPanelProps> = ({
  rxLanguage,
  onSelectRxLanguage,
  receivedText,
  phoneticText,
  priority,
  timestamp,
  pipeline
}) => {
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [batteryLevel, setBatteryLevel] = useState(92);
  const [audioSpeed, setAudioSpeed] = useState<number>(1.0);

  const handlePlayAudio = () => {
    if (!receivedText) return;
    setIsPlayingAudio(true);

    const success = tacticalAudio.speakText(
      receivedText,
      rxLanguage.speechCode,
      audioSpeed,
      1.0,
      () => setIsPlayingAudio(true),
      () => setIsPlayingAudio(false)
    );

    if (!success) {
      // If Web Speech is unavailable, simulate 2s playback
      setTimeout(() => {
        setIsPlayingAudio(false);
        tacticalAudio.playRogerBeep();
      }, 2000);
    }
  };

  return (
    <div className="glass-panel rounded-xl flex flex-col overflow-hidden h-full bg-[#1a1f26]/80 border border-[#3b494c] shadow-lg relative">
      {/* Panel Header */}
      <div className="p-4 border-b border-[#3b494c] flex justify-between items-center bg-[#201f1f]">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#bac9cc] text-[22px]">smartphone</span>
          <h2 className="font-sans-tactical text-lg font-bold text-[#e5e2e1]">Phone B</h2>
          <span className="text-xs text-[#849396] font-mono-tactical hidden sm:inline">(Rx Node)</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="px-2 py-0.5 bg-[#353534] text-[#bac9cc] font-mono-tactical text-[10px] rounded uppercase tracking-widest border border-[#3b494c]">
            Offline
          </span>
          <div
            title={`Battery: ${batteryLevel}%`}
            onClick={() => setBatteryLevel(prev => (prev > 30 ? prev - 20 : 98))}
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
            id="rx-lang-selector"
            onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
            className="bg-[#1c1b1b] border border-[#3b494c] rounded p-3 cursor-pointer hover:border-[#00daf3] transition-colors group select-none"
          >
            <div className="font-mono-tactical text-xs text-[#bac9cc] mb-1 uppercase tracking-wider">
              RX Language
            </div>
            <div className="flex justify-between items-center">
              <span className="font-mono-tactical text-lg font-bold text-[#00daf3]">
                {rxLanguage.name}
              </span>
              <span className="material-symbols-outlined text-[#bac9cc] group-hover:text-[#00daf3] transition-transform duration-200" style={{ transform: isLangDropdownOpen ? 'rotate(180deg)' : 'none' }}>
                expand_more
              </span>
            </div>
          </div>

          {/* Language Dropdown */}
          {isLangDropdownOpen && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-[#201f1f] border border-[#00daf3] rounded shadow-2xl z-50 max-h-56 overflow-y-auto">
              {SUPPORTED_LANGUAGES.map(lang => (
                <button
                  key={lang.code}
                  onClick={() => {
                    onSelectRxLanguage(lang);
                    setIsLangDropdownOpen(false);
                  }}
                  className={`w-full px-4 py-2.5 text-left font-mono-tactical text-sm flex items-center justify-between hover:bg-[#353534] transition-colors ${
                    lang.code === rxLanguage.code ? 'bg-[#00daf3]/15 text-[#00daf3] font-bold' : 'text-[#e5e2e1]'
                  }`}
                >
                  <span>{lang.name}</span>
                  <span className="text-xs text-[#bac9cc]">{lang.nativeName}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Processing Status Pipeline */}
        <div className="bg-[#1c1b1b]/60 border border-[#3b494c] rounded p-3 my-2">
          <div className="flex items-center justify-between px-2 mb-2">
            {/* STT Node */}
            <div className="flex flex-col items-center gap-1">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                  pipeline.stt === 'done'
                    ? 'bg-[#00daf3] text-[#001f24]'
                    : pipeline.stt === 'processing'
                    ? 'bg-[#fabd00] text-[#261a00] animate-spin'
                    : 'border-2 border-[#3b494c] bg-[#201f1f] text-[#bac9cc]'
                }`}
              >
                <span className="material-symbols-outlined text-[14px]">
                  {pipeline.stt === 'done' ? 'check' : pipeline.stt === 'processing' ? 'refresh' : 'mic'}
                </span>
              </div>
              <span className="font-mono-tactical text-[10px] text-[#bac9cc] uppercase font-bold">
                STT
              </span>
            </div>

            {/* Link 1 */}
            <div className={`flex-1 h-px mx-2 transition-colors ${pipeline.stt === 'done' ? 'bg-[#00daf3]' : 'bg-[#3b494c]'}`} />

            {/* Trans Node */}
            <div className="flex flex-col items-center gap-1">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                  pipeline.trans === 'done'
                    ? 'bg-[#00daf3] text-[#001f24]'
                    : pipeline.trans === 'processing'
                    ? 'bg-[#fabd00] text-[#261a00] animate-spin'
                    : 'border-2 border-[#3b494c] bg-[#201f1f] text-[#bac9cc]'
                }`}
              >
                <span className="material-symbols-outlined text-[14px]">
                  {pipeline.trans === 'done' ? 'check' : pipeline.trans === 'processing' ? 'refresh' : 'translate'}
                </span>
              </div>
              <span className="font-mono-tactical text-[10px] text-[#bac9cc] uppercase font-bold">
                Trans
              </span>
            </div>

            {/* Link 2 */}
            <div className={`flex-1 h-px mx-2 transition-colors ${pipeline.trans === 'done' ? 'bg-[#00daf3]' : 'bg-[#3b494c]'}`} />

            {/* Decomp Node */}
            <div className="flex flex-col items-center gap-1">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                  pipeline.decomp === 'done'
                    ? 'bg-[#00daf3] text-[#001f24]'
                    : pipeline.decomp === 'processing'
                    ? 'bg-[#fabd00] text-[#261a00] animate-spin'
                    : 'border-2 border-[#3b494c] bg-[#201f1f] text-[#bac9cc]'
                }`}
              >
                <span className="material-symbols-outlined text-[14px]">
                  {pipeline.decomp === 'done' ? 'check' : pipeline.decomp === 'processing' ? 'refresh' : 'hourglass_empty'}
                </span>
              </div>
              <span className="font-mono-tactical text-[10px] text-[#bac9cc] uppercase font-bold">
                Decomp
              </span>
            </div>
          </div>

          <div className="flex justify-between text-[9px] font-mono-tactical text-[#849396] px-1">
            <span>STT: {pipeline.sttTimeMs}ms</span>
            <span>Trans: {pipeline.transTimeMs}ms</span>
            <span>Decomp: {pipeline.decompTimeMs}ms</span>
          </div>
        </div>

        {/* Received Message Box */}
        <div
          className={`bg-[#0e0e0e] border-l-4 p-4 rounded-r mt-auto shadow-xl transition-all duration-300 ${
            priority === 'EMERGENCY'
              ? 'border-[#ff562c] shadow-[0_0_20px_rgba(255,86,44,0.2)]'
              : 'border-[#00daf3]'
          }`}
        >
          <div className="flex justify-between items-start mb-2">
            <div
              className={`font-mono-tactical flex items-center gap-1 text-[10px] uppercase tracking-widest font-bold ${
                priority === 'EMERGENCY' ? 'text-[#ffb4ab]' : 'text-[#00daf3]'
              }`}
            >
              <span className="material-symbols-outlined text-[15px]">
                {priority === 'EMERGENCY' ? 'warning' : 'info'}
              </span>
              <span>{priority === 'EMERGENCY' ? 'Priority Alert' : 'Routine Message'}</span>
            </div>
            <span className="font-mono-tactical text-[10px] text-[#bac9cc]">{timestamp}</span>
          </div>

          {/* Translated text in target language */}
          <p className="font-sans-tactical text-base font-semibold text-[#e5e2e1] mb-2 leading-relaxed">
            "{receivedText}"
          </p>

          {/* Phonetic guide / English subtitle */}
          {phoneticText && (
            <p className="font-mono-tactical text-xs text-[#849396] italic mb-4">
              Phonetic: {phoneticText}
            </p>
          )}

          {/* Speed selector & Play Button */}
          <div className="flex gap-2 items-center mb-1">
            <div className="flex bg-[#201f1f] rounded border border-[#3b494c] p-0.5 text-[10px] font-mono-tactical">
              {[0.8, 1.0, 1.25].map(spd => (
                <button
                  key={spd}
                  onClick={() => setAudioSpeed(spd)}
                  className={`px-1.5 py-0.5 rounded ${audioSpeed === spd ? 'bg-[#00daf3] text-[#001f24] font-bold' : 'text-[#bac9cc]'}`}
                >
                  {spd}x
                </button>
              ))}
            </div>

            <button
              id="play-speech-btn"
              onClick={handlePlayAudio}
              disabled={isPlayingAudio}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded font-mono-tactical text-xs font-bold transition-all active:scale-95 duration-100 ${
                isPlayingAudio
                  ? 'bg-[#ffc948] text-[#3f2e00] animate-pulse'
                  : 'bg-[#00daf3] text-[#001f24] hover:bg-[#c3f5ff]'
              }`}
            >
              <span
                className="material-symbols-outlined text-[18px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                {isPlayingAudio ? 'volume_up' : 'play_arrow'}
              </span>
              <span>{isPlayingAudio ? 'Playing Audio...' : 'Play Translated Speech'}</span>
            </button>
          </div>

          {/* Audio Waveform bar during playback */}
          {isPlayingAudio && (
            <div className="flex items-center justify-center gap-1 mt-2 h-4">
              {[6, 14, 20, 12, 18, 8, 16, 22, 10, 5, 15, 9].map((h, i) => (
                <div
                  key={i}
                  className="w-1 bg-[#00daf3] rounded-full animate-bounce"
                  style={{
                    height: `${h}px`,
                    animationDelay: `${i * 70}ms`
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
