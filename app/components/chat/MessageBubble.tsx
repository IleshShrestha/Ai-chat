'use client';

import { Bot, User } from "lucide-react";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';

interface Message {
	id: string;
	content: string;
	sender: 'user' | 'ai';
	timestamp: Date;
}

interface MessageBubbleProps {
	message: Message;
	isStreaming?: boolean;
}

// Helper function to format message content with line breaks (for user messages)
const formatMessageContent = (content: string) => {
	return content.split('\n').map((line, index, array) => (
		<span key={index}>
			{line}
			{index < array.length - 1 && <br />}
		</span>
	));
};

export default function MessageBubble({ message, isStreaming = false }: MessageBubbleProps) {
	return (
		<div
			className={`flex items-start space-x-3 ${
				message.sender === 'user' ? 'justify-end' : 'justify-start'
			}`}
		>
			{message.sender === 'ai' && (
				<div className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'var(--gradient-bot)' }}>
					<Bot className="w-4 h-4 text-white font-bold" />
				</div>
			)}
			<div
				className={`px-4 py-3 rounded-lg ${
					message.sender === 'ai'
						? 'bg-(--color-primary) text-(--color-text-primary)'
						: 'bg-(--color-secondary) text-(--color-text-primary)'
				} max-w-[280px] sm:max-w-md md:max-w-lg lg:max-w-xl`}
			>
				{message.sender === 'ai' ? (
					<div className="text-sm leading-relaxed max-w-none">
						<ReactMarkdown
							remarkPlugins={[remarkGfm]}
							rehypePlugins={[rehypeHighlight]}
							components={{
								// Customize code blocks
								code({ node, inline, className, children, ...props }: any) {
									const match = /language-(\w+)/.exec(className || '');
									return !inline && match ? (
										<pre className="bg-(--color-background) rounded p-3 overflow-x-auto my-2">
											<code className={className} {...props}>
												{children}
											</code>
										</pre>
									) : (
										<code className="bg-(--color-secondary) px-1.5 py-0.5 rounded text-sm" {...props}>
											{children}
										</code>
									);
								},
								// Customize paragraphs
								p({ children }: any) {
									return <p className="my-2">{children}</p>;
								},
								// Customize lists
								ul({ children }: any) {
									return <ul className="list-disc list-inside my-2 space-y-1">{children}</ul>;
								},
								ol({ children }: any) {
									return <ol className="list-decimal list-inside my-2 space-y-1">{children}</ol>;
								},
								// Customize headings
								h1({ children }: any) {
									return <h1 className="text-xl font-bold my-3">{children}</h1>;
								},
								h2({ children }: any) {
									return <h2 className="text-lg font-bold my-2">{children}</h2>;
								},
								h3({ children }: any) {
									return <h3 className="text-base font-bold my-2">{children}</h3>;
								},
								// Customize links
								a({ children, href }: any) {
									return (
										<a href={href} className="text-(--color-accent) hover:text-(--color-accent-hover) underline" target="_blank" rel="noopener noreferrer">
											{children}
										</a>
									);
								},
								// Customize blockquotes
								blockquote({ children }: any) {
									return (
										<blockquote className="border-l-4 border-(--color-border) pl-4 my-2 italic">
											{children}
										</blockquote>
									);
								},
								// Customize tables
								table({ children }: any) {
									return (
										<div className="overflow-x-auto my-2">
											<table className="min-w-full border-collapse border border-(--color-border)">
												{children}
											</table>
										</div>
									);
								},
								th({ children }: any) {
									return (
										<th className="border border-(--color-border) px-3 py-2 bg-(--color-secondary) font-semibold">
											{children}
										</th>
									);
								},
								td({ children }: any) {
									return (
										<td className="border border-(--color-border) px-3 py-2">
											{children}
										</td>
									);
								},
							}}
						>
							{message.content}
						</ReactMarkdown>
						{isStreaming && (
							<span className="inline-block w-2 h-5 bg-gray-100 ml-1 typing-cursor">|</span>
						)}
					</div>
				) : (
					<p className="text-sm leading-relaxed whitespace-pre-wrap">
						{formatMessageContent(message.content)}
					</p>
				)}
			</div>
			{message.sender === 'user' && (
				<div className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'var(--gradient-user)' }}>
					<User className="w-4 h-4 text-white" />
				</div>
			)}
		</div>
	);
}