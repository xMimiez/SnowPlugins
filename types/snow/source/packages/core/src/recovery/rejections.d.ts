/**
 * Turns on Hermes's own rejection tracker, which React Native enables only in development. Call
 * once timers exist: the tracker sets one per rejection. Without the public hook, nothing is
 * tracked; Snow never falls back to private fields of Hermes's Promise.
 */
export declare function trackUnhandledRejections(): void;
export declare function getRejectionSnapshot(): {
    tracked: boolean;
    count: number;
    distinct: number;
    uncounted: number;
    lastAt: number | null;
    recent: {
        /** Counts distinct rejections this launch; a late-handled note refers back to it. */
        number: number;
        owner: string;
        name: string;
        message: string;
        count: number;
        handledLate: boolean;
    }[];
};
