export type NavTab = 'simulator' | 'scenarios' | 'link-quality' | 'logs';

export type PriorityLevel = 'EMERGENCY' | 'ROUTINE' | 'TELEMETRY';

export interface Language {
  code: string;
  id: string;
  name: string;
  nativeName: string;
  speechCode: string;
}

export interface TransmittedPacket {
  id: string;
  timestamp: string;
  priority: PriorityLevel;
  fromLang: string;
  toLang: string;
  originalText: string;
  translatedText: string;
  phoneticText?: string;
  payloadBytes: number;
  compressionRatio: number; // e.g. 98%
  confidence: number; // e.g. 94%
  status: 'queued' | 'transmitting' | 'received' | 'dropped';
  progress: number; // 0 to 100
  latencyMs: number;
  snrDb: number;
  hexDump?: string;
}

export interface ChannelState {
  bandwidthKbps: number;
  bandwidthLabel: string;
  latencyMs: number;
  packetLossRate: number; // 0 - 50%
  isWorsened: boolean;
  snrDb: number;
  radioMode: 'lora' | 'vhf' | 'ble' | 'acoustic';
  activePacketsCount: number;
}

export interface PipelineStatus {
  stt: 'idle' | 'processing' | 'done';
  sttTimeMs: number;
  trans: 'idle' | 'processing' | 'done';
  transTimeMs: number;
  decomp: 'idle' | 'processing' | 'done';
  decompTimeMs: number;
}

export interface TacticalScenario {
  id: string;
  title: string;
  category: 'Disaster Relief' | 'Medical Triage' | 'Search & Rescue' | 'Fire Evacuation' | 'Flood Breach';
  description: string;
  sourceLang: string;
  targetLang: string;
  sourceText: string;
  translatedText: string;
  phoneticText: string;
  priority: PriorityLevel;
  confidence: number;
  payloadBytes: number;
  location: string;
}

export interface TacticalLogEntry {
  id: string;
  timestamp: string;
  level: 'EMERGENCY' | 'INFO' | 'WARN' | 'DATA' | 'RF';
  tag: string;
  message: string;
  payloadHex?: string;
}

export interface AppSettings {
  soundFxEnabled: boolean;
  autoPlayReceivedSpeech: boolean;
  speechRate: number;
  speechPitch: number;
  codecEngine: 'neural_vocoder_98' | 'codec2_92' | 'lpc10_85' | 'raw_pcm';
  encryptionMode: 'AES-256-GCM' | 'ChaCha20-Poly1305' | 'None';
  simulatedMeshHops: number;
}
