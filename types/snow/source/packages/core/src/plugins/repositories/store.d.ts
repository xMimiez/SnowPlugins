import type { ParsedRepositoryIndex } from "./index-format";
export declare const REPOSITORIES_FILE = "plugins/repositories.json";
export declare const MAX_REPOSITORIES = 16;
interface StoredRepository {
    /** The normalized index URL; the repository's identity. */
    url: string;
    enabled: boolean;
    addedAt: number;
}
/** The host the user saw on the trust sheet; a different serving host needs a new confirmation. */
interface TrustRecord {
    host: string;
    confirmedAt: number;
}
export interface RepositoryStatus {
    lastAttemptAt?: number;
    lastSuccessAt?: number;
    lastError?: string;
    /** Consecutive failed refreshes; drives the automatic refresh backoff. */
    failures: number;
    finalUrl?: string;
    /** When an automatic refresh last skipped Low Data Mode or a non-Wi-Fi network. */
    skippedAt?: number;
    skippedReason?: string;
}
/** Display-only provenance for themes and fonts, keyed by `<kind> <manifest URL>`. */
interface AddonSource {
    repository: string;
    entryId: string;
}
type BrowseKind = "plugin" | "theme" | "font";
interface PersistedRepositories {
    repositories: StoredRepository[];
    trust: Record<string, TrustRecord>;
    status: Record<string, RepositoryStatus>;
    /** Cache folders written so far, so stale ones can be deleted without listing directories. */
    cacheKeys: string[];
    lastBackgroundCheckAt?: number;
    addonSources: Record<string, AddonSource>;
    turnOnAfterInstall: boolean;
    browseSort: Partial<Record<BrowseKind, string>>;
}
export interface CachedRepository extends ParsedRepositoryIndex {
    finalUrl: string;
    fetchedAt: number;
    /** Validators for the next conditional request. */
    etag?: string;
    lastModified?: string;
}
export interface RepositoriesState extends PersistedRepositories {
    loaded: boolean;
    /** Set when the list file could not be read and was reset; the page warns once. */
    listReset: boolean;
    indexes: Record<string, CachedRepository>;
    refreshing: Record<string, boolean>;
}
export declare const useRepositories: import("zustand").UseBoundStore<import("zustand").StoreApi<RepositoriesState>>;
/** Trims and checks the URL, then appends repository.json unless it already names a JSON file. */
export declare function normalizeRepositoryURL(value: string): string;
export declare function updateRepositories(update: (state: RepositoriesState) => Partial<RepositoriesState>): Promise<void>;
/**
 * Reads the list once. A damaged file is kept as repositories.invalid.json, whatever still reads
 * is kept, and the recovered list is saved so the warning shows only this once.
 */
export declare function loadRepositoryList(): Promise<void>;
export declare const repositoryHost: (url: string) => string;
type RepositoryState = "on" | "off" | "untrusted" | "host-changed";
/**
 * A repository is used only while it is on and the user confirmed the host serving it. Restored
 * repositories have no confirmation yet; a changed host needs a new one.
 */
export declare function repositoryState(url: string, state?: Pick<RepositoriesState, "repositories" | "trust" | "status">): RepositoryState;
/** Turned-on, confirmed repositories in priority order. */
export declare function activeRepositories(state?: Pick<RepositoriesState, "repositories" | "trust" | "status">): StoredRepository[];
export {};
