'use client';
import { useState, useEffect } from 'react';
import useAutoScroll from '../hooks/useAutoScroll';
import useChat from '../hooks/useChat';
import LoadingMessage from '../components/chat/LoadingMessage';
import MessageBubble from '../components/chat/MessageBubble';
import ModelDropdown from '../components/chat/ModelDropdown';
import MessageInput from '../components/chat/MessageInput';

// Renders a chat. With `initialChatId` it loads an existing conversation;
// without one it's a draft — nothing is persisted until the first message.
export default function ChatView({ initialChatId }: { initialChatId?: string }) {
	const [selectedModel, setSelectedModel] = useState('gpt-4o-mini');

	const { messagesEndRef, messagesContainerRef, scrollToBottom } = useAutoScroll(
		[],
		false
	);
	const { messages, isLoading, streamingMessageId, sendMessage } = useChat(
		initialChatId,
		scrollToBottom
	);

	const handleSendMessage = (content: string) => {
		sendMessage(content, selectedModel);
	};

	// Auto-scroll when messages or loading state changes.
	useEffect(() => {
		if (messages.length > 0) {
			const timer = setTimeout(() => scrollToBottom(), 100);
			return () => clearTimeout(timer);
		}
	}, [messages.length, isLoading, scrollToBottom]);

	return (
		<div className="flex flex-col h-screen bg-(--color-background) text-(--color-text-primary) w-full">
			{/* Messages Area */}
			<div ref={messagesContainerRef} className="flex-1 overflow-y-auto relative">
				<div
					className="max-w-none mx-auto px-4 pt-16 pb-6 space-y-6
												min-w-[320px]
												sm:min-w-[480px] sm:max-w-2xl sm:px-6
												md:min-w-[600px] md:max-w-3xl"
				>
					{messages.map((message) => (
						<MessageBubble
							key={message.id}
							message={message}
							isStreaming={message.id === streamingMessageId}
						/>
					))}

					{isLoading && <LoadingMessage />}

					<div ref={messagesEndRef} />
				</div>
			</div>

			{/* Input Area */}
			<div className="border-t border-(--color-border) bg-(--color-background)">
				<div
					className="max-w-none mx-auto px-4 py-6
												min-w-[320px]
												sm:min-w-[480px] sm:max-w-2xl sm:px-6
												md:min-w-[600px] md:max-w-3xl"
				>
					<ModelDropdown
						selectedModel={selectedModel}
						onModelChange={setSelectedModel}
						disabled={isLoading}
					/>

					<MessageInput onSendMessage={handleSendMessage} isLoading={isLoading} />

					<p className="text-(--color-text-muted) text-xs mt-2 text-center">
						Press Enter to send, Shift + Enter for new line
					</p>
				</div>
			</div>
		</div>
	);
}
