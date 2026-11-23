interface LifecycleTimeoutOptions<T> {
    signal?: AbortSignal;
    onLateResult?: (value: T) => unknown;
    onTimeout?: (error: Error) => unknown;
}
/** True for the error withLifecycleTimeout rejects with when a phase runs out of time. */
export declare const isLifecycleTimeout: (error: unknown) => boolean;
export declare function withLifecycleTimeout<T>(value: T | Promise<T>, phase: string, options?: LifecycleTimeoutOptions<T>, timeoutMs?: number): Promise<T>;
export {};
