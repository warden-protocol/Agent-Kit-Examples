import { EIP155_SIGNING_METHODS } from "../types/eip155";
export type RequestType = "sign" | "signTypedData" | "sendTransaction";
export type RequestId = `${RequestType}:${string}`;

export const getRequestType = (method: string): RequestType => {
    switch (method) {
        case EIP155_SIGNING_METHODS.ETH_SIGN:
        case EIP155_SIGNING_METHODS.PERSONAL_SIGN:
            return "sign";

        case EIP155_SIGNING_METHODS.ETH_SIGN_TYPED_DATA:
        case EIP155_SIGNING_METHODS.ETH_SIGN_TYPED_DATA_V3:
        case EIP155_SIGNING_METHODS.ETH_SIGN_TYPED_DATA_V4:
            return "signTypedData";

        case EIP155_SIGNING_METHODS.ETH_SEND_TRANSACTION:
        case EIP155_SIGNING_METHODS.ETH_SIGN_TRANSACTION:
            return "sendTransaction";

        default:
            throw new Error("Unsupported method");
    }
};
