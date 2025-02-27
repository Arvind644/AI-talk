declare module 'elevenlabs-node' {
  export interface VoiceSettings {
    stability: number;
    similarity_boost: number;
    style?: number;
    use_speaker_boost?: boolean;
  }

  export interface Voice {
    voice_id: string;
    name: string;
    settings: VoiceSettings;
  }

  export type Speaker = 'girlfriend' | 'boyfriend';
} 