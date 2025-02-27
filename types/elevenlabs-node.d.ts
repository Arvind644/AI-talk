declare module 'elevenlabs-node' {
  export interface VoiceSettings {
    stability: number;
    similarity_boost: number;
  }

  export interface Voice {
    voice_id: string;
    name: string;
    settings: VoiceSettings;
  }
} 