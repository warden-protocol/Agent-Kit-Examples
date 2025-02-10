const ELIZA_SERVER_URL = process.env.NEXT_PUBLIC_ELIZA_SERVER_URL || 'http://localhost:3000';

export const elizaClient = {
    getAgents: async () => {
        try {
            const response = await fetch(`${ELIZA_SERVER_URL}/agents`);
            const data = await response.json();
            console.log('Agents response:', data);
            return data;
        } catch (error) {
            console.error('Error fetching agents:', error);
            throw error;
        }
    },

    sendMessage: async (agentId: string, message: string) => {
        const formData = new FormData();
        formData.append('text', message);
        formData.append('user', 'user');

        try {
            const response = await fetch(`${ELIZA_SERVER_URL}/${agentId}/message`, {
                method: 'POST',
                body: formData
            });
            const data = await response.json();
            console.log('Message response:', data);
            return data;
        } catch (error) {
            console.error('Error sending message:', error);
            throw error;
        }
    }
};