import React from 'react';
import { AppSettings } from '../types';
import { tacticalAudio } from '../utils/audioSynthesizer';

interface ModalsProps {
  showDocModal: boolean;
  onCloseDocModal: () => void;
  showSupportModal: boolean;
  onCloseSupportModal: () => void;
  showSettingsModal: boolean;
  onCloseSettingsModal: () => void;
  settings: AppSettings;
  onUpdateSettings: (updated: Partial<AppSettings>) => void;
}

export const Modals: React.FC<ModalsProps> = ({
  showDocModal,
  onCloseDocModal,
  showSupportModal,
  onCloseSupportModal,
  showSettingsModal,
  onCloseSettingsModal,
  settings,
  onUpdateSettings
}) => {
  if (!showDocModal && !showSupportModal && !showSettingsModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      {/* Documentation Modal */}
      {showDocModal && (
        <div className="bg-[#1c1b1b] border border-[#3b494c] rounded-xl max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden shadow-2xl">
          <div className="p-5 border-b border-[#3b494c] flex justify-between items-center bg-[#201f1f]">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#00daf3]">description</span>
              <h3 className="font-sans-tactical text-lg font-bold text-[#e5e2e1]">
                iTantra Tactical Documentation
              </h3>
            </div>
            <button onClick={onCloseDocModal} className="text-[#bac9cc] hover:text-[#e5e2e1]">
              ✕
            </button>
          </div>

          <div className="p-6 overflow-y-auto space-y-4 text-sm font-sans-tactical text-[#bac9cc] leading-relaxed">
            <section>
              <h4 className="font-bold text-[#00daf3] text-base mb-1">1. System Architecture Overview</h4>
              <p>
                iTantra is an offline-first tactical speech-to-speech translation framework engineered for disaster relief, search & rescue, and extreme low-bandwidth communication environments where cellular and internet backhauls are destroyed.
              </p>
            </section>

            <section>
              <h4 className="font-bold text-[#00daf3] text-base mb-1">2. Three-Stage Transmission Pipeline</h4>
              <ul className="list-disc list-inside space-y-1 text-xs font-mono-tactical text-[#e5e2e1]">
                <li><strong className="text-[#00daf3]">STT (Speech-to-Text):</strong> On-device acoustic model transcribes local dialect voice into tokenized text.</li>
                <li><strong className="text-[#00daf3]">Translation & Compression:</strong> Translates across Indian/Tactical languages and encodes text into neural semantic vectors (~120 Bytes per sentence, 98% compression).</li>
                <li><strong className="text-[#00daf3]">Decompression & TTS:</strong> Receiver station reconstructs synthesized audio with phonetic inflections.</li>
              </ul>
            </section>

            <section>
              <h4 className="font-bold text-[#00daf3] text-base mb-1">3. Radio Mesh Protocol</h4>
              <p>
                Operates across 868 MHz LoRa, tactical VHF (148 MHz), and BLE mesh relays. Emergency priority packets preempt routine traffic queues with automatic frequency hopping.
              </p>
            </section>
          </div>

          <div className="p-4 border-t border-[#3b494c] bg-[#201f1f] flex justify-end">
            <button
              onClick={onCloseDocModal}
              className="px-4 py-2 bg-[#00daf3] text-[#001f24] rounded font-mono-tactical text-xs font-bold hover:bg-[#c3f5ff]"
            >
              Close Manual
            </button>
          </div>
        </div>
      )}

      {/* Support & Diagnostics Modal */}
      {showSupportModal && (
        <div className="bg-[#1c1b1b] border border-[#3b494c] rounded-xl max-w-lg w-full flex flex-col overflow-hidden shadow-2xl">
          <div className="p-5 border-b border-[#3b494c] flex justify-between items-center bg-[#201f1f]">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#00daf3]">help</span>
              <h3 className="font-sans-tactical text-lg font-bold text-[#e5e2e1]">
                Tactical Diagnostic & Support
              </h3>
            </div>
            <button onClick={onCloseSupportModal} className="text-[#bac9cc] hover:text-[#e5e2e1]">
              ✕
            </button>
          </div>

          <div className="p-6 space-y-4 text-xs font-mono-tactical text-[#bac9cc]">
            <div className="p-3 bg-[#131313] rounded border border-[#3b494c] space-y-2">
              <div className="text-[#00daf3] font-bold uppercase">Audio Subsystem Diagnostics</div>
              <div className="flex justify-between items-center">
                <span>Test Roger Beep Synthesizer:</span>
                <button
                  onClick={() => tacticalAudio.playRogerBeep()}
                  className="px-2.5 py-1 bg-[#353534] text-[#e5e2e1] rounded hover:bg-[#3a3939] text-[11px]"
                >
                  Play Tone
                </button>
              </div>
              <div className="flex justify-between items-center">
                <span>Test Emergency Siren:</span>
                <button
                  onClick={() => tacticalAudio.playEmergencySiren()}
                  className="px-2.5 py-1 bg-[#93000a] text-[#ffdad6] rounded hover:bg-[#ff562c] text-[11px] font-bold"
                >
                  Play Siren
                </button>
              </div>
              <div className="flex justify-between items-center">
                <span>Test Radio Squelch:</span>
                <button
                  onClick={() => tacticalAudio.playPttEnd()}
                  className="px-2.5 py-1 bg-[#353534] text-[#e5e2e1] rounded hover:bg-[#3a3939] text-[11px]"
                >
                  Test Squelch
                </button>
              </div>
            </div>

            <div className="p-3 bg-[#131313] rounded border border-[#3b494c] space-y-1.5 text-[11px]">
              <div className="text-[#00daf3] font-bold uppercase">Field Unit Specs</div>
              <div className="flex justify-between">
                <span>Web Audio API:</span>
                <span className="text-[#00daf3]">ONLINE / READY</span>
              </div>
              <div className="flex justify-between">
                <span>Speech Recognition:</span>
                <span className="text-[#00daf3]">READY (Webkit / Built-in)</span>
              </div>
              <div className="flex justify-between">
                <span>Mesh Channel Status:</span>
                <span className="text-[#00daf3]">P2P READY</span>
              </div>
            </div>
          </div>

          <div className="p-4 border-t border-[#3b494c] bg-[#201f1f] flex justify-end">
            <button
              onClick={onCloseSupportModal}
              className="px-4 py-2 bg-[#00daf3] text-[#001f24] rounded font-mono-tactical text-xs font-bold hover:bg-[#c3f5ff]"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettingsModal && (
        <div className="bg-[#1c1b1b] border border-[#3b494c] rounded-xl max-w-lg w-full flex flex-col overflow-hidden shadow-2xl">
          <div className="p-5 border-b border-[#3b494c] flex justify-between items-center bg-[#201f1f]">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#00daf3]">settings</span>
              <h3 className="font-sans-tactical text-lg font-bold text-[#e5e2e1]">
                Simulator Settings
              </h3>
            </div>
            <button onClick={onCloseSettingsModal} className="text-[#bac9cc] hover:text-[#e5e2e1]">
              ✕
            </button>
          </div>

          <div className="p-6 space-y-4 text-xs font-mono-tactical text-[#bac9cc]">
            {/* Audio FX Toggle */}
            <div className="flex justify-between items-center py-2 border-b border-[#3b494c]/50">
              <div>
                <div className="font-bold text-[#e5e2e1]">Tactical Audio Sound FX</div>
                <div className="text-[11px] text-[#849396]">Walkie-talkie clicks, beeps, and siren tones</div>
              </div>
              <input
                type="checkbox"
                checked={settings.soundFxEnabled}
                onChange={(e) => {
                  const enabled = e.target.checked;
                  onUpdateSettings({ soundFxEnabled: enabled });
                  tacticalAudio.setMuted(!enabled);
                }}
                className="w-4 h-4 accent-[#00daf3] cursor-pointer"
              />
            </div>

            {/* Auto Play Speech Toggle */}
            <div className="flex justify-between items-center py-2 border-b border-[#3b494c]/50">
              <div>
                <div className="font-bold text-[#e5e2e1]">Auto-play Received Speech</div>
                <div className="text-[11px] text-[#849396]">Automatically speak when Phone B receives packet</div>
              </div>
              <input
                type="checkbox"
                checked={settings.autoPlayReceivedSpeech}
                onChange={(e) => onUpdateSettings({ autoPlayReceivedSpeech: e.target.checked })}
                className="w-4 h-4 accent-[#00daf3] cursor-pointer"
              />
            </div>

            {/* Codec engine */}
            <div className="py-2 border-b border-[#3b494c]/50">
              <div className="font-bold text-[#e5e2e1] mb-1">Compression Engine Mode</div>
              <select
                value={settings.codecEngine}
                onChange={(e) => onUpdateSettings({ codecEngine: e.target.value as any })}
                className="w-full bg-[#131313] border border-[#3b494c] rounded px-3 py-2 text-xs text-[#00daf3] focus:border-[#00daf3] focus:outline-none"
              >
                <option value="neural_vocoder_98">iTantra Neural Vocoder (98% compression, ~120B)</option>
                <option value="codec2_92">Codec2 Sinusoidal Vocoder (92% compression, ~450B)</option>
                <option value="lpc10_85">LPC-10 Military Standard (85% compression, ~1.2kB)</option>
                <option value="raw_pcm">Raw Uncompressed PCM</option>
              </select>
            </div>

            {/* Encryption Mode */}
            <div className="py-2">
              <div className="font-bold text-[#e5e2e1] mb-1">Link Layer Encryption</div>
              <select
                value={settings.encryptionMode}
                onChange={(e) => onUpdateSettings({ encryptionMode: e.target.value as any })}
                className="w-full bg-[#131313] border border-[#3b494c] rounded px-3 py-2 text-xs text-[#e5e2e1] focus:border-[#00daf3] focus:outline-none"
              >
                <option value="AES-256-GCM">AES-256-GCM (Tactical Hardware Encrypted)</option>
                <option value="ChaCha20-Poly1305">ChaCha20-Poly1305 (Ultra-low compute)</option>
                <option value="None">None (Cleartext Beacon)</option>
              </select>
            </div>
          </div>

          <div className="p-4 border-t border-[#3b494c] bg-[#201f1f] flex justify-end">
            <button
              onClick={onCloseSettingsModal}
              className="px-4 py-2 bg-[#00daf3] text-[#001f24] rounded font-mono-tactical text-xs font-bold hover:bg-[#c3f5ff]"
            >
              Save & Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
