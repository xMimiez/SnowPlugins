export interface ThemeInfo {
    data: unknown;
    id: string;
    selected: boolean;
}
export interface SnowLoaderIdentity {
    bootstrapEvidence?: SnowBootstrapEvidence;
    bridgeVersion: number;
    bundleBytecodeVersion: number;
    capabilities: {
        appleMusic: boolean;
        bundleUpdates: boolean;
        officialUpdates?: boolean;
        settingsBackups?: number;
        settingsReset?: boolean;
        chatBubbles: boolean;
        fonts: boolean;
        nativeInspector: boolean;
        systemColors: boolean;
        themes: boolean;
    };
    name: string;
    storedTheme: ThemeInfo | null;
    sysColors?: unknown;
    version: string;
    bundleState?: NativeBundleState;
}
interface SnowBootstrapEvidence {
    capturedBeforeSnowBundle: true;
    reactDevToolsGlobalHookPresent: boolean;
    reactDevToolsPreloadPresent: boolean;
    reactGlobalPresent: boolean;
    reactNativeGlobalPresent: boolean;
}
export interface NativeBundleState {
    currentBuildId?: string;
    lastSuccessfulBuildId?: string;
    previousBuildId?: string;
    consecutiveFailures?: number;
    recoveryReason?: string;
    lastRecoveryReason?: string;
    sha256?: string;
    stagedAt?: number;
}
interface ReactDevToolsClient {
    connectToDevTools(options: Record<string, unknown>): unknown;
}
export declare const getLoaderIdentity: () => SnowLoaderIdentity | null;
export declare const getLoaderName: () => string;
export declare const getLoaderVersion: () => string | null;
export declare const isLoaderConfigSupported: () => boolean;
export declare const getThemeFilePath: () => string | null;
export declare const isReactDevToolsPreloaded: () => boolean;
export declare function getReactDevTools(): ReactDevToolsClient | null;
export declare const getSysColors: () => unknown;
export declare const getStoredTheme: () => ThemeInfo | null;
export declare const isChatBubblesSupported: () => boolean;
export declare const isSysColorsSupported: () => boolean;
export declare const getLoaderConfigPath: () => string;
export {};
