export type RuntimeProperty = boolean | number | string;
export interface ReactNativeVersionParts {
    major: number;
    minor: number;
    patch: number;
    prerelease?: string | null;
}
export interface RuntimeVersionInput {
    hermesProperties: Readonly<Record<string, RuntimeProperty>>;
    reactNativeVersion: ReactNativeVersionParts;
    reactVersion: string;
}
export interface RuntimeVersionEvidence {
    react: {
        source: "React.version";
        version: string;
    };
    reactNative: {
        source: "Platform.constants.reactNativeVersion";
        version: string;
    };
    hermes: {
        buildType: RuntimeProperty | null;
        bytecodeVersion: RuntimeProperty | null;
        releaseVersion: string;
        source: "HermesInternal.getRuntimeProperties";
        targetReactNativeVersion: string | null;
    };
}
export declare function formatReactNativeVersion(version: ReactNativeVersionParts): string;
export declare function parseHermesTargetReactNativeVersion(releaseVersion: string): string | null;
export declare function collectRuntimeVersionEvidence(input: RuntimeVersionInput): RuntimeVersionEvidence;
