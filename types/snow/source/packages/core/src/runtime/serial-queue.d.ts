/** One operation at a time, in call order. A failure does not stall the queue. */
export declare function createSerialQueue(): <T>(operation: () => Promise<T>) => Promise<T>;
