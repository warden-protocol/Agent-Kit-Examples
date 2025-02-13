import { NextResponse } from 'next/server';
import { wardenService } from '@/ai/warden-service';

export async function POST(req: Request) {
  try {
    const { message } = await req.json();
    
    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    console.log('Processing message:', message);
    
    const result = await wardenService.processMessage(message);
    console.log('Warden API result:', result);

    return NextResponse.json({
      threadId: result.threadId,
      content: result.content
    });

  } catch (error) {
    console.error('Warden API error:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    return NextResponse.json(
      { 
        error: 'Failed to process message',
        details: errorMessage 
      },
      { status: 500 }
    );
  }
}