'use client';
import { motion } from 'motion/react';
import Link from 'next/link';
import ChatMenu from '../chat/ChatMenu';

interface ChatItemProps {
  chat: {
    id: string;
    title: string;
  };
  isActive: boolean;
  index: number;
  onRename: (chatId: string) => void;
  onDelete: (chatId: string) => void;
}

export default function ChatItem({ chat, isActive, index, onRename, onDelete }: ChatItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3 + index * 0.05 }}
      className="group relative"
    >
      <div
        className={`
          flex items-center justify-between px-3 py-2 rounded-lg mb-1 transition-colors
          ${isActive 
            ? 'bg-[#2a3441]' 
            : 'hover:bg-[#343d4d]'
          }
        `}
      >
        <Link
          href={`/chat/${chat.id}`}
          className="flex-1 truncate text-white"
          title={chat.title}
        >
          {chat.title}
        </Link>
        <ChatMenu 
          chatId={chat.id}
          onRename={onRename}
          onDelete={onDelete}
        />
      </div>
    </motion.div>
  );
}