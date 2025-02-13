import OpenAI from 'openai';
import { createAssistant } from './openai/create-assistant';
import { createThread } from './openai/create-thread';
import { createRun } from './openai/create-run';
import { performRun } from './openai/perform-run';
import { Thread } from 'openai/resources/beta/threads/threads';
import { Assistant } from 'openai/resources/beta/assistants';

interface ChatResponse {
  assistantId: string;
  threadId: string;
  text: {
    value: string;
    annotations: any[];
  };
}

class ChatService {
  private client: OpenAI;
  private assistant: Assistant | null = null;
  private threads: Map<string, Thread> = new Map();
  private latestResponse: ChatResponse | null = null;

  constructor() {
    this.client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async getLatestResponse(): Promise<ChatResponse | null> {
    return this.latestResponse;
  }

  async getOrCreateAssistant() {
    if (!this.assistant) {
      this.assistant = await createAssistant(this.client);
    }
    return this.assistant;
  }

  async getOrCreateThread(threadId: string) {
    let thread = this.threads.get(threadId);
    if (!thread) {
      thread = await createThread(this.client);
      this.threads.set(threadId, thread);
    }
    return thread;
  }

  async processMessage(threadId: string, message: string): Promise<ChatResponse> {
    try {
      const assistant = await this.getOrCreateAssistant();
      const thread = await this.getOrCreateThread(threadId);
      await this.client.beta.threads.messages.create(thread.id, {
        role: "user",
        content: message
      });

      const runResult = await createRun(this.client, thread, assistant.id);
      const runResponse = await performRun(runResult.run, this.client, thread);

      if ('text' in runResponse) {
        const response = {
          assistantId: runResult.assistantId,
          threadId: runResult.threadId,
          text: {
            value: runResponse.text.value,
            annotations: runResponse.text.annotations || []
          }
        };
        this.latestResponse = response;
        return response;
      }

      throw new Error('Unexpected response format');
    } catch (error) {
      console.error('Chat service error:', error);
      throw error;
    }
  }
}

export const chatService = new ChatService();