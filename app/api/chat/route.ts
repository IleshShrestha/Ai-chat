import { NextResponse, NextRequest } from 'next/server';
import { OpenAI } from 'openai';

interface ChatRequest {
    message: string;
    model: string;
}

export async function POST(req: NextRequest, {params}: {params: ChatRequest}) {
    try {
        const client = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });


        const { message, model } = await req.json();

        const response = await client.responses.create({
            model: model,
            input: message,
            
            
        });
        console.log("Response: ", response);

        return NextResponse.json({ 
            message: response.output_text,
            success: true 
        });


        
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json(
            { error: 'Failed to process message', success: false }, 
            { status: 500 }
        );
    }
}

