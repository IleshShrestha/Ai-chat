'use client';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

interface MessageBubbleProps {
  message: Message;
}

// Helper function to format message content with line breaks
const formatMessageContent = (content: string) => {
  return content.split('\n').map((line, index, array) => (
    <span key={index}>
      {line}
      {index < array.length - 1 && <br />}
    </span>
  ));
};

export default function MessageBubble({ message }: MessageBubbleProps) {
  return (
    <div
      className={`flex items-start space-x-3 ${
        message.sender === 'user' ? 'justify-end' : 'justify-start'
      }`}
    >
      {message.sender === 'ai' && (
        <div className="shrink-0 w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
          <span className="text-white font-bold text-sm">AI</span>
        </div>
      )}
      <div
        className={`px-4 py-3 rounded-lg ${
          message.sender === 'ai'
            ? 'bg-gray-800 text-gray-100'
            : 'bg-teal-500 text-white'
        } max-w-[280px] sm:max-w-md md:max-w-lg lg:max-w-xl`}
      >
        <p className="text-sm leading-relaxed whitespace-pre-wrap">
          {formatMessageContent(message.content)}
        </p>
      </div>
      {message.sender === 'user' && (
        <div className="shrink-0 w-8 h-8 bg-sky-600 rounded-full flex items-center justify-center">
          <span className="text-white font-bold text-sm">U</span>
        </div>
      )}
    </div>
  );
}