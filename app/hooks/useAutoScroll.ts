'use client';
import { useRef, useEffect, useCallback } from 'react';

export default function useAutoScroll(messages: any[], isLoading: boolean) {
	const messagesEndRef = useRef<HTMLDivElement>(null);
	const messagesContainerRef = useRef<HTMLDivElement>(null);

	// Auto-scroll functions - useCallback to prevent recreation
	const scrollToBottom = useCallback(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
	}, []);

	const isAtBottom = useCallback(() => {
		if (!messagesContainerRef.current) return true;
		
		const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
		// Consider "at bottom" if within 100px of the bottom
		return scrollTop + clientHeight >= scrollHeight - 100;
	}, []);

	// Auto-scroll when messages change, but only if user is at bottom
	useEffect(() => {
		if (messages.length > 0 && isAtBottom()) {
			scrollToBottom();
		}
	}, [messages.length, isLoading, isAtBottom, scrollToBottom]);

	return {
		messagesEndRef,
		messagesContainerRef,
		scrollToBottom,
	};
}