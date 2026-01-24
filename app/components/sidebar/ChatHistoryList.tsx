'use client';
import { useState } from 'react';
import { motion } from 'motion/react';
import { usePathname, useRouter } from 'next/navigation';
import ChatItem from './ChatItem';
import RenameModal from '../chat/RenameModal';
import DeleteConfirmModal from '../chat/DeleteConfirmModal';
import { updateChatTitle, deleteChatById } from '../../utils/chatStorage';

interface Chat {
  id: string;
  title: string;
}

interface ChatHistoryListProps {
  chats: Chat[];
  onChatDeleted?: () => void;
  onChatRenamed?: () => void;
}

export default function ChatHistoryList({ chats, onChatDeleted, onChatRenamed }: ChatHistoryListProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [renameModalOpen, setRenameModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [chatToDelete, setChatToDelete] = useState<Chat | null>(null);

  const handleRename = (chatId: string) => {
    const chat = chats.find(c => c.id === chatId);
    if (chat) {
      setSelectedChat(chat);
      setRenameModalOpen(true);
    }
  };

  const handleSaveRename = (chatId: string, newTitle: string) => {
    updateChatTitle(chatId, newTitle);
    onChatRenamed?.();
  };

  const handleDelete = (chatId: string) => {
    const chat = chats.find(c => c.id === chatId);
    if (chat) {
      setChatToDelete(chat);
      setDeleteModalOpen(true);
    }
  };

  const confirmDelete = () => {
    if (chatToDelete) {
      const success = deleteChatById(chatToDelete.id);
      if (success) {
        // If we're currently viewing the deleted chat, redirect to chat page
        if (pathname.includes(chatToDelete.id)) {
          router.push('/chat');
        }
        onChatDeleted?.();
      }
    }
  };

  return (
    <>
      <motion.div 
        className="flex-1 overflow-y-auto px-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {chats.length === 0 ? (
          <div className="px-3 py-2 text-gray-500 text-sm text-center">
            No chats yet. Create your first chat!
          </div>
        ) : (
          chats.map((chat, index) => (
            <ChatItem
              key={chat.id}
              chat={chat}
              isActive={pathname.includes(chat.id)}
              index={index}
              onRename={handleRename}
              onDelete={handleDelete}
            />
          ))
        )}
      </motion.div>
      
      {selectedChat && (
        <RenameModal
          isOpen={renameModalOpen}
          chatId={selectedChat.id}
          currentTitle={selectedChat.title}
          onClose={() => {
            setRenameModalOpen(false);
            setSelectedChat(null);
          }}
          onSave={handleSaveRename}
        />
      )}
      
      {chatToDelete && (
        <DeleteConfirmModal
          isOpen={deleteModalOpen}
          chatTitle={chatToDelete.title}
          onClose={() => {
            setDeleteModalOpen(false);
            setChatToDelete(null);
          }}
          onConfirm={confirmDelete}
        />
      )}
    </>
  );
}