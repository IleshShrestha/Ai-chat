'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getChatById, updateLastAccessed, GREETING } from '../utils/chatStorage';

export interface Message {
	id: string;
	content: string;
	sender: 'user' | 'ai';
	timestamp: Date;
}

interface UseChatDataReturn {
	messages: Message[];
	chatTitle: string;
	isLoaded: boolean;
	setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
	addMessage: (message: Message) => void;
	updateMessage: (messageId: string, content: string) => void;
	removeMessage: (messageId: string) => void;
}

// The local-only greeting shown in a draft chat before anything is persisted.
function greetingMessage(): Message {
	return {
		id: 'greeting',
		content: GREETING,
		sender: 'ai',
		timestamp: new Date(),
	};
}

export default function useChatData(
	chatId: string | undefined,
	scrollToBottom: () => void
): UseChatDataReturn {
	const router = useRouter();
	// Draft starts with the local greeting; an existing chat starts empty and
	// fills in once the DB load resolves (avoids a greeting flash).
	const [messages, setMessages] = useState<Message[]>(() =>
		chatId ? [] : [greetingMessage()]
	);
	const [chatTitle, setChatTitle] = useState('New Chat');
	const [isLoaded, setIsLoaded] = useState(false);

	useEffect(() => {
		let cancelled = false;

		// Draft chat: no id yet. Show the greeting locally; persist nothing.
		if (!chatId) {
			setMessages([greetingMessage()]);
			setChatTitle('New Chat');
			setIsLoaded(true);
			return;
		}

		const loadChatData = async () => {
			try {
				const chat = await getChatById(chatId);
				if (cancelled) return;

				// Unknown id (bad URL / deleted chat) → fall back to a draft.
				if (!chat) {
					router.replace('/chat');
					return;
				}

				setMessages(
					chat.messages.map((msg) => ({
						...msg,
						timestamp: new Date(msg.timestamp),
					}))
				);
				setChatTitle(chat.title || 'New Chat');
				setIsLoaded(true);

				updateLastAccessed(chatId);
				setTimeout(scrollToBottom, 100);
			} catch (error) {
				console.error('Error loading chat data:', error);
				if (!cancelled) router.replace('/chat');
			}
		};

		loadChatData();

		return () => {
			cancelled = true;
		};
	}, [chatId, router, scrollToBottom]);

	const addMessage = (message: Message) => {
		setMessages((prev) => [...prev, message]);
	};

	const updateMessage = (messageId: string, content: string) => {
		setMessages((prev) =>
			prev.map((msg) => (msg.id === messageId ? { ...msg, content } : msg))
		);
	};

	const removeMessage = (messageId: string) => {
		setMessages((prev) => prev.filter((msg) => msg.id !== messageId));
	};

	return {
		messages,
		chatTitle,
		isLoaded,
		setMessages,
		addMessage,
		updateMessage,
		removeMessage,
	};
}
