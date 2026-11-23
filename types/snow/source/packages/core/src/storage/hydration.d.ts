export interface HydratableStore {
    getState(): unknown;
    subscribe?(listener: () => void): () => void;
    persist?: {
        hasHydrated?(): boolean;
        onFinishHydration?(callback: () => void): () => void;
    };
}
export declare function isStoreHydrated(store: HydratableStore): boolean;
/** Returns false on timeout. Does not start or retry hydration. */
export declare function waitForHydration(store: HydratableStore, timeoutMs?: number): Promise<boolean>;
