import React, { useState, useEffect, useRef } from 'react';
import { ChannelState } from '../types';

interface LinkQualityViewProps {
  channel: ChannelState;
  onUpdateChannel: (updated: Partial<ChannelState>) => void;
}

export const LinkQualityView: React.FC<LinkQualityViewProps> = ({
  channel,
  onUpdateChannel
}) => {
  const [selectedRadio, setSelectedRadio] = useState<'lora' | 'vhf' | 'ble' | 'acoustic'>(channel.radioMode);
  const [packetLoss, setPacketLoss] = useState(channel.packetLossRate);
  const [snr, setSnr] = useState(channel.snrDb);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Radio Protocol presets
  const radioPresets = [
    {
      id: 'lora' as const,
      name: 'LoRa 868 MHz (Long Range)',
      freq: '868 MHz ISM',
      defaultBw: 1.2,
      label: '1.2 kbps (Weak)',
      latency: 2400,
      range: '15 km',
      power: '25 mW',
      desc: 'Ideal for deep mountainous or rubble penetration. Extreme low bitrate neural codec required.'
    },
    {
      id: 'vhf' as const,
      name: 'Tactical VHF 136-174 MHz',
      freq: '148.25 MHz Tactical',
      defaultBw: 4.8,
      label: '4.8 kbps (Standard)',
      latency: 680,
      range: '25 km (LOS)',
      power: '5 W',
      desc: 'Military/Disaster standard narrowband channel for direct voice & telemetry.'
    },
    {
      id: 'ble' as const,
      name: 'Bluetooth LE Long-Range Mesh',
      freq: '2.4 GHz Coded PHY',
      defaultBw: 128.0,
      label: '128 kbps (Broadband)',
      latency: 95,
      range: '800 m',
      power: '10 mW',
      desc: 'High throughput localized ad-hoc smartphone mesh between first responders.'
    },
    {
      id: 'acoustic' as const,
      name: 'Acoustic Underwater / Rubble Modem',
      freq: '18 kHz Audio Chirp',
      defaultBw: 0.3,
      label: '0.3 kbps (Ultra-Sparse)',
      latency: 4800,
      range: '2 km',
      power: '100 mW',
      desc: 'Penetrates collapsed concrete slabs using ultrasonic micro-chirps.'
    }
  ];

  const handleSelectPreset = (preset: typeof radioPresets[0]) => {
    setSelectedRadio(preset.id);
    onUpdateChannel({
      radioMode: preset.id,
      bandwidthKbps: preset.defaultBw,
      bandwidthLabel: preset.label,
      latencyMs: preset.latency,
      isWorsened: preset.defaultBw < 1.5
    });
  };

  // Render animated RF Signal Waterfall / Constellation Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let time = 0;

    const render = () => {
      time += 0.04;
      ctx.fillStyle = '#0e0e0e';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Grid lines
      ctx.strokeStyle = '#201f1f';
      ctx.lineWidth = 1;
      for (let x = 0; x < canvas.width; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += 30) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Signal Spectrum Wave
      ctx.beginPath();
      ctx.strokeStyle = '#00daf3';
      ctx.lineWidth = 2;

      const midY = canvas.height / 2;
      const noise = (50 - snr) * 0.15;

      for (let x = 0; x < canvas.width; x++) {
        const carrier = Math.sin((x * 0.05) + time * 3) * (canvas.height * 0.25);
        const modulation = Math.sin((x * 0.015) - time) * 15;
        const randomJitter = (Math.random() - 0.5) * noise * 8;
        const y = midY + carrier + modulation + randomJitter;

        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Constellation IQ Points
      ctx.fillStyle = '#ff562c';
      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2 + time * 0.5;
        const radius = 35 + (Math.random() - 0.5) * (noise * 5);
        const cx = canvas.width - 60 + Math.cos(angle) * radius;
        const cy = 60 + Math.sin(angle) * radius;
        ctx.beginPath();
        ctx.arc(cx, cy, 3, 0, Math.PI * 2);
        ctx.fill();
      }

      // Constellation Box border
      ctx.strokeStyle = '#3b494c';
      ctx.strokeRect(canvas.width - 110, 10, 100, 100);

      ctx.fillStyle = '#849396';
      ctx.font = '9px "JetBrains Mono"';
      ctx.fillText('QPSK CONSTELLATION', canvas.width - 105, 22);

      animId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animId);
  }, [snr]);

  return (
    <div className="flex-1 p-6 md:p-8 flex flex-col gap-6 overflow-y-auto max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="border-b border-[#3b494c] pb-5">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#00daf3]">network_check</span>
          <h2 className="font-sans-tactical text-2xl font-bold text-[#e5e2e1]">
            RF Link Quality & Mesh Telemetry
          </h2>
        </div>
        <p className="font-sans-tactical text-sm text-[#bac9cc] mt-1">
          Adjust RF propagation variables, radio modulation modes, and compression benchmarks.
        </p>
      </div>

      {/* RF Spectrum Live Visualizer Canvas */}
      <div className="bg-[#131313] border border-[#3b494c] rounded-xl p-4 shadow-xl">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#00daf3] animate-pulse"></span>
            <span className="font-mono-tactical text-xs font-bold text-[#00daf3] uppercase tracking-wider">
              Live RF Spectrum & Constellation Monitor
            </span>
          </div>
          <span className="font-mono-tactical text-xs text-[#bac9cc]">
            SNR: <strong className="text-[#00daf3]">{snr} dB</strong> | Loss: <strong className="text-[#ff562c]">{packetLoss}%</strong>
          </span>
        </div>

        <canvas
          ref={canvasRef}
          width={700}
          height={150}
          className="w-full h-36 bg-[#0e0e0e] rounded border border-[#3b494c]/60"
        />
      </div>

      {/* Radio Presets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {radioPresets.map((preset) => {
          const isSelected = selectedRadio === preset.id;
          return (
            <div
              key={preset.id}
              onClick={() => handleSelectPreset(preset)}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                isSelected
                  ? 'bg-[#201f1f] border-[#00daf3] shadow-[0_0_15px_rgba(0,218,243,0.15)]'
                  : 'bg-[#1a1f26]/70 border-[#3b494c] hover:border-[#849396]'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <span className="font-mono-tactical text-[10px] uppercase font-bold text-[#00daf3]">
                  {preset.freq}
                </span>
                {isSelected && (
                  <span className="material-symbols-outlined text-[#00daf3] text-[18px]">check_circle</span>
                )}
              </div>

              <h3 className="font-sans-tactical text-sm font-bold text-[#e5e2e1] mb-1">
                {preset.name}
              </h3>
              <p className="font-sans-tactical text-xs text-[#bac9cc] mb-3 leading-relaxed">
                {preset.desc}
              </p>

              <div className="space-y-1 text-[11px] font-mono-tactical text-[#849396] pt-2 border-t border-[#3b494c]/40">
                <div className="flex justify-between">
                  <span>Bandwidth:</span>
                  <span className="text-[#fabd00] font-bold">{preset.label}</span>
                </div>
                <div className="flex justify-between">
                  <span>Est Latency:</span>
                  <span className="text-[#e5e2e1]">{preset.latency}ms</span>
                </div>
                <div className="flex justify-between">
                  <span>Max Range:</span>
                  <span className="text-[#e5e2e1]">{preset.range}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Sliders & Compression Benchmark */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Param Tuner */}
        <div className="bg-[#201f1f] border border-[#3b494c] rounded-xl p-5 space-y-4">
          <h3 className="font-mono-tactical text-xs font-bold text-[#00daf3] uppercase tracking-wider">
            RF Environmental Parameters
          </h3>

          <div>
            <div className="flex justify-between text-xs font-mono-tactical text-[#bac9cc] mb-1">
              <span>Simulated Packet Loss Rate:</span>
              <span className="text-[#ff562c] font-bold">{packetLoss}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="50"
              step="1"
              value={packetLoss}
              onChange={(e) => {
                const val = Number(e.target.value);
                setPacketLoss(val);
                onUpdateChannel({ packetLossRate: val });
              }}
              className="w-full accent-[#ff562c] cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-mono-tactical text-[#bac9cc] mb-1">
              <span>Signal-to-Noise Ratio (SNR):</span>
              <span className="text-[#00daf3] font-bold">{snr} dB</span>
            </div>
            <input
              type="range"
              min="-15"
              max="35"
              step="1"
              value={snr}
              onChange={(e) => {
                const val = Number(e.target.value);
                setSnr(val);
                onUpdateChannel({ snrDb: val });
              }}
              className="w-full accent-[#00daf3] cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-mono-tactical text-[#bac9cc] mb-1">
              <span>Channel Latency Jitter:</span>
              <span className="text-[#e5e2e1] font-bold">{channel.latencyMs} ms</span>
            </div>
            <input
              type="range"
              min="100"
              max="5000"
              step="100"
              value={channel.latencyMs}
              onChange={(e) => {
                const val = Number(e.target.value);
                onUpdateChannel({ latencyMs: val });
              }}
              className="w-full accent-[#fabd00] cursor-pointer"
            />
          </div>
        </div>

        {/* Compression Engine Comparison */}
        <div className="bg-[#201f1f] border border-[#3b494c] rounded-xl p-5 space-y-3">
          <h3 className="font-mono-tactical text-xs font-bold text-[#00daf3] uppercase tracking-wider">
            Acoustic Codec Efficiency Comparison
          </h3>

          <div className="space-y-2 text-xs font-mono-tactical">
            <div className="p-2.5 rounded bg-[#131313] border border-[#00daf3]/60 flex items-center justify-between">
              <div>
                <div className="font-bold text-[#00daf3]">iTantra Neural Vocoder (Offline)</div>
                <div className="text-[10px] text-[#849396]">Semantic token vector + LPC features</div>
              </div>
              <div className="text-right">
                <div className="text-[#00daf3] font-bold">120 B/s</div>
                <div className="text-[10px] text-[#00daf3]">98.1% compr</div>
              </div>
            </div>

            <div className="p-2.5 rounded bg-[#131313] border border-[#3b494c] flex items-center justify-between opacity-80">
              <div>
                <div className="font-bold text-[#e5e2e1]">Codec2 Low Bitrate</div>
                <div className="text-[10px] text-[#849396]">Sinusoidal vocoder for Ham radio</div>
              </div>
              <div className="text-right">
                <div className="text-[#fabd00] font-bold">450 B/s</div>
                <div className="text-[10px] text-[#849396]">92.8% compr</div>
              </div>
            </div>

            <div className="p-2.5 rounded bg-[#131313] border border-[#3b494c] flex items-center justify-between opacity-70">
              <div>
                <div className="font-bold text-[#e5e2e1]">LPC-10 Military Standard</div>
                <div className="text-[10px] text-[#849396]">Linear Predictive Coding</div>
              </div>
              <div className="text-right">
                <div className="text-[#e5e2e1] font-bold">1,200 B/s</div>
                <div className="text-[10px] text-[#849396]">84.5% compr</div>
              </div>
            </div>

            <div className="p-2.5 rounded bg-[#131313] border border-[#3b494c] flex items-center justify-between opacity-50">
              <div>
                <div className="font-bold text-[#849396]">Raw PCM Audio</div>
                <div className="text-[10px] text-[#849396]">Uncompressed 8kHz 16-bit</div>
              </div>
              <div className="text-right">
                <div className="text-[#ff562c] font-bold">16,000 B/s</div>
                <div className="text-[10px] text-[#ff562c]">0% compr</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
