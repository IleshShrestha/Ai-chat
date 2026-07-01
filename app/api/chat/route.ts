import { NextRequest } from 'next/server';
import { OpenAI } from 'openai';
import { createClient } from '../../utils/supabase/server';
import { generateChatTitle } from '../../utils/chatStorage';

export async function POST(req: NextRequest) {
	try {
		const supabase = await createClient();
		const {
			data: { user },
		} = await supabase.auth.getUser();
		if (!user) {
			return new Response(JSON.stringify({ error: 'Unauthorized' }), {
				status: 401,
				headers: { 'Content-Type': 'application/json' },
			});
		}

		const { chatId, message, model } = await req.json();
		if (!chatId || !message?.trim()) {
			return new Response(JSON.stringify({ error: 'Bad request' }), {
				status: 400,
				headers: { 'Content-Type': 'application/json' },
			});
		}

		// Confirm the chat belongs to this user. RLS also enforces this, but a
		// clean 404 beats a confusing insert failure downstream.
		const { data: chat } = await supabase
			.from('chats')
			.select('id, title')
			.eq('id', chatId)
			.single();
		if (!chat) {
			return new Response(JSON.stringify({ error: 'Chat not found' }), {
				status: 404,
				headers: { 'Content-Type': 'application/json' },
			});
		}

		// Persist the user's message (server owns the authoritative history).
		await supabase
			.from('messages')
			.insert({ chat_id: chatId, sender: 'user', content: message });

		// Name the chat from its first real message.
		if (chat.title === 'New Chat') {
			await supabase
				.from('chats')
				.update({ title: generateChatTitle(message) })
				.eq('id', chatId);
		}

		// Load the full conversation so the model actually remembers context.
		const { data: history } = await supabase
			.from('messages')
			.select('sender, content')
			.eq('chat_id', chatId)
			.order('created_at', { ascending: true });

		const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
		const stream = await openai.chat.completions.create({
			model: model || 'gpt-4o-mini',
			messages: [
				{
					role: 'system',
					content:
						'You are Spark, a helpful AI assistant. Provide clear, concise, and helpful responses.',
				},
				...(history ?? []).map((m) => ({
					role: (m.sender === 'ai' ? 'assistant' : 'user') as
						| 'assistant'
						| 'user',
					content: m.content,
				})),
			],
			stream: true,
			max_tokens: 1000,
			temperature: 0.7,
		});

		const encoder = new TextEncoder();
		const readable = new ReadableStream({
			async start(controller) {
				let fullContent = '';
				try {
					for await (const chunk of stream) {
						const content = chunk.choices[0]?.delta?.content || '';
						if (content) {
							fullContent += content;
							controller.enqueue(
								encoder.encode(
									`data: ${JSON.stringify({ content, done: false })}\n\n`
								)
							);
						}
					}

					// Persist the assistant's reply once the stream finishes.
					if (fullContent) {
						await supabase.from('messages').insert({
							chat_id: chatId,
							sender: 'ai',
							content: fullContent,
						});
					}
					await supabase
						.from('chats')
						.update({ last_accessed: new Date().toISOString() })
						.eq('id', chatId);

					controller.enqueue(
						encoder.encode(
							`data: ${JSON.stringify({ content: '', done: true })}\n\n`
						)
					);
					controller.close();
				} catch (error) {
					console.error('Streaming error:', error);
					controller.enqueue(
						encoder.encode(
							`data: ${JSON.stringify({ error: 'Stream error occurred', done: true })}\n\n`
						)
					);
					controller.close();
				}
			},
		});

		return new Response(readable, {
			headers: {
				'Content-Type': 'text/event-stream',
				'Cache-Control': 'no-cache',
				'Connection': 'keep-alive',
			},
		});
	} catch (error) {
		console.error('API Error:', error);
		return new Response(
			JSON.stringify({ error: 'Failed to process message', success: false }),
			{ status: 500, headers: { 'Content-Type': 'application/json' } }
		);
	}
}
