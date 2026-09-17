import React from 'react';
import { NavTab } from '../types';

interface SideNavBarProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  onTriggerEmergency: () => void;
  onOpenDoc: () => void;
  onOpenSupport: () => void;
  emergencyActive: boolean;
}

export const SideNavBar: React.FC<SideNavBarProps> = ({
  activeTab,
  setActiveTab,
  onTriggerEmergency,
  onOpenDoc,
  onOpenSupport,
  emergencyActive
}) => {
  return (
    <nav className="flex flex-col h-screen fixed left-0 top-0 z-40 bg-[#201f1f] text-[#00daf3] font-mono-tactical text-sm w-64 border-r border-[#3b494c] select-none">
      {/* Brand Header */}
      <div className="p-6 border-b border-[#3b494c]">
        <h1 className="font-sans-tactical text-2xl font-semibold text-[#00daf3] tracking-tight">Demo Controls</h1>
        <p className="font-sans-tactical text-base text-[#bac9cc] mt-1 font-normal">Tactical Simulator v1.0</p>
      </div>

      {/* Navigation Items */}
      <div className="flex-1 py-4 overflow-y-auto space-y-1">
        <button
          id="nav-simulator"
          onClick={() => setActiveTab('simulator')}
          className={`w-[calc(100%-1rem)] flex items-center gap-3 font-bold rounded-lg mx-2 px-4 py-3 text-left transition-all duration-150 active:translate-x-1 ${
            activeTab === 'simulator'
              ? 'bg-[#00e5ff] text-[#00626e]'
              : 'text-[#bac9cc] hover:text-[#e5e2e1] hover:bg-[#353534]'
          }`}
        >
          <span className="material-symbols-outlined text-[22px]" style={activeTab === 'simulator' ? { fontVariationSettings: "'FILL' 1" } : {}}>
            cloud_download
          </span>
          <span className="tracking-wide">Simulator</span>
        </button>

        <button
          id="nav-scenarios"
          onClick={() => setActiveTab('scenarios')}
          className={`w-[calc(100%-1rem)] flex items-center gap-3 font-bold rounded-lg mx-2 px-4 py-3 text-left transition-all duration-150 active:translate-x-1 ${
            activeTab === 'scenarios'
              ? 'bg-[#00e5ff] text-[#00626e]'
              : 'text-[#bac9cc] hover:text-[#e5e2e1] hover:bg-[#353534]'
          }`}
        >
          <span className="material-symbols-outlined text-[22px]" style={activeTab === 'scenarios' ? { fontVariationSettings: "'FILL' 1" } : {}}>
            ads_click
          </span>
          <span className="tracking-wide">Scenarios</span>
        </button>

        <button
          id="nav-link-quality"
          onClick={() => setActiveTab('link-quality')}
          className={`w-[calc(100%-1rem)] flex items-center gap-3 font-bold rounded-lg mx-2 px-4 py-3 text-left transition-all duration-150 active:translate-x-1 ${
            activeTab === 'link-quality'
              ? 'bg-[#00e5ff] text-[#00626e]'
              : 'text-[#bac9cc] hover:text-[#e5e2e1] hover:bg-[#353534]'
          }`}
        >
          <span className="material-symbols-outlined text-[22px]" style={activeTab === 'link-quality' ? { fontVariationSettings: "'FILL' 1" } : {}}>
            network_check
          </span>
          <span className="tracking-wide">Link Quality</span>
        </button>

        <button
          id="nav-logs"
          onClick={() => setActiveTab('logs')}
          className={`w-[calc(100%-1rem)] flex items-center gap-3 font-bold rounded-lg mx-2 px-4 py-3 text-left transition-all duration-150 active:translate-x-1 ${
            activeTab === 'logs'
              ? 'bg-[#00e5ff] text-[#00626e]'
              : 'text-[#bac9cc] hover:text-[#e5e2e1] hover:bg-[#353534]'
          }`}
        >
          <span className="material-symbols-outlined text-[22px]" style={activeTab === 'logs' ? { fontVariationSettings: "'FILL' 1" } : {}}>
            terminal
          </span>
          <span className="tracking-wide">Logs</span>
        </button>
      </div>

      {/* Footer Emergency Trigger & Links */}
      <div className="p-4 border-t border-[#3b494c]">
        <button
          id="trigger-emergency-btn"
          onClick={onTriggerEmergency}
          className={`w-full py-2.5 px-4 rounded font-mono-tactical text-xs uppercase tracking-wider font-bold mb-4 transition-all duration-150 active:scale-95 flex items-center justify-center gap-2 ${
            emergencyActive
              ? 'bg-[#ff562c] text-white animate-pulse shadow-[0_0_20px_rgba(255,86,44,0.6)]'
              : 'bg-[#ffb4ab] text-[#690005] hover:bg-[#ffdad2]'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">warning</span>
          <span>Trigger Emergency</span>
        </button>

        <div className="flex flex-col gap-2 font-sans-tactical">
          <button
            id="doc-button"
            onClick={onOpenDoc}
            className="flex items-center gap-3 text-[#bac9cc] hover:text-[#e5e2e1] text-sm text-left py-1 transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">description</span>
            <span>Documentation</span>
          </button>
          <button
            id="support-button"
            onClick={onOpenSupport}
            className="flex items-center gap-3 text-[#bac9cc] hover:text-[#e5e2e1] text-sm text-left py-1 transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">help</span>
            <span>Support</span>
          </button>
        </div>
      </div>
    </nav>
  );
};
