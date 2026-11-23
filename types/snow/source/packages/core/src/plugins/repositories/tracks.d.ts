import type { RepositoryPlugin, RepositoryRelease } from "./index-format";
export declare const CHANNEL_NAME: RegExp;
export declare const STABLE = "stable";
export declare const PRERELEASE = "prerelease";
/** Exactly one is set: a followed channel, or a pinned version that is never updated. */
export interface Track {
    channel: string | null;
    pinned: string | null;
}
interface TrackTarget {
    /** Undefined only when a pinned version is no longer offered. */
    release?: RepositoryRelease;
    /** Set when the followed channel is gone and another target stands in for it. */
    fallback?: "stable" | "newest";
}
/**
 * Stable when the entry has it, then prerelease. An entry without channels follows stable,
 * which resolves to its newest release.
 */
export declare function defaultTrack(entry: RepositoryPlugin): Track;
/** Resolves a track to the release it installs or updates to. */
export declare function resolveTrack(entry: RepositoryPlugin, track: Track): TrackTarget;
export {};
