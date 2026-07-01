'use client';
import { useParams } from 'next/navigation';
import ChatView from '../ChatView';

export default function ChatPage() {
	const params = useParams();
	const chatId = params.id as string;
	return <ChatView initialChatId={chatId} />;
}
