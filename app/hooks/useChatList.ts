'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getAllChats, createNewChat, type Chat } from '../utils/chatStorage';

export default function useChatList(isOpen: boolean) {
  const [chats, setChats] = useState<Chat[]>([]);
  const router = useRouter();

  // Load chats from localStorage on mount and when sidebar opens
  useEffect(() => {
    const loadChats = () => {
      try {
        const storedChats = getAllChats();
        setChats(storedChats);
      } catch (error) {
        console.error('Error loading chats:', error);
        setChats([]);
      }
    };

    loadChats();
    
    // Reload chats when sidebar opens to get latest data
    if (isOpen) {
      loadChats();
    }
  }, [isOpen]);

  const refreshChats = () => {
    try {
      const updatedChats = getAllChats();
      setChats(updatedChats);
    } catch (error) {
      console.error('Error refreshing chats:', error);
    }
  };

  const handleCreateNewChat = () => {
    const newChatId = createNewChat('New Chat');
    router.push(`/chat/${newChatId}`);
    
    // Refresh the chat list
    refreshChats();
  };

  return {
    chats,
    handleCreateNewChat,
    refreshChats,
  };
}