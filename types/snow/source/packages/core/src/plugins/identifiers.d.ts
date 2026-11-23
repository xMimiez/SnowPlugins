export declare const PLUGIN_ID: RegExp;
export declare const SHA256: RegExp;
/** Consumers import a library plugin as `@snow-library/<library plugin ID>`. */
export declare const LIBRARY_PREFIX = "@snow-library/";
export declare function isCorePlugin(id: string): boolean;
