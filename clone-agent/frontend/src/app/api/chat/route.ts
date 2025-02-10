import { NextResponse } from 'next/server';
import { chatService } from '@/ai/ai-service';

interface ChatResponse {
  assistantId: string;
  threadId: string;
  text: {
    value: string;
    annotations: never[];
  };
}

export async function POST(req: Request) {
  try {
    const { message, threadId } = await req.json();

    console.log('Processing message:', message);
    
    const result = await chatService.processMessage(
      threadId,
      message,
    ) as ChatResponse;

    console.log('Chat API result:', result);

    return NextResponse.json({
      assistantId: result.assistantId,
      threadId: result.threadId,
      content: result.text.value
    });

  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Failed to process message' },
      { status: 500 }
    );
  }
}