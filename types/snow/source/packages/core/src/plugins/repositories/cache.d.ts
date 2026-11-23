import { type CachedRepository } from "./store";
export interface FetchedIndex {
    text: string;
    finalUrl: string;
    sha256: string;
    etag?: string;
    lastModified?: string;
}
export declare const cacheKeyOf: (url: string) => Promise<string>;
export declare function deleteCacheFolder(key: string): Promise<void>;
/**
 * Reads the cached index. A hash that does not match the metadata, or an index the current parser
 * rejects, keeps one copy as index.invalid.json and drops the cache, so the next refresh is
 * unconditional. Damaged metadata is kept the same way by the validated storage.
 */
export declare function readCache(url: string): Promise<CachedRepository | undefined>;
/** Writes the raw index first and the metadata second, so a torn write fails the hash check. */
export declare function writeCache(url: string, fetched: FetchedIndex, fetchedAt: number): Promise<void>;
/** Deletes cache folders whose repository is no longer in the list. */
export declare function deleteStaleCaches(): Promise<void>;
