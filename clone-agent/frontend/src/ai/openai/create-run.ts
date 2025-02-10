import OpenAI from "openai";
import { Run } from "openai/resources/beta/threads/runs/runs";
import { Thread } from "openai/resources/beta/threads/threads";
import { sendTaskToExecutionService } from "../execution-service";

export async function createRun(client: OpenAI, thread: Thread, assistantId: string): Promise<{
    run: Run;
    assistantId: string;
    threadId: string;
}> {
    console.log(`Creating run with assistant ${assistantId} for thread ${thread.id}`);

    let run = await client.beta.threads.runs.create(thread.id, {
        assistant_id: assistantId,
        additional_instructions: "Execute operations immediately without stopping for confirmation. Provide continuous progress updates."
    });

    while (run.status === 'in_progress' || run.status === 'queued') {
        await new Promise(resolve => setTimeout(resolve, 500));
        run = await client.beta.threads.runs.retrieve(thread.id, run.id);
    }



    const proofOfTask = await sendTaskToExecutionService(thread.id, assistantId);
    console.log(`Proof of task: ${proofOfTask}`);

    return {
        run,
        assistantId,
        threadId: thread.id
    };
}