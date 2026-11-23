import { type PluginManifestAuthor } from "../manifest-fields";
export declare const MAX_INDEX_BYTES: number;
interface PinnedManifest {
    url: string;
    sha256: string;
    bytes: number;
}
export interface RepositoryRelease {
    version: string;
    manifest: PinnedManifest;
    bundleBytes: number;
    /** Required dependency IDs, as the manifest declares them. */
    dependencies: string[];
    /** Declared ranges for required dependencies; a missing ID accepts any version. */
    ranges: Record<string, string>;
    /** Epoch milliseconds. */
    publishedAt?: number;
}
interface EntryFields {
    id: string;
    name: string;
    description: string;
    authors: PluginManifestAuthor[];
    icon?: string;
    tags: string[];
}
export interface RepositoryPlugin extends EntryFields {
    kind: "plugin";
    license: string;
    source: string;
    /** Newest first. */
    releases: RepositoryRelease[];
    channels: Record<string, string>;
}
export interface RepositoryDataEntry extends EntryFields {
    kind: "theme" | "font";
    /** The canonical, updatable URL Snow's theme and font installers use. */
    manifest: PinnedManifest;
    version?: string;
}
export type RepositoryEntry = RepositoryPlugin | RepositoryDataEntry;
export interface RepositoryDocument {
    name: string;
    description: string;
    homepage?: string;
    icon?: string;
    generatedAt?: string;
    entries: RepositoryEntry[];
}
export interface SkippedEntry {
    /** The entry, release, or channel, for example `plugin example.p release 1.2.0`. */
    id: string;
    reason: string;
}
export interface ParsedRepositoryIndex {
    document: RepositoryDocument;
    skipped: SkippedEntry[];
}
/**
 * Parses a repository index fetched from finalUrl. A document Snow cannot use throws; invalid
 * entries, releases, and channels are dropped and listed in skipped, and the rest is kept.
 */
export declare function parseRepositoryIndex(value: unknown, finalUrl: string): ParsedRepositoryIndex;
export {};
