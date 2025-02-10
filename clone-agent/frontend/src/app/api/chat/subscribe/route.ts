import { NextResponse } from 'next/server';
import { chatService } from '@/ai/ai-service';

interface SubscribeResponse {
  assistantId: string;
  threadId: string;
  content: string;
  timestamp?: number;
}

export async function POST(req: Request) {
  try {
    const result = await chatService.getLatestResponse();
    
    if (!result) {
      return NextResponse.json(
        { 
          error: 'No chat response available yet',
          timestamp: Date.now()
        },
        { status: 404 }
      );
    }

    const response: SubscribeResponse = {
      assistantId: result.assistantId,
      threadId: result.threadId,
      content: result.text.value,
      timestamp: Date.now()
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Chat subscription error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to subscribe to chat',
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: Date.now()
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const result = await chatService.getLatestResponse();
    
    if (!result) {
      return NextResponse.json(
        { 
          error: 'No chat response available yet',
          timestamp: Date.now()
        },
        { status: 404 }
      );
    }

    const response: SubscribeResponse = {
      assistantId: result.assistantId,
      threadId: result.threadId,
      content: result.text.value,
      timestamp: Date.now()
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Chat subscription error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch chat response',
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: Date.now()
      },
      { status: 500 }
    );
  }
}