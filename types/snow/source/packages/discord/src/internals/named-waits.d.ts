export interface FilePathLookup {
    id: number;
    /** False when the module has not loaded; exports is then absent. */
    loaded: boolean;
    exports?: any;
}
/**
 * Finds a module by Discord's source path in constant time, never searching other modules. A path
 * seen on an earlier launch of the same bundle returns its module ID unloaded, or with `initialize`
 * loads that one module and checks it still reports the path.
 */
export declare function lookupFilePath(path: string, { initialize }?: {
    initialize?: boolean;
}): FilePathLookup | undefined;
