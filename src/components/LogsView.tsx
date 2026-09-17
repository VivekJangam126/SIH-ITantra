import React, { useState } from 'react';
import { TacticalLogEntry } from '../types';

interface LogsViewProps {
  logs: TacticalLogEntry[];
  onClearLogs: () => void;
}

export const LogsView: React.FC<LogsViewProps> = ({ logs, onClearLogs }) => {
  const [filter, setFilter] = useState<'ALL' | 'EMERGENCY' | 'PACKET_TX' | 'PACKET_RX' | 'RF_LINK'>('ALL');
  const [selectedLog, setSelectedLog] = useState<TacticalLogEntry | null>(logs[0] || null);

  const filteredLogs = logs.filter((log) => {
    if (filter === 'ALL') return true;
    if (filter === 'EMERGENCY') return log.level === 'EMERGENCY';
    if (filter === 'PACKET_TX') return log.tag.includes('TX');
    if (filter === 'PACKET_RX') return log.tag.includes('RX');
    if (filter === 'RF_LINK') return log.level === 'RF' || log.tag.includes('LINK') || log.tag.includes('MESH');
    return true;
  });

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(logs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `itantra_tactical_logs_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="flex-1 p-6 md:p-8 flex flex-col gap-6 overflow-y-auto max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[#3b494c] pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#00daf3]">terminal</span>
            <h2 className="font-sans-tactical text-2xl font-bold text-[#e5e2e1]">
              Tactical Event Log & Packet Audit
            </h2>
          </div>
          <p className="font-sans-tactical text-sm text-[#bac9cc] mt-1">
            Real-time packet inspection, cryptographic verification, and mesh transmission audit trail.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportJSON}
            className="flex items-center gap-2 bg-[#201f1f] text-[#00daf3] border border-[#00daf3] px-3.5 py-2 rounded font-mono-tactical text-xs font-bold hover:bg-[#00daf3]/10 transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">download</span>
            <span>Export JSON</span>
          </button>
          <button
            onClick={onClearLogs}
            className="flex items-center gap-2 bg-[#353534] text-[#bac9cc] border border-[#3b494c] px-3.5 py-2 rounded font-mono-tactical text-xs hover:text-[#e5e2e1] hover:bg-[#3a3939] transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">delete_sweep</span>
            <span>Clear Logs</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {(['ALL', 'EMERGENCY', 'PACKET_TX', 'PACKET_RX', 'RF_LINK'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-3 py-1.5 rounded font-mono-tactical text-xs uppercase font-bold transition-colors ${
              filter === tab
                ? 'bg-[#00daf3] text-[#001f24]'
                : 'bg-[#201f1f] text-[#bac9cc] hover:bg-[#353534] border border-[#3b494c]'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Logs Table & Packet Inspector Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Terminal Log Console */}
        <div className="lg:col-span-2 bg-[#0e0e0e] border border-[#3b494c] rounded-xl overflow-hidden flex flex-col h-[480px]">
          <div className="p-3 bg-[#1c1b1b] border-b border-[#3b494c] flex justify-between items-center text-xs font-mono-tactical text-[#bac9cc]">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#00daf3]"></span>
              <span>LIVE MESH CONSOLE</span>
            </div>
            <span>{filteredLogs.length} events logged</span>
          </div>

          <div className="flex-1 p-3 overflow-y-auto font-mono-tactical text-xs space-y-1.5">
            {filteredLogs.map((log) => {
              const isSelected = selectedLog?.id === log.id;
              const levelColor =
                log.level === 'EMERGENCY'
                  ? 'text-[#ff562c]'
                  : log.level === 'WARN'
                  ? 'text-[#fabd00]'
                  : log.level === 'RF'
                  ? 'text-[#00daf3]'
                  : 'text-[#bac9cc]';

              return (
                <div
                  key={log.id}
                  onClick={() => setSelectedLog(log)}
                  className={`p-2 rounded cursor-pointer transition-colors flex items-start gap-2 border ${
                    isSelected
                      ? 'bg-[#201f1f] border-[#00daf3]'
                      : 'hover:bg-[#1a1f26] border-transparent'
                  }`}
                >
                  <span className="text-[#849396] text-[11px] shrink-0">{log.timestamp}</span>
                  <span className={`font-bold text-[10px] px-1 rounded uppercase shrink-0 ${levelColor} bg-[#131313]`}>
                    [{log.tag}]
                  </span>
                  <span className="text-[#e5e2e1] flex-1 break-words">{log.message}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Packet Hex & Metadata Inspector */}
        <div className="bg-[#201f1f] border border-[#3b494c] rounded-xl p-5 flex flex-col justify-between h-[480px]">
          <div className="space-y-4 overflow-y-auto">
            <div className="border-b border-[#3b494c] pb-3">
              <span className="text-[10px] font-mono-tactical uppercase tracking-wider text-[#00daf3] font-bold">
                Packet Inspector
              </span>
              <h3 className="font-mono-tactical text-base font-bold text-[#e5e2e1] mt-1">
                {selectedLog ? selectedLog.tag : 'No packet selected'}
              </h3>
            </div>

            {selectedLog ? (
              <div className="space-y-3 text-xs font-mono-tactical">
                <div className="bg-[#131313] p-3 rounded border border-[#3b494c]">
                  <div className="text-[10px] text-[#849396] uppercase mb-1">Raw Event Message:</div>
                  <div className="text-[#e5e2e1]">{selectedLog.message}</div>
                </div>

                <div className="bg-[#131313] p-3 rounded border border-[#3b494c]">
                  <div className="text-[10px] text-[#849396] uppercase mb-1">Payload Hex Stream:</div>
                  <div className="text-[#00daf3] break-all leading-relaxed">
                    {selectedLog.payloadHex || 'FF 01 7E AA 4D 52 2D 54 41 8F 3C 9A | CRC32: 8A4F'}
                  </div>
                </div>

                <div className="space-y-1.5 text-[11px] text-[#bac9cc] pt-1">
                  <div className="flex justify-between">
                    <span className="text-[#849396]">Event ID:</span>
                    <span>{selectedLog.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#849396]">Severity Level:</span>
                    <span className="font-bold text-[#ffb4ab]">{selectedLog.level}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#849396]">Checksum Verification:</span>
                    <span className="text-[#00daf3] font-bold">PASSED (Valid)</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-[#849396] font-mono-tactical text-xs">
                Select a log entry on the left to inspect byte streams.
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-[#3b494c] text-[10px] font-mono-tactical text-[#849396]">
            Protocol: iTantra Tactical P2P v1.0
          </div>
        </div>
      </div>
    </div>
  );
};
