import { createPublicClient, http } from 'viem'
import { flowTestnet } from 'viem/chains'

export function createViemPublicClient() {
    return createPublicClient({
        chain: flowTestnet,
        transport: http(),
    });
}