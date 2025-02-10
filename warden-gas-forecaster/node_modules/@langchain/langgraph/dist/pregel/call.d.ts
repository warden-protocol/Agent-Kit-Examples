import { Runnable } from "@langchain/core/runnables";
import { RetryPolicy } from "./utils/index.js";
import { EntrypointFunc, EntrypointReturnT, TaskFunc } from "../func/types.js";
import { LangGraphRunnableConfig } from "./runnable_types.js";
/**
 * Wraps a user function in a Runnable that writes the returned value to the RETURN channel.
 */
export declare function getRunnableForFunc<ArgsT extends unknown[], OutputT>(name: string, func: TaskFunc<ArgsT, OutputT>): Runnable<ArgsT, OutputT, LangGraphRunnableConfig>;
export declare function getRunnableForEntrypoint<InputT, OutputT>(name: string, func: EntrypointFunc<InputT, OutputT>): Runnable<InputT, EntrypointReturnT<OutputT>, LangGraphRunnableConfig>;
export type CallWrapperOptions<ArgsT extends unknown[], OutputT> = {
    func: TaskFunc<ArgsT, OutputT>;
    name: string;
    retry?: RetryPolicy;
};
export declare function call<ArgsT extends unknown[], OutputT>({ func, name, retry }: CallWrapperOptions<ArgsT, OutputT>, ...args: ArgsT): Promise<OutputT>;
