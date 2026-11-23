/** The module that reported this path during this launch. */
export declare const getRecordedPathModule: (path: string) => number | undefined;
/** The module that reported this path on an earlier launch of the same bundle. */
export declare const getCachedPathModule: (path: string) => number | undefined;
/** Number of paths recorded this launch. */
export declare const getRecordedPathCount: () => number;
