export { resolveSnowPath } from "./path";
export interface DownloadResult {
    bytes: number;
    resolvedUrl: string;
}
export declare function clearFolder(path: string): Promise<undefined>;
export declare function removeFile(path: string): Promise<undefined>;
export declare function removeCacheFile(path: string): Promise<undefined>;
export declare function fileExists(path: string): Promise<boolean>;
export declare function writeFile(path: string, data: string): Promise<void>;
/** Relative to Documents/snow. A missing file rejects. The original error is kept in cause. */
export declare function readFile(path: string, { encoding }?: {
    encoding?: "utf8" | "base64";
}): Promise<string>;
/**
 * Relative to Documents/snow. The native side stages the file and replaces the
 * destination atomically. Pass validation: "sfnt" for fonts.
 */
export declare function downloadFile(url: string, path: string, { maxBytes, timeout, validation, signal, }?: {
    maxBytes?: number;
    timeout?: number;
    validation?: "none" | "sfnt";
    signal?: AbortSignal;
}): Promise<DownloadResult>;
