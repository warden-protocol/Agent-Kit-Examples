import axios from 'axios';

const EXECUTION_SERVICE_URL = process.env.EXECUTION_SERVICE_URL;

export async function sendTaskToExecutionService(threadId: string, assistantId: string): Promise<string> {
  const response = await axios.post(`${EXECUTION_SERVICE_URL}/task/execute`, {
    threadId,
    assistantId
  });

  if (response.data.error === false) {
    return response.data.data.proofOfTask;
  } else {
    throw new Error(response.data.message);
  }
}
