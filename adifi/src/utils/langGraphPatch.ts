import { AsyncLocalStorage } from './browserPolyfills';

// Create a browser-compatible storage provider
class BrowserStorageProvider {
    private static instance: BrowserStorageProvider;
    private storage: AsyncLocalStorage<any>;

    private constructor() {
        this.storage = new AsyncLocalStorage();
    }

    static getInstance(): BrowserStorageProvider {
        if (!BrowserStorageProvider.instance) {
            BrowserStorageProvider.instance = new BrowserStorageProvider();
        }
        return BrowserStorageProvider.instance;
    }

    getStorage() {
        return this.storage;
    }
}

// Patch LangGraph's storage provider
(window as any).AsyncLocalStorageProviderSingleton = {
    getInstance: () => BrowserStorageProvider.getInstance(),
    getStorage: () => BrowserStorageProvider.getInstance().getStorage()
}; 