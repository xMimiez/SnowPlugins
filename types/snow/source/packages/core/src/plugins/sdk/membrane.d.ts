interface Membrane {
    /** The consumer's view of a library value. */
    wrap<T>(value: T): T;
    /** Ends the pair: the consumer's views throw, and library calls into the consumer do nothing. */
    revoke(): void;
}
/**
 * Wraps what a library hands one consumer so references fail loudly once the pair ends.
 * Property values, descriptors, prototypes, return values, and promise results are all
 * wrapped. Wrappers are cached per original, so identity stays stable within the pair.
 */
export declare function createMembrane(libraryName: string, log: (message: string) => void): Membrane;
export {};
