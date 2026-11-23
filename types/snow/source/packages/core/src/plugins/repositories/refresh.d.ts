import { type FetchedIndex } from "./cache";
import { type ParsedRepositoryIndex } from "./index-format";
/** Opening Browse refreshes repositories whose last success is older than this. */
export declare const BROWSE_REFRESH_MS: number;
export declare const BACKGROUND_REFRESH_MS: number;
/** Manual refreshes contact the server unconditionally of backoff; background ones skip Low Data Mode. */
type RefreshMode = "manual" | "browse" | "background";
export interface RepositoryPreview extends ParsedRepositoryIndex {
    fetched: FetchedIndex;
}
/** The URL serves JSON without an `addons` list; the add flow checks whether it is an add-on. */
export declare class NotARepositoryError extends Error {
    readonly json: Record<string, unknown>;
    constructor(json: Record<string, unknown>);
}
/** Loads the list and every cached index once, and deletes caches of removed repositories. */
export declare function initRepositories(): Promise<void>;
/** Fetches and parses an index without saving anything, for the add flow and its trust sheet. */
export declare function previewRepository(url: string): Promise<RepositoryPreview>;
/** Saves a fetched index as the repository's cache and its in-memory copy. */
export declare function storeFetchedIndex(url: string, fetched: FetchedIndex, parsed: ParsedRepositoryIndex): Promise<void>;
/** At most one fetch per repository at a time; a second request joins the first. */
export declare function refreshRepository(url: string, mode: RefreshMode): Promise<void>;
/**
 * Refreshes turned-on repositories: manual ones always, automatic ones when older than maxAge and
 * not backed off. Resolves with how many succeeded and failed.
 */
export declare function refreshRepositories(mode: RefreshMode, maxAge?: number): Promise<{
    updated: number;
    failed: number;
}>;
export {};
