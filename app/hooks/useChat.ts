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

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

export default function useChat(chatId: string, scrollToBottom: () => void) {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatTitle, setChatTitle] = useState('New Chat');
  const [isFirstUserMessage, setIsFirstUserMessage] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

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

  const sendMessage = async (content: string, selectedModel: string) => {
    if (!content.trim() || isLoading) return;

    // Add user message immediately
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: 'user',
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    // Auto-scroll to bottom when user sends message
    setTimeout(scrollToBottom, 100);
    
    // Save user message to localStorage
    saveChatMessage(chatId, {
      id: userMessage.id,
      content: userMessage.content,
      sender: userMessage.sender,
      timestamp: userMessage.timestamp
    });
    
    // Generate and update chat title if this is the first user message
    if (isFirstUserMessage) {
      const newTitle = generateChatTitle(content);
      updateChatTitle(chatId, newTitle);
      setChatTitle(newTitle);
      setIsFirstUserMessage(false);
    }

    // Set loading state
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        body: JSON.stringify({ 
          message: content,
          model: selectedModel 
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Response: ", data);
      
      // Add AI response
      if (data.success && data.message) {
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: data.message,
          sender: 'ai',
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, aiMessage]);
        
        // Save AI message to localStorage
        saveChatMessage(chatId, {
          id: aiMessage.id,
          content: aiMessage.content,
          sender: aiMessage.sender,
          timestamp: aiMessage.timestamp
        });
      } else {
        throw new Error(data.error || 'Unknown error occurred');
      }
      
    } catch (error) {
      console.error('Error sending message:', error);
      // Add error message
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Sorry, there was an error processing your message. Please try again.',
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
      
      // Save error message to localStorage
      saveChatMessage(chatId, {
        id: errorMessage.id,
        content: errorMessage.content,
        sender: errorMessage.sender,
        timestamp: errorMessage.timestamp
      });
    } finally {
      // Clear loading state
      setIsLoading(false);
    }
  };

  return {
    messages,
    chatTitle,
    isLoading,
    sendMessage,
  };
}