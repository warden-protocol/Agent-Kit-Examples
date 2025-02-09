import { AppMetadata, Preference, ProviderInterface } from './core/provider/interface.js';
export type CreateCoinbaseWalletSDKOptions = Partial<AppMetadata> & {
    preference?: Preference;
};
/**
 * Create a Coinbase Wallet SDK instance.
 * @param params - Options to create a Coinbase Wallet SDK instance.
 * @returns A Coinbase Wallet SDK object.
 */
export declare function createCoinbaseWalletSDK(params: CreateCoinbaseWalletSDKOptions): {
    getProvider: () => ProviderInterface;
};
//# sourceMappingURL=createCoinbaseWalletSDK.d.ts.map