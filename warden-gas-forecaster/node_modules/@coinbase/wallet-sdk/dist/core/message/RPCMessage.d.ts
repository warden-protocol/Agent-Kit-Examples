import { SerializedEthereumRpcError } from '../error/utils.js';
import { Message, MessageID } from './Message.js';
import { RequestArguments } from '../provider/interface.js';
interface RPCMessage extends Message {
    id: MessageID;
    sender: string;
    content: unknown;
    timestamp: Date;
}
export type EncryptedData = {
    iv: ArrayBuffer;
    cipherText: ArrayBuffer;
};
export interface RPCRequestMessage extends RPCMessage {
    content: {
        handshake: RequestArguments;
    } | {
        encrypted: EncryptedData;
    };
}
export interface RPCResponseMessage extends RPCMessage {
    requestId: MessageID;
    content: {
        encrypted: EncryptedData;
    } | {
        failure: SerializedEthereumRpcError;
    };
}
export {};
//# sourceMappingURL=RPCMessage.d.ts.map