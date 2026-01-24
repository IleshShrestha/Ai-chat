'use client';
import { useState } from "react";
import { motion } from "motion/react";
import Sidebar from "../components/sidebar";
import { MenuIcon } from "lucide-react";


export default function ChatLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex relative">
      <Sidebar isOpen={isSidebarOpen} onToggle={toggleSidebar} />
      
      {/* Hamburger Menu Button */}
      <motion.button
        onClick={toggleSidebar}
        className={`fixed top-4 z-20 p-2 bg-gray-800 text-white rounded-lg shadow-lg hover:bg-gray-700 transition-colors ${
          isSidebarOpen ? 'left-80' : 'left-4'
        }`}
        animate={{ 
          left: isSidebarOpen ? 336 : 16, 
        }}
        transition={{ 
          duration: 0.3, 
          ease: "easeInOut" 
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <motion.div
          animate={{ rotate: isSidebarOpen ? 90 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <MenuIcon className="w-5 h-5" />
        </motion.div>
      </motion.button>

      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}