import {
    Account,
    Chain,
    SendTransactionParameters,
    SendTransactionRequest,
    assertRequest,
    formatTransactionRequest,
    TransactionRequest,
    encodeFunctionData,
    TransactionSerializable,
    serializeTransaction,
} from "viem";
import { extract } from "viem/utils";
import { parseAccount } from "viem/accounts";
import erc20Abi from "./contracts/abi/erc20Abi";
import wardenPrecompileAbi from "./contracts/abi/wardenPrecompileAbi";
import { KNOWN_CONTRACTS } from "./contracts/constants/known";
import { primaryChain } from "./chains";
import { KeyType } from "./contracts/constants/enums";

const ETH_ANALYZER =
    "0xade4a5f5803a439835c636395a8d648dee57b2fc90d98dc17fa887159b69638b"; // TODO: move to constants or env

const wardenContract = KNOWN_CONTRACTS[primaryChain.id]?.WARDEN;

function prepareEth<
    c extends Chain | undefined,
    acc extends Account | undefined,
    request extends SendTransactionRequest<c, chainOverride>,
    chainOverride extends Chain | undefined = undefined
>(
    chain: c,
    account_: acc | `0x${string}`,
    parameters: Omit<
        SendTransactionParameters<c, acc, chainOverride, request>,
        "chain" | "account"
    >
) {
    const {
        accessList,
        // authorizationList,
        blobs,
        data,
        gas,
        gasPrice,
        maxFeePerBlobGas,
        maxFeePerGas,
        maxPriorityFeePerGas,
        nonce,
        value,
        ...rest
    } = parameters;

    if (typeof account_ === "undefined") throw new Error("account not found");
    const account = account_ ? parseAccount(account_) : null;
    const to = rest.to;
    assertRequest({ ...parameters, chain, account } as TransactionRequest);

    if (account?.type === "json-rpc" || account === null) {
        const chainId = chain?.id;
        if (!chainId) throw new Error("chainId not found");

        const chainFormat = chain?.formatters?.transactionRequest?.format;
        const format: typeof formatTransactionRequest =
            chainFormat || formatTransactionRequest;

        const request = {
            // Pick out extra data that might exist on the chain's transaction request type.
            ...extract(rest, { format: chainFormat }),
            accessList,
            // authorizationList,
            blobs,
            chainId,
            data,
            from: account?.address,
            gas,
            gasPrice,
            maxFeePerBlobGas,
            maxFeePerGas,
            maxPriorityFeePerGas,
            nonce,
            to,
            value,
        } as TransactionRequest;

        return { request, format };
    }

    throw new Error(`unsupported account type: ${account?.type}`);
}

export type EthPrepare = ReturnType<typeof prepareEth>;

export const createSendTransaction = (params: {
    chain: Chain;
    from: `0x${string}`;
    to: `0x${string}`;
    token?: `0x${string}`;
    amount: bigint;
}) => {
    const data = params.token
        ? encodeFunctionData({
              abi: erc20Abi,
              functionName: "transfer",
              args: [params.to, params.amount],
          })
        : undefined;

    return prepareEth(params.chain, params.from, {
        data,
        to: params.token ?? params.to,
        value: params.token ? BigInt(0) : params.amount,
    });
};

export const createNewSpaceTransaction = (params: {
    chain: Chain;
    from: `0x${string}`;
}) => {
    return prepareEth(params.chain, params.from, {
        data: encodeFunctionData({
            abi: wardenPrecompileAbi,
            functionName: "newSpace",
            args: [BigInt(0), BigInt(0), BigInt(0), BigInt(0), []],
        }),
        to: wardenContract?.address,
        value: BigInt(0),
    });
};

export const createNewKeyTransaction = (params: {
    chain: Chain;
    from: `0x${string}`;
    spaceId: bigint;
    keychainId: bigint;
    keyType: KeyType;
    signTemplateId: bigint;
    rejectTemplateId: bigint;
    nonce: bigint;
    expectedApproveExpression: string;
    expectedRejectExpression: string;
}) => {
    return prepareEth(params.chain, params.from, {
        data: encodeFunctionData({
            abi: wardenPrecompileAbi,
            functionName: "newKeyRequest",
            args: [
                params.spaceId,
                params.keychainId,
                params.keyType,
                params.signTemplateId,
                params.rejectTemplateId,
                [],
                params.nonce,
                BigInt(0),
                params.expectedApproveExpression,
                params.expectedRejectExpression,
            ],
        }),
        to: wardenContract?.address,
        value: BigInt(0),
    });
};

// export const createNewSignRequestTransaction = (params: {
//     chain: Chain;
//     from: `0x${string}`;
//     keyId: bigint;
//     nonce: bigint;
//     expectedApproveExpression: string;
//     expectedRejectExpression: string;
//     inner: TransactionSerializable;
// }) => {
//     return prepareEth(params.chain, params.from, {
//         data: encodeFunctionData({
//             abi: wardenPrecompileAbi,
//             functionName: "newSignRequest",
//             args: [
//                 params.keyId,
//                 serializeTransaction(params.inner),
//                 [ETH_ANALYZER],
//                 "0x",
//                 [],
//                 params.nonce,
//                 BigInt(0),
//                 params.expectedApproveExpression,
//                 params.expectedRejectExpression,
//             ],
//         }),
//         to: wardenContract?.address,
//         value: BigInt(0),
//     });
// };
