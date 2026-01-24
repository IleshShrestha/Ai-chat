'use client';
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

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.aside
          className="bg-[#1a2332] border-r flex flex-col overflow-hidden"
          initial={{ width: 0, opacity: 0 }}
          animate={{ 
            width: 320, 
            opacity: 1 
          }}
          exit={{ 
            width: 0, 
            opacity: 0 
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
      )}
    </AnimatePresence>
  );
}

