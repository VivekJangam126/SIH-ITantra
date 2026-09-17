import React from 'react';
import { ChannelState, TransmittedPacket } from '../types';

interface ChannelMonitorProps {
  channel: ChannelState;
  onToggleWorsenLink: () => void;
  onClearQueue: () => void;
  packets: TransmittedPacket[];
  onInjectTestPacket: (priority: 'EMERGENCY' | 'ROUTINE') => void;
}

export const ChannelMonitor: React.FC<ChannelMonitorProps> = ({
  channel,
  onToggleWorsenLink,
  onClearQueue,
  packets,
  onInjectTestPacket
}) => {
  return (
    <div className="flex flex-col h-full bg-[#0e0e0e] border-x border-[#3b494c] select-none">
      {/* Channel Header */}
      <div className="p-4 border-b border-[#3b494c] bg-[#201f1f] flex justify-between items-center">
        <h3 className="font-mono-tactical text-xs font-bold text-[#bac9cc] uppercase tracking-widest flex items-center gap-2">
          <span>Transmission Channel</span>
          <span className="w-2 h-2 rounded-full bg-[#00daf3] animate-ping"></span>
        </h3>
        <span className="material-symbols-outlined text-[#00daf3] animate-pulse text-[20px]">
          sync_alt
        </span>
      </div>

      {/* Bandwidth & Latency Metrics Bar */}
      <div className="p-4 grid grid-cols-2 gap-2 border-b border-[#3b494c] bg-[#1c1b1b]">
        <div>
          <div className="font-mono-tactical text-[#bac9cc] text-[10px] uppercase tracking-wider">
            Bandwidth
          </div>
          <div className={`font-mono-tactical font-bold text-sm ${channel.isWorsened ? 'text-[#ff562c]' : 'text-[#fabd00]'}`}>
            {channel.bandwidthLabel}
          </div>
        </div>
        <div>
          <div className="font-mono-tactical text-[#bac9cc] text-[10px] uppercase tracking-wider">
            Latency
          </div>
          <div className="font-mono-tactical font-bold text-sm text-[#e5e2e1]">
            {channel.latencyMs}ms
          </div>
        </div>
      </div>

      {/* Vertical Transmission Queue Area */}
      <div className="flex-1 relative overflow-hidden p-4 flex flex-col items-center justify-center min-h-[300px]">
        {/* Vertical Wire / Transmission Rail */}
        <div className="w-full max-w-[210px] h-full border-x border-dashed border-[#3b494c] flex flex-col items-center justify-end py-6 gap-3 relative">
          {/* Glowing central beam line */}
          <div className="absolute inset-y-0 w-px bg-gradient-to-b from-transparent via-[#00daf3]/40 to-transparent"></div>

          {/* Dynamic Packets list in transit */}
          {packets.length === 0 ? (
            <div className="text-center my-auto z-10 px-2 py-4 rounded bg-[#131313]/60 border border-[#3b494c]/50">
              <span className="material-symbols-outlined text-2xl text-[#849396] mb-1">wifi_tethering</span>
              <p className="font-mono-tactical text-[11px] text-[#849396]">CHANNEL IDLE</p>
              <p className="font-mono-tactical text-[9px] text-[#849396]">Ready for packet burst</p>
            </div>
          ) : (
            packets.map((pkt) => (
              <div
                key={pkt.id}
                className={`w-[115%] p-2 rounded z-10 flex items-center justify-between transition-all duration-300 ${
                  pkt.priority === 'EMERGENCY'
                    ? 'bg-[#201f1f] border border-[#ffb4ab] shadow-[0_0_18px_rgba(255,180,171,0.3)] animate-[bounce_2s_infinite]'
                    : 'w-[90%] bg-[#201f1f] border border-[#3b494c] opacity-80'
                }`}
              >
                <div className="flex items-center gap-2 overflow-hidden">
                  {pkt.priority === 'EMERGENCY' ? (
                    <span className="material-symbols-outlined text-[#ffb4ab] text-sm shrink-0">
                      warning
                    </span>
                  ) : (
                    <span className="w-2 h-2 rounded-full bg-[#00daf3] shrink-0"></span>
                  )}
                  <div className="flex flex-col">
                    <span
                      className={`font-mono-tactical text-xs font-bold leading-tight ${
                        pkt.priority === 'EMERGENCY' ? 'text-[#ffb4ab]' : 'text-[#bac9cc]'
                      }`}
                    >
                      {pkt.priority}
                    </span>
                    <span className="font-mono-tactical text-[9px] text-[#849396]">
                      {pkt.payloadBytes}B • {pkt.fromLang.toUpperCase()}→{pkt.toLang.toUpperCase()}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <span className="font-mono-tactical text-[10px] text-[#00daf3]">
                    {pkt.status === 'transmitting' ? 'TX' : 'OK'}
                  </span>
                  <span className="material-symbols-outlined text-[#bac9cc] text-sm animate-bounce">
                    arrow_downward
                  </span>
                </div>
              </div>
            ))
          )}

          {/* Quick injection buttons */}
          <div className="absolute top-2 left-2 right-2 flex gap-1 justify-center z-20">
            <button
              onClick={() => onInjectTestPacket('EMERGENCY')}
              className="text-[9px] font-mono-tactical px-2 py-0.5 rounded bg-[#ff562c]/20 text-[#ffb4ab] border border-[#ff562c]/40 hover:bg-[#ff562c]/40 transition-colors"
            >
              + Emerg Pkt
            </button>
            <button
              onClick={() => onInjectTestPacket('ROUTINE')}
              className="text-[9px] font-mono-tactical px-2 py-0.5 rounded bg-[#00daf3]/10 text-[#00daf3] border border-[#00daf3]/30 hover:bg-[#00daf3]/30 transition-colors"
            >
              + Rtn Pkt
            </button>
          </div>
        </div>
      </div>

      {/* Footer Controls: Worsen Link & Clear Queue */}
      <div className="p-4 border-t border-[#3b494c] bg-[#201f1f] flex gap-2">
        <button
          id="worsen-link-btn"
          onClick={onToggleWorsenLink}
          className={`flex-1 font-mono-tactical text-xs py-2 px-1 rounded border transition-colors ${
            channel.isWorsened
              ? 'bg-[#ff562c]/30 border-[#ff562c] text-[#ffdad2] hover:bg-[#ff562c]/40'
              : 'bg-[#353534] text-[#e5e2e1] border-[#3b494c] hover:bg-[#3a3939]'
          }`}
        >
          {channel.isWorsened ? 'Restore Link' : 'Worsen Link'}
        </button>
        <button
          id="clear-queue-btn"
          onClick={onClearQueue}
          className="flex-1 bg-[#353534] text-[#e5e2e1] font-mono-tactical text-xs py-2 px-1 rounded border border-[#3b494c] hover:bg-[#3a3939] transition-colors"
        >
          Clear Queue
        </button>
      </div>
    </div>
  );
};
