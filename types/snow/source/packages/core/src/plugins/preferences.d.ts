import { type StoredPluginPreferences } from "./stored-shapes";
interface PluginPreferences extends StoredPluginPreferences {
    updatePluginPreferences: (preferences: Partial<StoredPluginPreferences>) => void;
}
export declare const usePluginPreferences: import("zustand").UseBoundStore<Omit<import("zustand").StoreApi<PluginPreferences>, "persist" | "setState"> & {
    setState(partial: Partial<PluginPreferences> | PluginPreferences | ((state: PluginPreferences) => Partial<PluginPreferences> | PluginPreferences), replace?: false | undefined): unknown;
    setState(state: PluginPreferences | ((state: PluginPreferences) => PluginPreferences), replace: true): unknown;
    persist: {
        setOptions: (options: Partial<import("zustand/middleware").PersistOptions<PluginPreferences, {
            backgroundUpdateChecks: boolean;
            updateChecksOnWifiOnly: boolean;
            disableFailedPlugins: boolean;
            reportedIncompatible: string[];
        }, unknown>>) => void;
        clearStorage: () => void;
        rehydrate: () => Promise<void> | void;
        hasHydrated: () => boolean;
        onHydrate: (fn: (state: PluginPreferences) => void) => () => void;
        onFinishHydration: (fn: (state: PluginPreferences) => void) => () => void;
        getOptions: () => Partial<import("zustand/middleware").PersistOptions<PluginPreferences, {
            backgroundUpdateChecks: boolean;
            updateChecksOnWifiOnly: boolean;
            disableFailedPlugins: boolean;
            reportedIncompatible: string[];
        }, unknown>>;
    };
}>;
export {};
