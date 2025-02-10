import type { Config } from "wagmi";
import { readContractQueryOptions } from "wagmi/query";
import wardenPrecompileAbi from "./abi/wardenPrecompileAbi";
import { primaryChain } from "../chains";
import { KNOWN_CONTRACTS } from "./constants/known";

const wardenContract = KNOWN_CONTRACTS[primaryChain.id]?.WARDEN;

export const getSignRequestByIdQueryOptions = (config: Config, id: bigint) =>
  readContractQueryOptions(config, {
    chainId: primaryChain.id,
    address: wardenContract?.address,
    abi: wardenPrecompileAbi,
    functionName: "signRequestById",
    args: [id],
  });
