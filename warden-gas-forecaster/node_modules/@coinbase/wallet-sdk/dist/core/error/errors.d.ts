export declare const standardErrors: {
    rpc: {
        parse: <T>(arg?: EthErrorsArg<T>) => EthereumRpcError<T>;
        invalidRequest: <T>(arg?: EthErrorsArg<T>) => EthereumRpcError<T>;
        invalidParams: <T>(arg?: EthErrorsArg<T>) => EthereumRpcError<T>;
        methodNotFound: <T>(arg?: EthErrorsArg<T>) => EthereumRpcError<T>;
        internal: <T>(arg?: EthErrorsArg<T>) => EthereumRpcError<T>;
        server: <T>(opts: ServerErrorOptions<T>) => EthereumRpcError<T>;
        invalidInput: <T>(arg?: EthErrorsArg<T>) => EthereumRpcError<T>;
        resourceNotFound: <T>(arg?: EthErrorsArg<T>) => EthereumRpcError<T>;
        resourceUnavailable: <T>(arg?: EthErrorsArg<T>) => EthereumRpcError<T>;
        transactionRejected: <T>(arg?: EthErrorsArg<T>) => EthereumRpcError<T>;
        methodNotSupported: <T>(arg?: EthErrorsArg<T>) => EthereumRpcError<T>;
        limitExceeded: <T>(arg?: EthErrorsArg<T>) => EthereumRpcError<T>;
    };
    provider: {
        userRejectedRequest: <T>(arg?: EthErrorsArg<T>) => EthereumProviderError<T>;
        unauthorized: <T>(arg?: EthErrorsArg<T>) => EthereumProviderError<T>;
        unsupportedMethod: <T>(arg?: EthErrorsArg<T>) => EthereumProviderError<T>;
        disconnected: <T>(arg?: EthErrorsArg<T>) => EthereumProviderError<T>;
        chainDisconnected: <T>(arg?: EthErrorsArg<T>) => EthereumProviderError<T>;
        unsupportedChain: <T>(arg?: EthErrorsArg<T>) => EthereumProviderError<T>;
        custom: <T>(opts: CustomErrorArg<T>) => EthereumProviderError<T>;
    };
};
interface EthereumErrorOptions<T> {
    message?: string;
    data?: T;
}
interface ServerErrorOptions<T> extends EthereumErrorOptions<T> {
    code: number;
}
type CustomErrorArg<T> = ServerErrorOptions<T>;
type EthErrorsArg<T> = EthereumErrorOptions<T> | string;
declare class EthereumRpcError<T> extends Error {
    code: number;
    data?: T;
    constructor(code: number, message: string, data?: T);
}
declare class EthereumProviderError<T> extends EthereumRpcError<T> {
    /**
     * Create an Ethereum Provider JSON-RPC error.
     * `code` must be an integer in the 1000 <= 4999 range.
     */
    constructor(code: number, message: string, data?: T);
}
export {};
//# sourceMappingURL=errors.d.ts.map