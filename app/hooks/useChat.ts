'use client';
import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import useChatData, { Message } from './useChatData';
import streamResponse from './useStreamingResponse';
import { createNewChat } from '../utils/chatStorage';

// Broadcast so the sidebar (a sibling component) can refresh its chat list.
function notifyChatsChanged() {
	window.dispatchEvent(new Event('chats:changed'));
}

export default function useChat(
	initialChatId: string | undefined,
	scrollToBottom: () => void
) {
	const router = useRouter();
	const { messages, chatTitle, addMessage, updateMessage, removeMessage } =
		useChatData(initialChatId, scrollToBottom);

	// The persisted chat id. Null while this is still a draft. Kept in a ref so
	// creating it mid-send doesn't retrigger useChatData's load effect.
	const chatIdRef = useRef<string | null>(initialChatId ?? null);

	const [isLoading, setIsLoading] = useState(false);
	const [streamingMessageId, setStreamingMessageId] = useState<string | null>(
		null
	);

	const sendMessage = async (content: string, selectedModel: string) => {
		if (!content.trim() || isLoading) return;

		// Lazily create the chat on the first message. createNewChat seeds the
		// greeting; the API route names the chat from this first message.
		let chatId = chatIdRef.current;
		if (!chatId) {
			const newId = await createNewChat('New Chat');
			if (!newId) {
				router.push('/login');
				return;
			}
			chatId = newId;
			chatIdRef.current = newId;
			// Swap the URL to the real chat without a Next navigation, so the
			// component stays mounted and streaming continues uninterrupted.
			window.history.replaceState(null, '', `/chat/${newId}`);
			notifyChatsChanged();
		}

		const userMessage: Message = {
			id: Date.now().toString(),
			content,
			sender: 'user',
			timestamp: new Date(),
		};
		addMessage(userMessage);
		setTimeout(scrollToBottom, 100);

		setIsLoading(true);

		const aiMessage: Message = {
			id: (Date.now() + 1).toString(),
			content: '',
			sender: 'ai',
			timestamp: new Date(),
		};
		let hasStartedStreaming = false;

		try {
			await streamResponse(chatId, content, selectedModel, {
				onFirstChunk: () => {
					hasStartedStreaming = true;
					setIsLoading(false);
					addMessage(aiMessage);
					setStreamingMessageId(aiMessage.id);
				},
				onChunk: (fullContent: string) => {
					updateMessage(aiMessage.id, fullContent);
					setTimeout(scrollToBottom, 0);
				},
				onComplete: (fullContent: string) => {
					if (fullContent) updateMessage(aiMessage.id, fullContent);
					setStreamingMessageId(null);
					// Title/order may have changed server-side; refresh the sidebar.
					notifyChatsChanged();
				},
				onError: (error: Error) => {
					console.error('Error sending message:', error);
					if (hasStartedStreaming) removeMessage(aiMessage.id);
					addMessage({
						id: (Date.now() + 1).toString(),
						content:
							'Sorry, there was an error processing your message. Please try again.',
						sender: 'ai',
						timestamp: new Date(),
					});
					setStreamingMessageId(null);
				},
			});
		} catch (error) {
			console.error('Unexpected error in sendMessage:', error);
		} finally {
			setIsLoading(false);
		}
	};

	return {
		messages,
		chatTitle,
		isLoading,
		streamingMessageId,
		sendMessage,
	};
}
