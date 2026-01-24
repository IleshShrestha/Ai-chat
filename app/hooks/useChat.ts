'use client';
import { useState } from 'react';
import useChatData, { Message } from './useChatData';
import streamResponse from './useStreamingResponse';

export default function useChat(chatId: string, scrollToBottom: () => void) {
	const {
		messages,
		chatTitle,
		isFirstUserMessage,
		addMessage,
		updateMessage,
		removeMessage,
		saveMessageToStorage,
		generateTitleFromFirstMessage,
	} = useChatData(chatId, scrollToBottom);
	
	const [isLoading, setIsLoading] = useState(false);
	const [streamingMessageId, setStreamingMessageId] = useState<string | null>(null);


	const sendMessage = async (content: string, selectedModel: string) => {
		if (!content.trim() || isLoading) return;

		// Add user message immediately
		const userMessage: Message = {
			id: Date.now().toString(),
			content,
			sender: 'user',
			timestamp: new Date(),
		};
		
		addMessage(userMessage);
		
		// Auto-scroll to bottom when user sends message
		setTimeout(scrollToBottom, 100);
		
		// Save user message to localStorage
		saveMessageToStorage(userMessage);
		
		// Generate and update chat title if this is the first user message
		generateTitleFromFirstMessage(content);

		// Set loading state
		setIsLoading(true);

		// Create AI message but don't add it to state yet - wait for first chunk
		const aiMessage: Message = {
			id: (Date.now() + 1).toString(),
			content: '',
			sender: 'ai',
			timestamp: new Date(),
		};
		
		let hasStartedStreaming = false;

		try {
			await streamResponse(content, selectedModel, {
				onFirstChunk: () => {
					hasStartedStreaming = true;
					setIsLoading(false);
					addMessage(aiMessage);
					setStreamingMessageId(aiMessage.id);
				},
				onChunk: (fullContent: string) => {
					updateMessage(aiMessage.id, fullContent);
					// Auto-scroll to bottom as content streams
					setTimeout(scrollToBottom, 0);
				},
				onComplete: (fullContent: string) => {
					// Update final content if needed
					if (fullContent) {
						updateMessage(aiMessage.id, fullContent);
					}
					// Save final message to localStorage
					saveMessageToStorage({
						...aiMessage,
						content: fullContent || aiMessage.content,
					});
					setStreamingMessageId(null);
				},
				onError: (error: Error) => {
					console.error('Error sending message:', error);
					
					// Remove partial AI message if streaming had started
					if (hasStartedStreaming) {
						removeMessage(aiMessage.id);
					}
					
					// Add error message
					const errorMessage: Message = {
						id: (Date.now() + 1).toString(),
						content: 'Sorry, there was an error processing your message. Please try again.',
						sender: 'ai',
						timestamp: new Date(),
					};
					
					addMessage(errorMessage);
					
					// Save error message to localStorage
					saveMessageToStorage(errorMessage);
					
					setStreamingMessageId(null);
				},
			});
		} catch (error) {
			console.error('Unexpected error in sendMessage:', error);
			setIsLoading(false);
		} finally {
			// Clear loading state
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