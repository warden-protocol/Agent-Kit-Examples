import { createCoinbaseWalletProvider } from './createCoinbaseWalletProvider.js';
import { VERSION } from './sdk-info.js';
import { ScopedLocalStorage } from './core/storage/ScopedLocalStorage.js';
import { checkCrossOriginOpenerPolicy } from './util/checkCrossOriginOpenerPolicy.js';
import { validatePreferences } from './util/validatePreferences.js';
const DEFAULT_PREFERENCE = {
    options: 'all',
};
/**
 * Create a Coinbase Wallet SDK instance.
 * @param params - Options to create a Coinbase Wallet SDK instance.
 * @returns A Coinbase Wallet SDK object.
 */
export function createCoinbaseWalletSDK(params) {
    var _a;
    const versionStorage = new ScopedLocalStorage('CBWSDK');
    versionStorage.setItem('VERSION', VERSION);
    void checkCrossOriginOpenerPolicy();
    const options = {
        metadata: {
            appName: params.appName || 'Dapp',
            appLogoUrl: params.appLogoUrl || '',
            appChainIds: params.appChainIds || [],
        },
        preference: Object.assign(DEFAULT_PREFERENCE, (_a = params.preference) !== null && _a !== void 0 ? _a : {}),
    };
    /**
     * Validate user supplied preferences. Throws if key/values are not valid.
     */
    validatePreferences(options.preference);
    let provider = null;
    return {
        getProvider: () => {
            if (!provider) {
                provider = createCoinbaseWalletProvider(options);
            }
            return provider;
        },
    };
}
//# sourceMappingURL=createCoinbaseWalletSDK.js.map