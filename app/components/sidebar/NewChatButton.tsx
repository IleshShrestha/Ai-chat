'use client';
import { motion } from 'motion/react';
import { Plus } from 'lucide-react';

interface NewChatButtonProps {
  onClick: () => void;
}

export default function NewChatButton({ onClick }: NewChatButtonProps) {
  return (
    <motion.div 
      className="p-4"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      <motion.button 
        onClick={onClick}
        className="w-full bg-purple-600 text-white rounded-lg py-2 px-4 hover:bg-purple-700 transition-colors flex items-center justify-center"
        
        whileTap={{ scale: 0.98 }}
      >
        <Plus className="w-5 h-5 mr-2" />
        New Chat
      </motion.button>
    </motion.div>
  );
}