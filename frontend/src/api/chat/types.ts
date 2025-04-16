export type Message = {
  role: 'user' | 'assistant',
  content: string,
  timestamp: string
};

export interface GetChatHistoryResponse {
  page: number;
  entries: {
    user_id: string;
    messages: [answer: Message, question: Message];
  }[];
}

export interface SendMessageResponse {
  "user_id": string,
  "message": string, // user
  "response": string, // assistant
  "timestamp": string,
}
