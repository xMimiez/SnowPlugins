type InspectorAvailability = "available" | "unavailable" | "unknown";
interface Evidence {
    reason: string;
    status: InspectorAvailability;
}
interface RendererEvidence {
    bundleType: number | string | null;
    capabilities: {
        findFiberByHostInstance: boolean;
        findHostInstanceByFiber: boolean;
        getCurrentFiber: boolean;
    };
    id: number | string;
    packageName: string | null;
    version: string | null;
}
interface ReactHookEvidence extends Evidence {
    getFiberRoots: boolean;
    ownProperty: boolean;
    rendererCount: number | null;
    rendererStatus: InspectorAvailability;
    renderers: RendererEvidence[];
}
interface ReactPreloadEvidence extends Evidence {
    ownProperty: boolean;
    version: string | null;
}
interface BootstrapEvidence {
    capturedBeforeSnowBundle: boolean;
    reactDevToolsGlobalHookPresent: boolean | null;
    reactDevToolsPreloadPresent: boolean | null;
    reactGlobalPresent: boolean | null;
    reactNativeGlobalPresent: boolean | null;
    status: "available" | "unavailable";
}
interface InspectorCapabilityReport {
    schemaVersion: 1;
    observedAt: string;
    reactInspector: Evidence & {
        available: boolean;
        bootstrap: BootstrapEvidence;
        globalHook: ReactHookEvidence;
        preload: ReactPreloadEvidence;
    };
    nativeInspector: Evidence & {
        bridgeCapabilityAdvertised: boolean;
        lastProbe: NativeInspectorProbeEvidence | null;
    };
    metro: {
        forceLoad: false;
        initializedOnlySearch: true;
    };
    patches: {
        active: number;
        inventory: true;
    };
}
export interface NativeInspectorProbeEvidence extends Evidence {
    observedAt: string;
    operation: "accessibility" | "hitTest" | "windows";
}
interface InspectorCapabilityInput {
    activePatchCount: number;
    globalObject: object;
    nativeInspectorProbe?: NativeInspectorProbeEvidence | null;
    observedAt?: Date;
}
export declare function collectInspectorCapabilities(input: InspectorCapabilityInput): InspectorCapabilityReport;
export {};
