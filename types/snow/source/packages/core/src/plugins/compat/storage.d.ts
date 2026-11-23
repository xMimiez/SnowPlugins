export interface CompatibilityStorageBackend {
    /** setItem synchronously queues writes in call order when this is true. */
    serializesWrites?: true;
    getItem(name: string): Promise<string | null>;
    setItem(name: string, value: string): Promise<void>;
}
export interface CompatibilityStorage<T extends Record<string, unknown> = Record<string, unknown>> {
    proxy: T;
    flush(): Promise<void>;
    owns(value: unknown): value is object;
    subscribe(listener: () => void): () => void;
    useProxy<U extends object = T>(value?: U): U;
}
export declare function runThenFlushCompatibilityStorage(operation: () => unknown | Promise<unknown>, storage: CompatibilityStorage): Promise<void>;
export declare function createCompatibilityStorage<T extends Record<string, unknown>>(runtimeId: string, initialState: T, backend: CompatibilityStorageBackend): Promise<CompatibilityStorage<T>>;
