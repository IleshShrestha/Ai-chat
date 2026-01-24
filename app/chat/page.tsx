'use client';
import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createNewChat } from '../utils/chatStorage';

export default function ChatRedirectPage() {
  const router = useRouter();
  const hasRedirected = useRef(false);

  useEffect(() => {
    // Prevent double execution (especially in development with React Strict Mode)
    if (hasRedirected.current) return;
    
    hasRedirected.current = true;
    
    // Create a new chat and redirect to it
    const newChatId = createNewChat('New Chat');
    router.replace(`/chat/${newChatId}`);
  }, []); // Empty dependency array to ensure this only runs once on mount

  return (
    <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
        <p>Creating new chat...</p>
      </div>
    </div>
  );
}