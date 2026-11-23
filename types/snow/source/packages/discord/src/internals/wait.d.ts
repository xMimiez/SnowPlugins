import type { FilterFn, Metro } from "../types";
/** A plain filter returns what the callback receives, or a falsy value when the module does not match. */
export type ModuleFilter<T = any> = {
    (exports: any, id: Metro.ModuleID, defaultCheck: boolean): T | undefined;
    /** Cache key; matches are cached under it so later launches wait on those modules only. */
    key?: string;
};
export interface WaitForOptions {
    /** Matches to deliver before the wait disposes itself. Defaults to 1. */
    count?: number;
}
/** `count` is accepted for compatibility and ignored: the promise settles on the first match. */
export interface WaitForModuleOptions extends WaitForOptions {
    signal?: AbortSignal;
    /** Milliseconds before the promise rejects. No limit by default. */
    timeout?: number;
}
/**
 * Calls back for modules that already loaded, then for each matching module as Discord loads it,
 * with no limit on which modules are covered. With a filter built by `@snow/discord/filters` the
 * callback receives the module's exports (or its default export); with a plain function it
 * receives what the function returned. Calls back after this returns and stops after `count`
 * matches. A throwing filter counts as no match; a throwing callback is logged.
 */
export declare function waitFor<A extends unknown[]>(filter: FilterFn<A>, callback: (exports: any, id: Metro.ModuleID) => void, options?: WaitForOptions): () => void;
export declare function waitFor<T = any>(filter: ModuleFilter<T>, callback: (result: T, id: Metro.ModuleID) => void, options?: WaitForOptions): () => void;
export interface WaitPromiseOptions {
    signal?: AbortSignal;
    /** Milliseconds before the promise rejects. No limit by default. */
    timeout?: number;
}
/** Resolves with the first match. Rejects when the signal aborts or the timeout passes. */
export declare function waitForModule<A extends unknown[]>(filter: FilterFn<A>, options?: WaitForModuleOptions): Promise<any>;
export declare function waitForModule<T = any>(filter: ModuleFilter<T>, options?: WaitForModuleOptions): Promise<T>;
