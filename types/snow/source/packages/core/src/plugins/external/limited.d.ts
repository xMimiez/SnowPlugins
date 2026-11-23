/** Runs `work` on each item, at most `limit` at a time, and starts none once `signal` aborts. */
export declare function eachLimited<T>(items: readonly T[], limit: number, work: (item: T) => Promise<void>, signal: AbortSignal): Promise<void>;
