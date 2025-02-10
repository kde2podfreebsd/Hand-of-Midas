export interface ChapProviderProps {
  children: React.ReactNode;
}

export interface ChatMessage {
  role: 'assistant' | 'user';
  content: string;
}

export interface ChatContextData {
  addMessage: (id: string, message: string) => void;
  getAnalysis: () => void

  messages: ChatMessage[];
}
