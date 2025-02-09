import type { RunnableConfig } from "@langchain/core/runnables";
import { BaseCheckpointSaver, Checkpoint, CheckpointListOptions, CheckpointTuple } from "./base.js";
import { SerializerProtocol } from "./serde/base.js";
import { CheckpointMetadata, PendingWrite } from "./types.js";
import { SendProtocol } from "./serde/types.js";
export declare class MemorySaver extends BaseCheckpointSaver {
    storage: Record<string, Record<string, Record<string, [Uint8Array, Uint8Array, string | undefined]>>>;
    writes: Record<string, Record<string, [string, string, Uint8Array]>>;
    constructor(serde?: SerializerProtocol);
    _getPendingSends(threadId: string, checkpointNs: string, parentCheckpointId?: string): Promise<SendProtocol[]>;
    getTuple(config: RunnableConfig): Promise<CheckpointTuple | undefined>;
    list(config: RunnableConfig, options?: CheckpointListOptions): AsyncGenerator<CheckpointTuple>;
    put(config: RunnableConfig, checkpoint: Checkpoint, metadata: CheckpointMetadata): Promise<RunnableConfig>;
    putWrites(config: RunnableConfig, writes: PendingWrite[], taskId: string): Promise<void>;
}
