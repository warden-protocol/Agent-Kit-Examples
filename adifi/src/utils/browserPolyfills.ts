// Mock AsyncLocalStorage for browser environment
class AsyncLocalStorage<T> {
    private store: T | undefined;
  
    constructor() {
        this.store = undefined;
    }
  
    run(store: T, callback: () => any) {
        this.store = store;
        try {
            return callback();
        } finally {
            this.store = undefined;
        }
    }
  
    getStore(): T | undefined {
        return this.store;
    }
}

// Make it globally available
(window as any).AsyncLocalStorage = AsyncLocalStorage;
(globalThis as any).AsyncLocalStorage = AsyncLocalStorage;

export { AsyncLocalStorage }; 