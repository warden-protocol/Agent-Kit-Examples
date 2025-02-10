import { SerializedEthereumRpcError } from '../error/utils.js';
export type RPCResponse = {
    result: {
        value: unknown;
    } | {
        error: SerializedEthereumRpcError;
    };
    data?: {
        chains?: {
            [key: number]: string;
        };
        capabilities?: Record<`0x${string}`, Record<string, unknown>>;
    };
};
//# sourceMappingURL=RPCResponse.d.ts.map