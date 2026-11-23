/** Rejects absolute paths, empty segments, and . or .. segments instead of normalizing them. */
export declare function assertSafeSnowPath(path: string): string;
export declare const resolveSnowPath: (path: string) => string;
