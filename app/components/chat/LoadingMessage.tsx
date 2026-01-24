'use client';
import { motion } from 'motion/react';

export default function LoadingMessage() {
  const bounceTransition = {
    duration: 0.6,
    repeat: Infinity,
    repeatType: "reverse" as const,
  };

  return (
    <div className="flex items-start space-x-3 justify-start">
      <div className="shrink-0 w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
        <span className="text-white font-bold text-sm">AI</span>
      </div>
      <div className="max-w-3xl px-4 py-3 rounded-lg bg-gray-800 text-gray-100">
        <div className="flex items-center space-x-1">
          <div className="flex space-x-1 items-end">
            <motion.div
              className="w-2 h-2 bg-purple-400 rounded-full"
              animate={{
                y: [0, -8, 0],
              }}
              transition={{
                ...bounceTransition,
                delay: 0,
              }}
            />
            <motion.div
              className="w-2 h-2 bg-purple-400 rounded-full"
              animate={{
                y: [0, -8, 0],
              }}
              transition={{
                ...bounceTransition,
                delay: 0.2,
              }}
            />
            <motion.div
              className="w-2 h-2 bg-purple-400 rounded-full"
              animate={{
                y: [0, -8, 0],
              }}
              transition={{
                ...bounceTransition,
                delay: 0.4,
              }}
            />
          </div>
          <span className="text-sm text-gray-400 ml-2">AI is thinking...</span>
        </div>
      </div>
    </div>
  );
}