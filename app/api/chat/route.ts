import { NextRequest } from 'next/server';
import { OpenAI } from 'openai';

interface ChatRequest {
    message: string;
    model: string;
}

export async function POST(req: NextRequest) {
    try {
        const { message, model } = await req.json();

        // Initialize OpenAI client
        const openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });

        // Create a streaming response
        const stream = await openai.chat.completions.create({
            model: model || 'gpt-3.5-turbo',
            messages: [
                {
                    role: 'system',
                    content: 'You are Spark, a helpful AI assistant. Provide clear, concise, and helpful responses.'
                },
                {
                    role: 'user',
                    content: message
                }
            ],
            stream: true,
            max_tokens: 1000,
            temperature: 0.7,
        });

        // Create a readable stream for the response
        const encoder = new TextEncoder();
        const readable = new ReadableStream({
            async start(controller) {
                try {
                    for await (const chunk of stream) {
                        const content = chunk.choices[0]?.delta?.content || '';
                        if (content) {
                            // Send the content chunk as Server-Sent Events format
                            const data = `data: ${JSON.stringify({ content, done: false })}\n\n`;
                            controller.enqueue(encoder.encode(data));
                        }
                    }
                    // Send completion signal
                    const doneData = `data: ${JSON.stringify({ content: '', done: true })}\n\n`;
                    controller.enqueue(encoder.encode(doneData));
                    controller.close();
                } catch (error) {
                    console.error('Streaming error:', error);
                    const errorData = `data: ${JSON.stringify({ error: 'Stream error occurred', done: true })}\n\n`;
                    controller.enqueue(encoder.encode(errorData));
                    controller.close();
                }
            },
        });

        return new Response(readable, {
            headers: {
                'Content-Type': 'text/stream',
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST',
                'Access-Control-Allow-Headers': 'Content-Type',
            },
        });

    } catch (error) {
        console.error('API Error:', error);
        return new Response(
            JSON.stringify({ error: 'Failed to process message', success: false }), 
            { 
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            }
        );
    }
}