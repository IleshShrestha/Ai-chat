'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import useChatList from '../hooks/useChatList';
import NewChatButton from './sidebar/NewChatButton';
import ChatHistoryList from './sidebar/ChatHistoryList';
import SidebarFooter from './sidebar/SidebarFooter';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export default function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const { chats, handleCreateNewChat, refreshChats } = useChatList(isOpen);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop overlay for mobile */}
          <motion.div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onToggle}
          />
          
          {/* Sidebar */}
          <motion.aside
            className="bg-[#1a2332] border-r flex flex-col overflow-hidden
                       fixed md:relative
                       left-0 top-0 h-full z-50
                       md:z-auto md:h-full md:self-stretch"
            initial={{ 
              width: 0, 
              opacity: 0,
              x: isMobile ? -320 : 0
            }}
            animate={{ 
              width: 320, 
              opacity: 1,
              x: 0
            }}
            exit={{ 
              width: 0, 
              opacity: 0,
              x: isMobile ? -320 : 0
            }}
            transition={{ 
              duration: 0.3, 
              ease: "easeInOut" 
            }}
          >
          <NewChatButton onClick={handleCreateNewChat} />
          <ChatHistoryList 
            chats={chats} 
            onChatDeleted={refreshChats}
            onChatRenamed={refreshChats}
          />
          <SidebarFooter />
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

