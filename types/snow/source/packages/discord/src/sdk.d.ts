import { type PluginScope } from "@snow-internal/api/scope";
import { type ModuleFilter, type WaitForModuleOptions, type WaitForOptions, type WaitPromiseOptions } from "./internals/wait";
import type { FilterFn } from "./types";
type Filter = FilterFn<any[]> | ModuleFilter;
/**
 * Waits that stop with the plugin: each registration joins the plugin's scope, callbacks stop
 * once it stops, failures are attributed to it, and promises reject when its signal aborts.
 */
export declare function createDiscordBindings(context: PluginScope): {
    finders: {
        waitFor(filter: Filter, callback: (result: any, id: number) => void, options?: WaitForOptions): () => void;
        waitForModule(filter: Filter, { signal, timeout }?: WaitForModuleOptions): Promise<any>;
    };
    wrappers: {
        waitForStore(name: string, callback: (store: any) => void): () => void;
        findByStoreNameAsync(name: string, options?: WaitPromiseOptions): Promise<unknown>;
        waitForFilePath(path: string, callback: (exports: any, id: number) => void): () => void;
        findByFilePathAsync(path: string, options?: WaitPromiseOptions): Promise<unknown>;
    };
};
export {};
