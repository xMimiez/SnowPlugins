import type { PluginSetting, PluginSettingsStorage } from "./types";
export declare const PLUGIN_SETTINGS_FILE = "plugins/settings.json";
/** Keys set to undefined are removed. */
type PluginSettingPatch = {
    [K in keyof PluginSetting]?: PluginSetting[K] | undefined;
};
interface PluginSettingsStore {
    settings: PluginSettingsStorage;
    _hasHydrated: boolean;
    /** Turning a plugin off also drops its enabled-by-dependency marker. */
    updatePluginSetting: (id: string, enabled: boolean) => void;
    patchPluginSetting: (id: string, patch: PluginSettingPatch) => void;
    removePluginSetting: (id: string) => void;
    setHasHydrated: (state: boolean) => void;
}
export declare const usePluginSettings: import("zustand").UseBoundStore<Omit<import("zustand").StoreApi<PluginSettingsStore>, "persist" | "setState"> & {
    setState(partial: Partial<PluginSettingsStore> | PluginSettingsStore | ((state: PluginSettingsStore) => Partial<PluginSettingsStore> | PluginSettingsStore), replace?: false | undefined): unknown;
    setState(state: PluginSettingsStore | ((state: PluginSettingsStore) => PluginSettingsStore), replace: true): unknown;
    persist: {
        setOptions: (options: Partial<import("zustand/middleware").PersistOptions<PluginSettingsStore, {
            settings: PluginSettingsStorage;
        }, unknown>>) => void;
        clearStorage: () => void;
        rehydrate: () => Promise<void> | void;
        hasHydrated: () => boolean;
        onHydrate: (fn: (state: PluginSettingsStore) => void) => () => void;
        onFinishHydration: (fn: (state: PluginSettingsStore) => void) => () => void;
        getOptions: () => Partial<import("zustand/middleware").PersistOptions<PluginSettingsStore, {
            settings: PluginSettingsStorage;
        }, unknown>>;
    };
}>;
export declare const pluginSettings: PluginSettingsStorage;
/** A profile running for this launch only: these flags apply instead of the saved ones. */
export declare function setLaunchEnabledOverride(override: ReadonlyMap<string, boolean>): void;
export declare const hasLaunchEnabledOverride: () => boolean;
/** The saved setting, or this launch's profile, not whether the plugin is running. */
export declare function isPluginEnabled(id: string): boolean;
export {};
