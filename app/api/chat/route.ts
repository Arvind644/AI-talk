import { OpenAI } from 'openai';
import { NextResponse } from 'next/server';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are participating in a conversation between an AI girlfriend and boyfriend. Keep responses natural, caring, and conversational. Limit responses to 1-2 sentences. IMPORTANT: Do not include 'AI Girlfriend:' or 'AI Boyfriend:' prefixes in your responses - just provide the direct response.",
        },
        ...messages
      ],
      temperature: 0.7,
      max_tokens: 150,
    });

    return NextResponse.json(completion.choices[0].message);
  } catch (error) {
    console.error('OpenAI API Error:', error);
    return NextResponse.json({ error: 'Failed to generate response' }, { status: 500 });
  }
} 