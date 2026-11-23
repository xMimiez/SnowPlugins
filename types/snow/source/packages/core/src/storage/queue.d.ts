/** Holds new writes while a snapshot is read. Do not enqueue storage work inside the callback. */
export declare function withFileSnapshot<T>(read: () => T | Promise<T>, includesPath?: (path: string) => boolean): Promise<T>;
/** Mutations on the same path run in call order. A failure does not block later ones. */
export declare function runFileMutation(filePath: string, mutation: () => Promise<void>): Promise<void>;
/** Waits for queued mutations without rethrowing their failures. */
export declare function waitForFileMutations(filePath: string): Promise<void>;
