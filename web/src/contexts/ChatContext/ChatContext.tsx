import { portfolioAnalyze } from "@/api/portfolio-analyze";
import { sendMessage } from "@/api/send-message";
import { useLocalStorage } from "@mantine/hooks";
import { useMutation } from "@tanstack/react-query";
import { createContext, useEffect, useState } from "react";
import { ChapProviderProps, ChatContextData, ChatMessage } from "./ChatContext.interface";

// Создаем контекст для чата
export const ChatContext = createContext<ChatContextData>({
  getAnalysis: () => {},
  addMessage: (...messages: unknown[]) => void messages,
  messages: []
});

// Провайдер контекста, который будет предоставлять доступ к состоянию чата
export const ChatProvider = ({ children }: ChapProviderProps) => {
  const [walletId] = useLocalStorage({ key: 'wallet_id' })
  const [chatId, setChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const sendMessageMutation = useMutation({
    mutationFn: (message: string) => {
      return sendMessage(chatId!, message)
    },
  })

  const analyzeMutation = useMutation({
    mutationFn: () => {
      return portfolioAnalyze(walletId)
    },
  })

  useEffect(() => {
    if (analyzeMutation.data && analyzeMutation.isSuccess) {
      addAssistantMessage(analyzeMutation.data.response)
      analyzeMutation.reset()
    }
  }, [analyzeMutation])

  useEffect(() => {
    if (sendMessageMutation.data && sendMessageMutation.isSuccess) {
      addAssistantMessage(sendMessageMutation.data.response)
      sendMessageMutation.reset()
    }
  }, [sendMessageMutation])

  const addAssistantMessage = (message: string) => {
    setMessages((messages) => {
      messages.push({ role: 'assistant', content: message })
      return messages;
    })
  }

  const getAnalysis = () => {
    analyzeMutation.mutate();
  }

  const addUserMessage = (id: string, message: string) => {
    setChatId(id);

    setMessages((messages) => {
      messages.push({ role: 'user', content: message })
      return messages;
    });

    sendMessageMutation.mutate(message);
  }

  return (
    <ChatContext.Provider value={{
      addMessage: addUserMessage,
      getAnalysis,
      messages,
    }}>
      {children}
    </ChatContext.Provider>
  );
};
