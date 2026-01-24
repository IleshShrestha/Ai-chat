'use client';
import { motion } from 'motion/react';
import { Settings } from 'lucide-react';

export default function SidebarFooter() {
  return (
    <motion.div 

      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <motion.button 
        className="w-full flex items-center justify-center px-3 py-2 hover:bg-[#343d4d] rounded-lg transition-colors text-white"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Settings className="w-4 h-4 mr-2" />
        Settings
      </motion.button>
    </motion.div>
  );
}