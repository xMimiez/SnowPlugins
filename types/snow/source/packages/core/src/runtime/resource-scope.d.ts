import { type NormalizedError } from "./errors";
export type Cleanup = () => unknown;
export declare class ResourceDisposalError extends Error {
    readonly errors: readonly NormalizedError[];
    constructor(errors: readonly NormalizedError[]);
}
export declare class ResourceScope {
    #private;
    constructor(cleanupTimeoutMs?: number);
    get disposed(): boolean;
    get size(): number;
    /**
     * Cleanup runs at most once. Call the returned function to run it early.
     * Adding to a scope that is already disposing runs the cleanup and then throws.
     */
    add(cleanup: Cleanup): Cleanup;
    addTimeout(callback: () => void, delay: number): ReturnType<typeof setTimeout>;
    addInterval(callback: () => void, delay: number): ReturnType<typeof setInterval>;
    /**
     * Cleanups run in reverse order under one shared timeout. All of them are
     * attempted even after a failure. Repeat calls return the same promise, which
     * rejects if anything failed or timed out. A timeout stops waiting but does
     * not cancel the cleanup.
     */
    dispose(): Promise<void>;
}
