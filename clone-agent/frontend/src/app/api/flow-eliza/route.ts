import { elizaClient } from '@/ai/eliza';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const { message } = await req.json();

        const response = await elizaClient.getAgents();
        console.log('Received agents:', response);

        if (!response?.agents || !Array.isArray(response.agents) || response.agents.length === 0) {
            throw new Error('No agents available');
        }

        // Use the first agent
        const agentId = response.agents[0].id;
        console.log('Using agent:', agentId);

        // Send message
        const messageResponse = await elizaClient.sendMessage(agentId, message);
        console.log('Agent response:', messageResponse);
        
        // Handle the response - now accessing the correct properties
        const responseText = messageResponse?.[0]?.text || 'No response from agent';

        return NextResponse.json({ response: responseText });
    } catch (error) {
        console.error('Chat error:', error);
        return NextResponse.json(
            { 
                error: 'Failed to process message',
                // @ts-ignore
                details: error.message 
            },
            { status: 500 }
        );
    }
}