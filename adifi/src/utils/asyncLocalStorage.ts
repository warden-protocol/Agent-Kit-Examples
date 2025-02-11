class MockAsyncLocalStorage {
    private store: Map<string, any>;

    constructor() {
        this.store = new Map();
    }

    getStore() {
        return this.store;
    }

    run(store: any, callback: () => any) {
        this.store.set('current', store);
        const result = callback();
        this.store.delete('current');
        return result;
    }
}

export const AsyncLocalStorage = MockAsyncLocalStorage; 