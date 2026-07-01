'use client';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { getAllChats, type Chat } from '../utils/chatStorage';

export default function useChatList(isOpen: boolean) {
	const [chats, setChats] = useState<Chat[]>([]);
	const router = useRouter();

	const refreshChats = useCallback(async () => {
		try {
			const storedChats = await getAllChats();
			setChats(storedChats);
		} catch (error) {
			console.error('Error loading chats:', error);
			setChats([]);
		}
	}, []);

	// Load on mount / when the sidebar opens.
	useEffect(() => {
		refreshChats();
	}, [isOpen, refreshChats]);

	// Refresh when a chat is created/renamed/deleted elsewhere in the app.
	useEffect(() => {
		window.addEventListener('chats:changed', refreshChats);
		return () => window.removeEventListener('chats:changed', refreshChats);
	}, [refreshChats]);

	// "New Chat" just opens a draft — no row is created until the first message.
	const handleCreateNewChat = () => {
		router.push('/chat');
	};

	return {
		chats,
		handleCreateNewChat,
		refreshChats,
	};
}
