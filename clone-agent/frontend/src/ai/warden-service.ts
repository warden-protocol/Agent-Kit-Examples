import { initializeAgent } from '@/ai/templates/warden/warden';

interface WardenResponse {
  threadId: string;
  content: string;
}

class WardenService {
  private agent: any = null;
  private agentConfig: any = null;

  async getOrCreateAgent() {
    if (!this.agent) {
      const { agent, config } = await initializeAgent();
      this.agent = agent;
      this.agentConfig = config;
    }
    return { agent: this.agent, config: this.agentConfig };
  }

  async processMessage(message: string): Promise<WardenResponse> {
    try {
      const { agent, config } = await this.getOrCreateAgent();

      const result = await agent.invoke(
        { input: message },
        config
      );

      // console.log('Warden result:', result);

      return {
        threadId: config.configurable.thread_id,
        content: result.messages[2].content || 'No response generated'
      };
    } catch (error) {
      console.error('Warden service error:', error);
      throw error;
    }
  }
}

export const wardenService = new WardenService();