// Copyright (c) 2018-2024 Coinbase, Inc. <https://www.coinbase.com/>
import { walletLogo } from './assets/wallet-logo.js';
import { CoinbaseWalletProvider } from './CoinbaseWalletProvider.js';
import { VERSION } from './sdk-info.js';
import { ScopedLocalStorage } from './core/storage/ScopedLocalStorage.js';
import { getFavicon } from './core/type/util.js';
import { checkCrossOriginOpenerPolicy } from './util/checkCrossOriginOpenerPolicy.js';
import { getCoinbaseInjectedProvider } from './util/provider.js';
import { validatePreferences } from './util/validatePreferences.js';
/**
 * CoinbaseWalletSDK
 *
 * @deprecated CoinbaseWalletSDK is deprecated and will likely be removed in a future major version release.
 * It's recommended to use `createCoinbaseWalletSDK` instead.
 */
export class CoinbaseWalletSDK {
    constructor(metadata) {
        this.metadata = {
            appName: metadata.appName || 'Dapp',
            appLogoUrl: metadata.appLogoUrl || getFavicon(),
            appChainIds: metadata.appChainIds || [],
        };
        this.storeLatestVersion();
        void checkCrossOriginOpenerPolicy();
    }
    makeWeb3Provider(preference = { options: 'all' }) {
        var _a;
        validatePreferences(preference);
        const params = { metadata: this.metadata, preference };
        return (_a = getCoinbaseInjectedProvider(params)) !== null && _a !== void 0 ? _a : new CoinbaseWalletProvider(params);
    }
    /**
     * Official Coinbase Wallet logo for developers to use on their frontend
     * @param type Type of wallet logo: "standard" | "circle" | "text" | "textWithLogo" | "textLight" | "textWithLogoLight"
     * @param width Width of the logo (Optional)
     * @returns SVG Data URI
     */
    getCoinbaseWalletLogo(type, width = 240) {
        return walletLogo(type, width);
    }
    storeLatestVersion() {
        const versionStorage = new ScopedLocalStorage('CBWSDK');
        versionStorage.setItem('VERSION', VERSION);
    }
}
//# sourceMappingURL=CoinbaseWalletSDK.js.map