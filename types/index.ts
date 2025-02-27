export interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
  speaker: 'girlfriend' | 'boyfriend';
}

export interface ConversationState {
  messages: Message[];
  isLoading: boolean;
  isPlaying: boolean;
}

export interface AudioResponse {
  audioUrl: string;
} 