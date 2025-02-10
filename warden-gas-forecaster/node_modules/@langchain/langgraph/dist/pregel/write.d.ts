import { Runnable, RunnableConfig, RunnableLike } from "@langchain/core/runnables";
import { Send } from "../constants.js";
import { RunnableCallable } from "../utils.js";
export declare const SKIP_WRITE: {
    [x: symbol]: boolean;
};
export declare const PASSTHROUGH: {
    [x: symbol]: boolean;
};
/**
 * Mapping of write channels to Runnables that return the value to be written,
 * or None to skip writing.
 */
export declare class ChannelWrite<RunInput = any> extends RunnableCallable<RunInput, RunInput> {
    writes: Array<ChannelWriteEntry | ChannelWriteTupleEntry | Send>;
    constructor(writes: Array<ChannelWriteEntry | ChannelWriteTupleEntry | Send>, tags?: string[]);
    _write(input: unknown, config: RunnableConfig): Promise<unknown>;
    static doWrite(config: RunnableConfig, writes: (ChannelWriteEntry | ChannelWriteTupleEntry | Send)[]): Promise<void>;
    static isWriter(runnable: RunnableLike): runnable is ChannelWrite;
    static registerWriter<T extends Runnable>(runnable: T): T;
}
export interface ChannelWriteEntry {
    channel: string;
    value: unknown;
    skipNone?: boolean;
    mapper?: Runnable;
}
export interface ChannelWriteTupleEntry {
    value: unknown;
    mapper: Runnable<any, [string, any][]>;
}
