export interface Settings {
    debuggerUrl: string;
    devToolsUrl: string;
    hotReloadThemeUrl: string;
    developerSettings: boolean;
    autoDebugger: boolean;
    autoDevTools: boolean;
    hotReloadTheme: boolean;
    safeMode: boolean;
    settingsPosition: string;
    disableUpdateWarnings: boolean;
    pluginCard: {
        showInfoButton: boolean;
        openOnPress: boolean;
    };
    compactMode: boolean;
    assetBrowser: {
        enabledFilters: Record<string, boolean>;
    };
    pinnedPlugins: string[];
    experimentsConfirmed: boolean;
    /** Native reads this at launch: three failed foreground launches in a row start one safe launch. */
    failedLaunchRecovery: boolean;
    /** Read at launch by native and JavaScript: report stalled and hung startups. */
    startupWatchdog: boolean;
    /** Unset means the build's default: on in development builds, off in production. */
    logUnhandledRejections?: boolean;
    toastUnhandledRejections: boolean;
    /** Read at launch: add Snow's startup stages to Discord's own startup log. */
    markDiscordStartup: boolean;
}
export interface LoaderConfig {
    customLoadUrl: {
        enabled: boolean;
        url: string;
    };
    loadReactDevTools: boolean;
}
interface SettingsStore extends Settings {
    /** The saved safe mode switch; `safeMode` is also true during a one-time safe launch. */
    savedSafeMode: boolean;
    updateSettings: (settings: Partial<Settings>) => void;
    togglePinnedPlugin: (id: string) => void;
}
export declare const useSettings: import("zustand").UseBoundStore<Omit<import("zustand").StoreApi<SettingsStore>, "persist" | "setState"> & {
    setState(partial: Partial<SettingsStore> | SettingsStore | ((state: SettingsStore) => Partial<SettingsStore> | SettingsStore), replace?: false | undefined): unknown;
    setState(state: SettingsStore | ((state: SettingsStore) => SettingsStore), replace: true): unknown;
    persist: {
        setOptions: (options: Partial<import("zustand/middleware").PersistOptions<SettingsStore, unknown, unknown>>) => void;
        clearStorage: () => void;
        rehydrate: () => Promise<void> | void;
        hasHydrated: () => boolean;
        onHydrate: (fn: (state: SettingsStore) => void) => () => void;
        onFinishHydration: (fn: (state: SettingsStore) => void) => () => void;
        getOptions: () => Partial<import("zustand/middleware").PersistOptions<SettingsStore, unknown, unknown>>;
    };
}>;
interface LoaderConfigStore extends LoaderConfig {
    updateLoaderConfig: (config: Partial<LoaderConfig>) => void;
}
export declare const useLoaderConfig: import("zustand").UseBoundStore<Omit<import("zustand").StoreApi<LoaderConfigStore>, "persist" | "setState"> & {
    setState(partial: LoaderConfigStore | Partial<LoaderConfigStore> | ((state: LoaderConfigStore) => LoaderConfigStore | Partial<LoaderConfigStore>), replace?: false | undefined): unknown;
    setState(state: LoaderConfigStore | ((state: LoaderConfigStore) => LoaderConfigStore), replace: true): unknown;
    persist: {
        setOptions: (options: Partial<import("zustand/middleware").PersistOptions<LoaderConfigStore, unknown, unknown>>) => void;
        clearStorage: () => void;
        rehydrate: () => Promise<void> | void;
        hasHydrated: () => boolean;
        onHydrate: (fn: (state: LoaderConfigStore) => void) => () => void;
        onFinishHydration: (fn: (state: LoaderConfigStore) => void) => () => void;
        getOptions: () => Partial<import("zustand/middleware").PersistOptions<LoaderConfigStore, unknown, unknown>>;
    };
}>;
/** Resolves once every queued write of the settings file has finished. */
export declare const settingsWritten: () => Promise<void>;
export declare const settings: () => SettingsStore;
export declare const loaderConfig: () => LoaderConfigStore;
export declare const useAssetBrowserSettings: () => {
    enabledFilters: Record<string, boolean>;
    updateSettings: (newSettings: {
        enabledFilters?: Record<string, boolean>;
    }) => void;
};
export {};
