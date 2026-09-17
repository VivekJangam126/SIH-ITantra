import React, { useState } from 'react';
import { TacticalScenario } from '../types';
import { PRESET_SCENARIOS } from '../data/scenarios';
import { SUPPORTED_LANGUAGES } from '../data/languages';

interface ScenariosViewProps {
  onExecuteScenario: (scenario: TacticalScenario) => void;
}

export const ScenariosView: React.FC<ScenariosViewProps> = ({ onExecuteScenario }) => {
  const [scenarios, setScenarios] = useState<TacticalScenario[]>(PRESET_SCENARIOS);
  const [selectedScenario, setSelectedScenario] = useState<TacticalScenario>(PRESET_SCENARIOS[0]);
  const [showCustomBuilder, setShowCustomBuilder] = useState(false);

  // Custom builder state
  const [customTitle, setCustomTitle] = useState('Custom Field Mission');
  const [customSourceLang, setCustomSourceLang] = useState('mr');
  const [customTargetLang, setCustomTargetLang] = useState('ta');
  const [customText, setCustomText] = useState('तातडीने वैद्यकीय मदत पाठवा');
  const [customTransText, setCustomTransText] = useState('உடனடியாக மருத்துவ உதவி அனுப்பவும்');
  const [customPhonetic, setCustomPhonetic] = useState('Udanadiyaaga maruthuva udhavi anuppavum');
  const [customPriority, setCustomPriority] = useState<'EMERGENCY' | 'ROUTINE'>('EMERGENCY');

  const handleCreateCustom = () => {
    const newScen: TacticalScenario = {
      id: `custom_${Date.now()}`,
      title: customTitle,
      category: 'Disaster Relief',
      description: 'Custom field simulation created via tactical scenario designer.',
      sourceLang: customSourceLang,
      targetLang: customTargetLang,
      sourceText: customText,
      translatedText: customTransText,
      phoneticText: customPhonetic,
      priority: customPriority,
      confidence: 96,
      payloadBytes: Math.round(customText.length * 4.2),
      location: 'Field Sector Custom'
    };

    setScenarios([newScen, ...scenarios]);
    setSelectedScenario(newScen);
    setShowCustomBuilder(false);
  };

  return (
    <div className="flex-1 p-6 md:p-8 flex flex-col gap-6 overflow-y-auto max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[#3b494c] pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#00daf3]">ads_click</span>
            <h2 className="font-sans-tactical text-2xl font-bold text-[#e5e2e1]">
              Tactical Mission Scenarios
            </h2>
          </div>
          <p className="font-sans-tactical text-sm text-[#bac9cc] mt-1">
            Pre-configured disaster response and tactical speech-to-speech field simulations.
          </p>
        </div>

        <button
          onClick={() => setShowCustomBuilder(!showCustomBuilder)}
          className="flex items-center gap-2 bg-[#00daf3] text-[#001f24] px-4 py-2.5 rounded font-mono-tactical text-xs font-bold hover:bg-[#c3f5ff] transition-all shadow-md active:scale-95"
        >
          <span className="material-symbols-outlined text-[18px]">
            {showCustomBuilder ? 'close' : 'add_circle'}
          </span>
          <span>{showCustomBuilder ? 'Cancel Builder' : 'Create Custom Scenario'}</span>
        </button>
      </div>

      {/* Custom Scenario Builder Card */}
      {showCustomBuilder && (
        <div className="bg-[#1c1b1b] border border-[#00daf3] rounded-xl p-5 shadow-2xl space-y-4">
          <h3 className="font-mono-tactical text-sm font-bold text-[#00daf3] uppercase tracking-wider flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">build</span>
            <span>Custom Scenario Builder</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-mono-tactical text-[#bac9cc] mb-1">
                Mission Title
              </label>
              <input
                type="text"
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
                className="w-full bg-[#131313] border border-[#3b494c] rounded px-3 py-2 text-xs text-[#e5e2e1] focus:border-[#00daf3] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono-tactical text-[#bac9cc] mb-1">
                Source Language (TX)
              </label>
              <select
                value={customSourceLang}
                onChange={(e) => setCustomSourceLang(e.target.value)}
                className="w-full bg-[#131313] border border-[#3b494c] rounded px-3 py-2 text-xs text-[#e5e2e1] focus:border-[#00daf3] focus:outline-none"
              >
                {SUPPORTED_LANGUAGES.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono-tactical text-[#bac9cc] mb-1">
                Target Language (RX)
              </label>
              <select
                value={customTargetLang}
                onChange={(e) => setCustomTargetLang(e.target.value)}
                className="w-full bg-[#131313] border border-[#3b494c] rounded px-3 py-2 text-xs text-[#e5e2e1] focus:border-[#00daf3] focus:outline-none"
              >
                {SUPPORTED_LANGUAGES.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono-tactical text-[#bac9cc] mb-1">
                Source Speech Text
              </label>
              <textarea
                rows={2}
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                className="w-full bg-[#131313] border border-[#3b494c] rounded px-3 py-2 text-xs text-[#e5e2e1] focus:border-[#00daf3] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-mono-tactical text-[#bac9cc] mb-1">
                Translated Target Speech
              </label>
              <textarea
                rows={2}
                value={customTransText}
                onChange={(e) => setCustomTransText(e.target.value)}
                className="w-full bg-[#131313] border border-[#3b494c] rounded px-3 py-2 text-xs text-[#e5e2e1] focus:border-[#00daf3] focus:outline-none"
              />
            </div>
          </div>

          <div className="flex justify-between items-center pt-2">
            <div className="flex items-center gap-4">
              <label className="text-xs font-mono-tactical text-[#bac9cc]">Priority:</label>
              <button
                type="button"
                onClick={() => setCustomPriority('EMERGENCY')}
                className={`px-3 py-1 text-xs font-mono-tactical rounded font-bold ${
                  customPriority === 'EMERGENCY'
                    ? 'bg-[#ff562c] text-white'
                    : 'bg-[#353534] text-[#bac9cc]'
                }`}
              >
                EMERGENCY
              </button>
              <button
                type="button"
                onClick={() => setCustomPriority('ROUTINE')}
                className={`px-3 py-1 text-xs font-mono-tactical rounded font-bold ${
                  customPriority === 'ROUTINE'
                    ? 'bg-[#00daf3] text-[#001f24]'
                    : 'bg-[#353534] text-[#bac9cc]'
                }`}
              >
                ROUTINE
              </button>
            </div>

            <button
              onClick={handleCreateCustom}
              className="bg-[#00e5ff] text-[#00626e] font-mono-tactical text-xs font-bold px-4 py-2 rounded hover:bg-[#00daf3] transition-colors"
            >
              Save & Test Scenario
            </button>
          </div>
        </div>
      )}

      {/* Grid of Scenarios & Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Scenarios List */}
        <div className="lg:col-span-2 space-y-3">
          {scenarios.map((scen) => {
            const isSelected = selectedScenario.id === scen.id;
            return (
              <div
                key={scen.id}
                onClick={() => setSelectedScenario(scen)}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#201f1f] border-[#00daf3] shadow-[0_0_15px_rgba(0,218,243,0.15)]'
                    : 'bg-[#1a1f26]/70 border-[#3b494c] hover:border-[#849396]'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-mono-tactical font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                        scen.priority === 'EMERGENCY'
                          ? 'bg-[#93000a] text-[#ffdad6] border border-[#ff562c]'
                          : 'bg-[#00626e] text-[#c3f5ff]'
                      }`}
                    >
                      {scen.priority}
                    </span>
                    <span className="text-xs font-mono-tactical text-[#00daf3]">
                      {scen.sourceLang.toUpperCase()} → {scen.targetLang.toUpperCase()}
                    </span>
                  </div>
                  <span className="text-xs text-[#849396] font-mono-tactical">{scen.category}</span>
                </div>

                <h3 className="font-sans-tactical text-base font-bold text-[#e5e2e1] mb-1">
                  {scen.title}
                </h3>
                <p className="font-sans-tactical text-xs text-[#bac9cc] mb-3 leading-relaxed">
                  {scen.description}
                </p>

                <div className="bg-[#0e0e0e] p-2.5 rounded border border-[#3b494c]/60 flex flex-col gap-1">
                  <div className="text-[11px] font-sans-tactical text-[#e5e2e1]">
                    <span className="text-[#849396] font-mono-tactical mr-1">TX:</span>
                    "{scen.sourceText}"
                  </div>
                  <div className="text-[11px] font-sans-tactical text-[#00daf3]">
                    <span className="text-[#849396] font-mono-tactical mr-1">RX:</span>
                    "{scen.translatedText}"
                  </div>
                </div>

                <div className="mt-3 flex justify-between items-center pt-2 border-t border-[#3b494c]/40 text-[11px] font-mono-tactical text-[#849396]">
                  <span>Payload: {scen.payloadBytes}B</span>
                  <span>Confidence: {scen.confidence}%</span>
                  <span>Sector: {scen.location}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Active Scenario Inspector & Run Action */}
        <div className="bg-[#201f1f] border border-[#3b494c] rounded-xl p-5 flex flex-col justify-between h-fit sticky top-6 shadow-xl">
          <div className="space-y-4">
            <div className="border-b border-[#3b494c] pb-3">
              <span className="text-[10px] font-mono-tactical uppercase tracking-wider text-[#00daf3] font-bold">
                Mission Telemetry Inspector
              </span>
              <h3 className="font-sans-tactical text-lg font-bold text-[#e5e2e1] mt-1">
                {selectedScenario.title}
              </h3>
            </div>

            <div className="space-y-2 text-xs font-mono-tactical">
              <div className="flex justify-between py-1 border-b border-[#3b494c]/40">
                <span className="text-[#849396]">Priority Class:</span>
                <span className={selectedScenario.priority === 'EMERGENCY' ? 'text-[#ffb4ab] font-bold' : 'text-[#00daf3]'}>
                  {selectedScenario.priority}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#3b494c]/40">
                <span className="text-[#849396]">Source Node:</span>
                <span className="text-[#e5e2e1]">Phone A ({selectedScenario.sourceLang.toUpperCase()})</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#3b494c]/40">
                <span className="text-[#849396]">Destination:</span>
                <span className="text-[#e5e2e1]">Phone B ({selectedScenario.targetLang.toUpperCase()})</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#3b494c]/40">
                <span className="text-[#849396]">Est. Airtime (1.2 kbps):</span>
                <span className="text-[#fabd00]">820ms</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#3b494c]/40">
                <span className="text-[#849396]">Compression Ratio:</span>
                <span className="text-[#00daf3]">98.2% (Neural Vocoder)</span>
              </div>
            </div>

            <div className="bg-[#131313] p-3 rounded border border-[#3b494c]">
              <div className="text-[10px] font-mono-tactical text-[#bac9cc] uppercase mb-1">
                Phonetic Pronunciation Guide:
              </div>
              <div className="font-mono-tactical text-xs text-[#00daf3]">
                {selectedScenario.phoneticText}
              </div>
            </div>
          </div>

          <button
            onClick={() => onExecuteScenario(selectedScenario)}
            className="w-full mt-6 bg-[#00daf3] text-[#001f24] py-3 px-4 rounded font-mono-tactical text-xs font-bold uppercase tracking-wider hover:bg-[#c3f5ff] transition-all flex items-center justify-center gap-2 shadow-lg active:scale-95"
          >
            <span className="material-symbols-outlined text-[18px]">play_arrow</span>
            <span>Execute Tactical Transmission</span>
          </button>
        </div>
      </div>
    </div>
  );
};
