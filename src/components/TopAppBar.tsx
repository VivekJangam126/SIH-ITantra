import React from 'react';

interface TopAppBarProps {
  onOpenSettings: () => void;
  isMeshActive: boolean;
  onToggleMesh: () => void;
  signalQuality: 'strong' | 'moderate' | 'weak' | 'none';
  onCycleSignal: () => void;
}

export const TopAppBar: React.FC<TopAppBarProps> = ({
  onOpenSettings,
  isMeshActive,
  onToggleMesh,
  signalQuality,
  onCycleSignal
}) => {
  const getSignalIcon = () => {
    switch (signalQuality) {
      case 'strong': return 'signal_cellular_4_bar';
      case 'moderate': return 'signal_cellular_alt_2_bar';
      case 'weak': return 'signal_cellular_alt_1_bar';
      case 'none': return 'signal_cellular_off';
    }
  };

  return (
    <header className="flex justify-between items-center w-full px-8 h-16 bg-[#1c1b1b] text-[#00daf3] border-b border-[#3b494c] select-none">
      <div className="flex items-center gap-3">
        <div className="font-sans-tactical text-2xl font-bold text-[#00daf3] tracking-tight">
          iTantra Prototype
        </div>
        <span className="hidden sm:inline-block px-2 py-0.5 rounded bg-[#353534] text-[#bac9cc] font-mono-tactical text-[11px] uppercase tracking-wider border border-[#3b494c]">
          Tactical P2P Mesh
        </span>
      </div>

      <div className="flex items-center gap-3">
        {/* Signal Quality toggle button */}
        <button
          id="toggle-signal-btn"
          onClick={onCycleSignal}
          title={`Cellular Link: ${signalQuality.toUpperCase()} (Click to cycle)`}
          className="p-2 text-[#bac9cc] hover:text-[#00daf3] hover:bg-[#353534] transition-colors rounded-full active:scale-95 duration-100 flex items-center gap-1.5"
        >
          <span className="material-symbols-outlined text-[20px]">{getSignalIcon()}</span>
          <span className="text-[10px] font-mono-tactical uppercase hidden md:inline text-[#849396]">
            {signalQuality}
          </span>
        </button>

        {/* Mesh Mode toggle */}
        <button
          id="toggle-mesh-btn"
          onClick={onToggleMesh}
          title={isMeshActive ? 'RF Mesh Relay Active (Click to toggle)' : 'Mesh Relay Disconnected'}
          className={`p-2 transition-colors rounded-full active:scale-95 duration-100 flex items-center gap-1.5 ${
            isMeshActive
              ? 'text-[#00daf3] bg-[#00daf3]/10 hover:bg-[#00daf3]/20'
              : 'text-[#bac9cc] hover:bg-[#353534]'
          }`}
        >
          <span className="material-symbols-outlined text-[20px]">
            {isMeshActive ? 'wifi_off' : 'wifi'}
          </span>
          <span className="text-[10px] font-mono-tactical uppercase hidden md:inline">
            {isMeshActive ? 'Offline Mesh' : 'Cellular AP'}
          </span>
        </button>

        {/* Settings button */}
        <button
          id="open-settings-btn"
          onClick={onOpenSettings}
          title="Simulator Settings"
          className="p-2 text-[#bac9cc] hover:text-[#00daf3] hover:bg-[#353534] transition-colors rounded-full active:scale-95 duration-100"
        >
          <span className="material-symbols-outlined text-[20px]">settings</span>
        </button>
      </div>
    </header>
  );
};
