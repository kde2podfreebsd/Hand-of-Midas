import { ArrowUpOutlined } from "@ant-design/icons";
import { Button, Flex, Space, Typography, message } from "antd";
// import DOMPurify from 'dompurify';
// import { marked } from "marked";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from 'react-markdown';
import { WithLoader } from "../../components/WithLoader/WithLoader";


type UserMessage = {
  role: 'user',
  content: string;
  timestamp?: string;
}

type AssistantMessage = {
  role: 'assistant',
  content: string;
  timestamp?: string;
}

type Message = UserMessage | AssistantMessage;

// Пример сервиса для работы с API (перенесите в отдельный файл)
const api = {
  getChatHistory: async (): Promise<Message[]> => {
    // Здесь должен быть реальный API-вызов
    return [];
  },
  
  sendMessage: async (newMessage: Message): Promise<Message> => {
    void newMessage;

    // Здесь должен быть реальный API-вызов
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          role: 'assistant',
          content: `# Пример стандартного ответа ассистента

Здравствуйте! 😊

Ниже представлен пример развернутого ответа, который иллюстрирует разнообразие возможностей форматирования Markdown. Этот пример включает в себя заголовки, списки, таблицы, блоки кода и другие элементы разметки, чтобы вы могли увидеть, как может выглядеть полноценный ответ ассистента. Такой формат может быть особенно полезен, когда необходимо структурировать длинный или сложный текст.

## Введение

В этой секции представлены основные компоненты, которые вы можете использовать для создания информативного и структурированного ответа. Вот некоторые ключевые элементы:

- **Заголовки** – используются для разделения текста на логические секции.
- **Списки** – позволяют структурировать информацию, делая ее более читабельной.
- **Таблицы** – помогают отображать данные в организованной форме.
- **Блоки кода** – используются для демонстрации примеров программного кода.
- **Смайлики** – добавляют эмоциональную окраску и делают текст более дружелюбным. 😄

Эти элементы позволяют сделать ответ не только информативным, но и визуально привлекательным для пользователя.

## Пример таблицы

Ниже представлена таблица с примерными данными. Таблицы удобны для представления сводной информации в виде строк и столбцов:

| **Параметр**   | **Описание**                     | **Пример значения**  |
|----------------|-----------------------------------|----------------------|
| Имя            | Имя пользователя                  | Иван                 |
| Возраст        | Возраст пользователя              | 29 лет               |
| Статус         | Текущий статус или позиция        | Активный пользователь|

Эта таблица демонстрирует, как можно структурировать данные для лучшего восприятия.`,
          timestamp: new Date().toISOString()
        });
      }, 1000);
    });
  }
};

export const ChatPage = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<(UserMessage | AssistantMessage)[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Загрузка истории сообщений
  useEffect(() => {
    const loadHistory = async () => {
      try {
        setIsLoading(true);
        const history = await api.getChatHistory();

        const sanitizedHistory: (UserMessage | AssistantMessage)[] = []

        for (const message of history) {
          if (message.role === 'user') {
            sanitizedHistory.push(message)
          }

          if (message.role === 'assistant') {
            // message.content = DOMPurify.sanitize(await marked(message.content));
            // sanitizedHistory.push(message);
          }
        }

        setMessages(history);
      } catch {
        message.error('Не удалось загрузить историю сообщений');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadHistory();
  }, []);

  // Прокрутка к последнему сообщению
  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Автоматическое изменение высоты textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 100)}px`;
    }
  }, [input]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const newUserMessage: Message = {
      role: 'user',
      content: input.trim(),
      timestamp: new Date().toISOString()
    };

    try {
      setMessages(prev => [...prev, newUserMessage]);
      setInput('');

      // Отправляем сообщение на сервер и получаем ответ
      const response = await api.sendMessage(newUserMessage);

      // Модифицируем формат контента
      // response.content = DOMPurify.sanitize(await marked(response.content));

      setMessages(prev => [...prev, response]);

    } catch {
      message.error('Ошибка при отправке сообщения');
      // Откатываем добавление пользовательского сообщения в случае ошибки
      setMessages(prev => prev.filter(msg => msg.role !== 'user' || msg.content !== newUserMessage.content));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <WithLoader loading={isLoading} msMax={300}>
      <div style={{ position: 'relative', height: '100%', width: '100%' }}>
        {/* Контейнер сообщений */}
        <div
          ref={messagesContainerRef}
          style={{
            width: '100%',
            height: 'calc(100% - 150px)',
            overflowY: 'auto',
            padding: '40px 40px 25vh 40px',
            scrollBehavior: 'smooth',
          }}
        >
          <Flex vertical gap={20}>
            {messages.map((msg, index) => {
              return (
                <Flex
                  key={index}
                  justify={msg.role === 'user' ? 'flex-end' : 'center'}
                  style={{ width: '100%', }}
                >
                  <div style={{
                    backgroundColor: msg.role === 'user' ? '#F4F4F4' : 'white',
                    borderRadius: 20,
                    maxWidth:  '60%',
                    padding: '12px 16px',
                    margin: '4px 0',
                  }}>
                    <Typography.Paragraph 
                      style={{ marginBottom: 0 }}
                    >
                      {msg.role === 'assistant' && (
                        <ReactMarkdown>
                          {msg.content}
                        </ReactMarkdown>
                        // <div dangerouslySetInnerHTML={{ __html: msg.content }}/>
                      )}
                      {msg.role === 'user' && msg.content}
                    </Typography.Paragraph>
                    <Typography.Text type="secondary" style={{ fontSize: 12, display: 'block' }}>
                      {new Date(msg.timestamp!).toLocaleTimeString()}
                    </Typography.Text>
                  </div>
                </Flex>
              )
            })}
          </Flex>
        </div>

        {/* Форма отправки сообщений */}
        <div
          style={{
            zIndex: 10,
            width: '60%',
            position: 'absolute',
            left: '20%',
            transition: 'all 0.5s',
            ...(!messages.length && {
              bottom: '45%',
            }),
            ...(messages.length && {
              bottom: '5%',
            }),
          }}
        >
          <Space direction='vertical' size={5} style={{ display: 'flex', width: '100%' }}>
            {messages.length === 0 && (
              <Flex justify='center'>
                <Typography.Title level={3}>Чем я могу помочь?</Typography.Title>
              </Flex>
            )}

            <div style={{
              backgroundColor: 'white',
              borderRadius: 30,
              boxShadow: '0 5px 30px 0 rgba(0, 0, 0, 0.10)',
              padding: '10px'
            }}>
              <Space direction='vertical' size={5} style={{ display: 'flex' }}>
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Спросите что-нибудь..."
                  style={{
                    border: 'none',
                    outline: 'none',
                    resize: 'none',
                    width: '96%',
                    minHeight: '10px',
                    maxHeight: '100px',
                    overflowY: 'auto',
                    margin: '7px 2%'
                  }}
                />
                <Flex justify='flex-end' align="center" style={{ padding: '5px' }}>
                  <Button
                    type='primary'
                    shape='circle'
                    icon={<ArrowUpOutlined />}
                    onClick={handleSendMessage}
                    style={{ backgroundColor: '#6253e1' }}
                  />
                </Flex>
              </Space>
            </div>
          </Space>
        </div>
      </div>
    </WithLoader>
  );
};