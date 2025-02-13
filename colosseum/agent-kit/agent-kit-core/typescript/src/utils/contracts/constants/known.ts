import { wardenChiado, wardenDevnet } from "../../../utils/chains";
import actPrecompileAbi from "../abi/actPrecompileAbi";
import erc20Abi from "../abi/erc20Abi";
import slinkyPrecompileAbi from "../abi/slinkyPrecompileAbi";
import wardenPrecompileAbi from "../abi/wardenPrecompileAbi";
import { formatAbiItem, toFunctionSelector } from "viem/utils";

const PRECOMPILE_WARDEN_ADDRESS = "0x0000000000000000000000000000000000000900";
const PRECOMPILE_ACT_ADDRESS = "0x0000000000000000000000000000000000000901";
const PRECOMPILE_SLINKY_ADDRESS = "0x0000000000000000000000000000000000000902";

const PRECOMPILE_CONTRACTS = {
    ACT: {
        abi: actPrecompileAbi,
        address: PRECOMPILE_ACT_ADDRESS,
    },
    WARDEN: {
        abi: wardenPrecompileAbi,
        address: PRECOMPILE_WARDEN_ADDRESS,
    },
    SLINKY: {
        abi: slinkyPrecompileAbi,
        address: PRECOMPILE_SLINKY_ADDRESS,
    },
} as const;

type Precompiles = typeof PRECOMPILE_CONTRACTS;
type KnownContracts = Record<number, Partial<Precompiles> | undefined>;

export const KNOWN_CONTRACTS: KnownContracts = {
    [wardenChiado.id]: PRECOMPILE_CONTRACTS,
    [wardenDevnet.id]: PRECOMPILE_CONTRACTS,
};

export const KNOWN_SELECTORS = [
    erc20Abi,
    wardenPrecompileAbi,
    actPrecompileAbi,
    slinkyPrecompileAbi,
].reduce<Record<`0x${string}`, string | undefined>>((acc, abi) => {
    const selectors = abi.reduce<Record<`0x${string}`, string | undefined>>(
        (acc, item) => {
            if (item.type !== "function") {
                return acc;
            }

            const selector = toFunctionSelector(formatAbiItem(item));
            return { ...acc, [selector]: item.name };
        },
        {}
    );

    return { ...acc, ...selectors };
}, {});
