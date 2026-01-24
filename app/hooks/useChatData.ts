'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  getChatById, 
  saveChatMessage, 
  updateLastAccessed, 
  createNewChat,
  updateChatTitle,
  generateChatTitle,
} from '../utils/chatStorage';

export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

interface UseChatDataReturn {
  messages: Message[];
  chatTitle: string;
  isFirstUserMessage: boolean;
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  setChatTitle: React.Dispatch<React.SetStateAction<string>>;
  setIsFirstUserMessage: React.Dispatch<React.SetStateAction<boolean>>;
  addMessage: (message: Message) => void;
  updateMessage: (messageId: string, content: string) => void;
  removeMessage: (messageId: string) => void;
  saveMessageToStorage: (message: Message) => void;
  generateTitleFromFirstMessage: (content: string) => void;
}

export default function useChatData(chatId: string, scrollToBottom: () => void): UseChatDataReturn {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatTitle, setChatTitle] = useState('New Chat');
  const [isFirstUserMessage, setIsFirstUserMessage] = useState(true);

  // Load chat data on mount
  useEffect(() => {
    const loadChatData = () => {
      // Validate chatId
      if (!chatId || typeof chatId !== 'string') {
        console.error('Invalid chat ID:', chatId);
        const newChatId = createNewChat('New Chat');
        router.replace(`/chat/${newChatId}`);
        return;
      }

      try {
        let chat = getChatById(chatId);
        
        // If chat doesn't exist, create a new one or redirect
        if (!chat) {
          console.log(`Chat with ID ${chatId} not found, creating new chat`);
          const newChatId = createNewChat('New Chat');
          router.replace(`/chat/${newChatId}`);
          return;
        }
        
        // Validate chat data structure
        if (!chat.messages || !Array.isArray(chat.messages)) {
          console.error('Invalid chat data structure:', chat);
          const newChatId = createNewChat('New Chat');
          router.replace(`/chat/${newChatId}`);
          return;
        }
        
        // Convert storage messages to component messages (with Date objects)
        const componentMessages: Message[] = chat.messages.map(msg => {
          try {
            return {
              ...msg,
              timestamp: new Date(msg.timestamp)
            };
          } catch (error) {
            console.error('Error parsing message timestamp:', error);
            return {
              ...msg,
              timestamp: new Date() // Fallback to current time
            };
          }
        });
        
        setMessages(componentMessages);
        setChatTitle(chat.title || 'New Chat');
        
        // Check if this chat has user messages to determine if it's the first
        const hasUserMessages = chat.messages.some(msg => msg.sender === 'user');
        setIsFirstUserMessage(!hasUserMessages);
        
        // Update last accessed time
        updateLastAccessed(chatId);
        
        // Scroll to bottom when chat loads
        setTimeout(scrollToBottom, 100);
      } catch (error) {
        console.error('Error loading chat data:', error);
        const newChatId = createNewChat('New Chat');
        router.replace(`/chat/${newChatId}`);
      }
    };

    if (chatId) {
      loadChatData();
    }
  }, [chatId, router, scrollToBottom]);

  const addMessage = (message: Message) => {
    setMessages(prev => [...prev, message]);
  };

  const updateMessage = (messageId: string, content: string) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId 
        ? { ...msg, content }
        : msg
    ));
  };

  const saveMessageToStorage = (message: Message) => {
    saveChatMessage(chatId, {
      id: message.id,
      content: message.content,
      sender: message.sender,
      timestamp: message.timestamp
    });
  };

  const removeMessage = (messageId: string) => {
    setMessages(prev => prev.filter(msg => msg.id !== messageId));
  };

  const generateTitleFromFirstMessage = (content: string) => {
    if (isFirstUserMessage) {
      const newTitle = generateChatTitle(content);
      updateChatTitle(chatId, newTitle);
      setChatTitle(newTitle);
      setIsFirstUserMessage(false);
    }
  };

  return {
    messages,
    chatTitle,
    isFirstUserMessage,
    setMessages,
    setChatTitle,
    setIsFirstUserMessage,
    addMessage,
    updateMessage,
    removeMessage,
    saveMessageToStorage,
    generateTitleFromFirstMessage,
  };
}