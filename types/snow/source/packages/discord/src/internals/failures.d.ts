/** Module factories that threw during this launch. Never persisted. */
export interface ModuleFailure {
    id: number;
    /** Discord's source path, when its import tracker reported one before the throw. */
    filePath?: string;
    message: string;
    stack: string;
    /** Milliseconds since Snow's module system started. */
    at: number;
    /** True when Snow or a plugin initialized the module speculatively through requireModule. */
    speculative: boolean;
}
/** This launch's module factory failures, oldest first, and how many were not kept. */
export declare function getModuleFailures(): {
    failures: ModuleFailure[];
    dropped: number;
};
