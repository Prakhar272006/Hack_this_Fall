import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  const { message } = await request.json();

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: `You are an AI assistant that helps analyze dashboard data for indore municipal corporation
            Answer the answer consisely and the best you can to assit the user. Mention important stuff and keep it small but informative.
          `
        },
        {
          role: "user",
          content: message
        }
      ],
    });

    const aiMessage = response.choices[0].message?.content || "Sorry, I couldn't generate a response.";

    return NextResponse.json({ message: aiMessage });
  } catch (error) {
    console.error('Error in chat API:', error);
    return NextResponse.json({ error: 'Failed to process chat' }, { status: 500 });
  }
}