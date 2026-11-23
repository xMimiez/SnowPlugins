/** Named priorities. Any finite number works; higher runs first in every phase. */
export declare const PatchPriority: {
    readonly EARLIEST: 1000;
    readonly EARLY: 500;
    readonly DEFAULT: 0;
    readonly LATE: -500;
    readonly LATEST: -1000;
};
export interface PatchOptions {
    /** Defaults to 0. Equal priorities keep registration order; the newest instead hook is outermost. */
    priority?: number;
    /** Remove the hook after its first call. */
    once?: boolean;
}
type Unpatcher = () => boolean;
type HookKind = "after" | "before" | "instead";
export interface ActivePatch {
    id: number;
    method: string;
    kind: HookKind;
    delayed: boolean;
    priority: number;
}
export declare function getActivePatches(): ActivePatch[];
/**
 * Unpatching before a deferred target resolves cancels the pending patch.
 * Callbacks run synchronously. If the method returns a promise, after gets the promise.
 */
export interface PatchFn<Callback> {
    (func: string, parent: any, callback: Callback, options?: boolean | PatchOptions): Unpatcher;
    await(func: string, parent: Promise<unknown>, callback: Callback, options?: boolean | PatchOptions): Unpatcher;
}
type BeforeFn = PatchFn<(args: any[]) => unknown>;
type InsteadFn = PatchFn<(args: any[], origFunc: Function) => unknown>;
type AfterFn = PatchFn<(args: any[], ret: any) => unknown>;
/**
 * Return a replacement result, or null/undefined to keep the current result. A throwing hook is
 * logged and skipped.
 */
export declare const after: AfterFn;
/**
 * Mutate the argument array in place or return a new array to replace it. A throwing hook is
 * logged and skipped with the arguments it received.
 */
export declare const before: BeforeFn;
/**
 * Return origFunc(...args) to fall through to lower-priority patches and the original. Errors
 * reach the caller: an instead hook owns the call, so Snow cannot safely retry or skip it.
 */
export declare const instead: InsteadFn;
export {};
