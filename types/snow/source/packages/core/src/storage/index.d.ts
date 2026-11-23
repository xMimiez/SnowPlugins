export { isStoreHydrated, waitForHydration } from "./hydration";
/**
 * One file under Documents/snow holds every item, so item names are ignored.
 * Reads wait for queued writes and reject on error. Failed writes and removals
 * are logged, not rejected.
 */
export declare const createFileStorage: (filePath: string) => {
    getItem: (_name: string) => Promise<string | null>;
    setItem: (_name: string, value: string) => Promise<void>;
    removeItem: (_name: string) => Promise<void>;
};
/**
 * Stores Zustand state without its version wrapper. Reads accept both formats
 * and return null for missing or invalid JSON. Failed writes and removals are
 * logged, not rejected.
 */
export declare const createFlattenedFileStorage: <T>(filePath: string) => {
    getItem: (_name: string) => Promise<string | null>;
    setItem: (_name: string, value: string) => Promise<void>;
    removeItem: () => Promise<void>;
};
export type PluginStore<T> = T & {
    updateSettings: (settings: Partial<T>) => void;
    _hasHydrated: boolean;
    setHasHydrated: (state: boolean) => void;
};
/**
 * Await waitForHydration(useStore) before changing anything that depends on
 * saved settings. Mutating a nested object directly is not persisted.
 */
export declare function createPluginStore<T extends object>(pluginName: string, initialState: T): {
    useStore: import("zustand").UseBoundStore<Omit<import("zustand").StoreApi<PluginStore<T>>, "persist" | "setState"> & {
        setState(partial: Partial<PluginStore<T>> | ((state: PluginStore<T>) => Partial<PluginStore<T>> | PluginStore<T>) | PluginStore<T>, replace?: false | undefined): unknown;
        setState(state: ((state: PluginStore<T>) => PluginStore<T>) | PluginStore<T>, replace: true): unknown;
        persist: {
            setOptions: (options: Partial<import("zustand/middleware").PersistOptions<PluginStore<T>, unknown, unknown>>) => void;
            clearStorage: () => void;
            rehydrate: () => Promise<void> | void;
            hasHydrated: () => boolean;
            onHydrate: (fn: (state: PluginStore<T>) => void) => () => void;
            onFinishHydration: (fn: (state: PluginStore<T>) => void) => () => void;
            getOptions: () => Partial<import("zustand/middleware").PersistOptions<PluginStore<T>, unknown, unknown>>;
        };
    }>;
    settings: T;
};
