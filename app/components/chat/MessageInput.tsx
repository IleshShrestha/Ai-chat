'use client';
import { useState } from 'react';
import { Send } from 'lucide-react';

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

export default function MessageInput({ onSendMessage, isLoading }: MessageInputProps) {
  const [inputMessage, setInputMessage] = useState('');

  const handleSendMessage = () => {
    if (inputMessage.trim() && !isLoading) {
      onSendMessage(inputMessage);
      setInputMessage('');
      
      // Reset textarea height
      setTimeout(() => {
        const textarea = document.querySelector('textarea');
        if (textarea) {
          textarea.style.height = '48px';
        }
      }, 0);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && !isLoading) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputMessage(e.target.value);
    
    // Auto-grow the textarea
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 200) + 'px';
  };

  return (
    <div className="flex items-end space-x-3">
      <div className="flex-1 relative">
        <textarea
          value={inputMessage}
          onChange={handleTextareaChange}
          onKeyDown={handleKeyPress}
          disabled={isLoading}
          placeholder={isLoading ? "AI is thinking..." : "Message..."}
          className={`w-full border border-gray-600 rounded-lg px-4 py-3 pr-12 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent overflow-hidden ${
            isLoading
              ? 'bg-gray-700 text-gray-400 placeholder-gray-500 cursor-not-allowed'
              : 'bg-gray-800 text-white placeholder-gray-400'
          }`}
          rows={1}
          style={{ minHeight: '48px', maxHeight: '200px' }}
        />
        <button
          onClick={handleSendMessage}
          disabled={isLoading}
          className={`absolute right-2 bottom-4 p-2 text-white rounded-full transition-colors ${
            isLoading 
              ? 'bg-gray-600 cursor-not-allowed' 
              : 'bg-purple-600 hover:bg-purple-700'
          }`}
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}