import { type PlatformConstants } from "react-native";
export interface RNConstants extends PlatformConstants {
    Version: number;
    Release: string;
    Serial: string;
    Fingerprint: string;
    Model: string;
    Brand: string;
    Manufacturer: string;
    ServerHost?: string;
    forceTouchAvailable: boolean;
    interfaceIdiom: string;
    osVersion: string;
    systemName: string;
}
export declare function connectToDebugger(pairingUrl: string): void;
export declare function disconnectFromDebugger(): void;
export declare function isConnectedToDebugger(): boolean;
export declare function disconnectRdt(): void;
export declare function useIsRdtConnected(): boolean;
export declare function getDebugInfo(): {
    snow: {
        version: string;
        loader: {
            name: string;
            version: string | null;
        };
    };
    discord: {
        version: string;
        build: string;
    };
    react: {
        source: "React.version";
        version: string;
        nativeVersion: string;
    };
    reactNative: {
        source: "Platform.constants.reactNativeVersion";
        version: string;
    };
    hermes: {
        buildType: import("./environment").RuntimeProperty | null;
        bytecodeVersion: import("./environment").RuntimeProperty | null;
        releaseVersion: string;
        source: "HermesInternal.getRuntimeProperties";
        targetReactNativeVersion: string | null;
        version: string;
    };
    os: {
        name: string;
        version: string;
        sdk?: number;
    };
    device: {
        manufacturer: any;
        brand: any;
        model: any;
        codename: any;
    };
};
export declare function hotReloadTheme(): void;
export declare function initDebugger(): void;
