import { getAccount } from '../getAccount.js';
import { getChainId } from '../getChainId.js';
import { writeContract, } from '../writeContract.js';
export function createWriteContract(c) {
    if (c.address !== undefined && typeof c.address === 'object')
        return (config, parameters) => {
            const configChainId = getChainId(config);
            const account = getAccount(config);
            let chainId;
            if (parameters.chainId)
                chainId = parameters.chainId;
            else if (parameters
                .account &&
                parameters
                    .account === account.address)
                chainId = account.chainId;
            else if (parameters
                .account === undefined)
                chainId = account.chainId;
            else
                chainId = configChainId;
            return writeContract(config, {
                ...parameters,
                ...(c.functionName ? { functionName: c.functionName } : {}),
                address: chainId ? c.address?.[chainId] : undefined,
                abi: c.abi,
            });
        };
    return (config, parameters) => {
        return writeContract(config, {
            ...parameters,
            ...(c.address ? { address: c.address } : {}),
            ...(c.functionName ? { functionName: c.functionName } : {}),
            abi: c.abi,
        });
    };
}
//# sourceMappingURL=createWriteContract.js.map