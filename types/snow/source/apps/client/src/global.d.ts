import type { Metro } from "@snow-internal/discord/types";
import type { SnowNativeBridge } from "@snow-internal/native/bridge";
import type { SnowLoaderIdentity } from "@snow-internal/native/loader";
import type { PluginDefinition } from "@snow-internal/core/plugins/types";

interface BatchedBridge {
    __callFunction(...args: unknown[]): unknown;
    callFunctionReturnFlushedQueue(module: string, method: string, args: unknown[]): unknown;
    flushedQueue(): unknown;
    getCallableModule(name: string): unknown;
}

interface ReactDevToolsPreload {
    exports: unknown;
    version?: string;
}

declare global {
    const __SNOW_DEVTOOLS__: boolean;
    type React = typeof import("react");

    var globalEvalWithSourceUrl: ((script: string, sourceURL: string) => unknown) | undefined;
    var nativeModuleProxy: Record<string, unknown>;
    var __turboModuleProxy: (name: string) => unknown;

    interface Window {
        HermesInternal: {
            getFunctionLocation(value: unknown): { fileName: string; lineNumber?: number };
            getRuntimeProperties(): Record<string, boolean | number | string>;
        };
        Object: ObjectConstructor;
        React: typeof import("react");
        ReactNative: typeof import("react-native");
        RN$AppRegistry?: { runApplication(...args: unknown[]): unknown };
        __REACT_DEVTOOLS__?: ReactDevToolsPreload;
        SnowLoader?: SnowLoaderIdentity;
        SnowNative?: SnowNativeBridge;
        "__core-js_shared__"?: { inspectSource?: (value: unknown) => string | false };
        __c: Metro.ClearFn;
        __d: Metro.DefineFn;
        __fbBatchedBridge?: BatchedBridge;
        __r: Metro.RequireFn;
        __snow_rdt?: unknown;
        __snowRegisterPlugin?: (plugin: PluginDefinition) => void;
        modules: Metro.ModuleList;
        nativeModuleProxy: Record<string, unknown>;
        snow?: typeof import("@snow-internal/api/lib");
    }
}

export {};
