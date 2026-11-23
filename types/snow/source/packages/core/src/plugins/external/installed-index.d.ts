import type { ExternalPluginFormat } from "../manifest";
import { type ExternalPluginWaitingSource } from "./waiting-source";
export declare const MAX_EXTERNAL_PLUGINS = 64;
export declare const MAX_PENDING_ARTIFACT_REMOVALS = 256;
export interface ExternalPluginArtifactRecord {
    version: string;
    manifestSha256: string;
    resolvedManifestUrl: string;
    bundleUrl: string;
    resolvedBundleUrl: string;
    sha256: string;
    integritySource: "manifest" | "local-pin";
    bytes: number;
    manifest: Record<string, unknown>;
    /** The URL Snow fetched for this artifact; per-version repository manifests differ per artifact. */
    requestedManifestUrl?: string;
    /**
     * Set only on a waiting update that moves the plugin to another source. It is written onto
     * the plugin when the update's trial succeeds and is dropped with the update.
     */
    source?: ExternalPluginWaitingSource;
}
/** Where a repository install came from. Exactly one of channel and pinned is set. */
export interface ExternalPluginProvenance {
    /** The repository's normalized index URL, its identity in the repository list. */
    repository: string;
    entryId: string;
    channel: string | null;
    pinned: string | null;
    linkedAt: number;
}
export interface ExternalPluginFailure {
    phase: string;
    message: string;
    sha256: string;
    failedAt: number;
}
export interface InstalledExternalPlugin {
    runtimeId: string;
    enabled: boolean;
    format: ExternalPluginFormat;
    originalId: string;
    compatibilityProfile: string | null;
    sourceKey: string;
    manifestUrl: string;
    resolvedManifestUrl: string;
    installedAt: number;
    updatedAt: number;
    current: ExternalPluginArtifactRecord;
    previous: ExternalPluginArtifactRecord | null;
    pending: ExternalPluginArtifactRecord | null;
    lastKnownGood: string | null;
    lastFailure: ExternalPluginFailure | null;
    quarantined: boolean;
    /** Set when the user paused batch and background update checks; missing means allowed. */
    updatesPaused?: boolean;
    /** Missing for URL installs. */
    provenance?: ExternalPluginProvenance;
    /** Installed from files on the device; the source key is then `local/<id>`. Missing means URL. */
    sourceKind?: "local-file";
}
export interface ExternalPluginIndex {
    schemaVersion: 1;
    generation: number;
    plugins: Record<string, InstalledExternalPlugin>;
    pendingArtifactCommits: ExternalPluginArtifactReference[];
    pendingArtifactRemovals: ExternalPluginArtifactReference[];
}
export interface ExternalPluginArtifactReference {
    runtimeId: string;
    sha256: string;
}
export declare function isExternalPluginArtifactReferenced(index: ExternalPluginIndex, reference: ExternalPluginArtifactReference): boolean;
export declare function reconcileExternalPluginArtifactRemovals(previous: ExternalPluginIndex, next: ExternalPluginIndex): ExternalPluginArtifactReference[];
export declare function reconcileExternalPluginArtifactCommits(previous: ExternalPluginIndex, next: ExternalPluginIndex): ExternalPluginArtifactReference[];
export declare function reserveExternalPluginArtifactCommit(index: ExternalPluginIndex, reference: ExternalPluginArtifactReference): ExternalPluginIndex;
export declare function abandonExternalPluginArtifactCommit(index: ExternalPluginIndex, reference: ExternalPluginArtifactReference): ExternalPluginIndex;
export declare function recoverExternalPluginArtifactCommits(index: ExternalPluginIndex): ExternalPluginIndex;
export declare function drainExternalPluginArtifactRemovals(index: ExternalPluginIndex, remove: (reference: ExternalPluginArtifactReference) => Promise<void>): Promise<{
    index: ExternalPluginIndex;
    failures: unknown[];
}>;
export declare function patchInstalledPlugin(index: ExternalPluginIndex, runtimeId: string, patch: Partial<InstalledExternalPlugin>): ExternalPluginIndex;
export declare function recordExternalPluginSuccess(plugin: InstalledExternalPlugin, artifact: ExternalPluginArtifactRecord, promotePending: boolean, updatedAt: number): InstalledExternalPlugin;
type ExternalStartupRecovery = {
    action: "none";
} | {
    action: "clear";
} | {
    action: "disable-all";
    error: string;
} | {
    action: "recover";
    disable: boolean;
    discardPending: boolean;
    failure: ExternalPluginFailure;
    runtimeId: string;
};
export declare const emptyExternalPluginIndex: () => ExternalPluginIndex;
export declare function createPluginStartupMarker(plugin: InstalledExternalPlugin, artifact: ExternalPluginArtifactRecord, mode: "current" | "update", phase: "evaluate" | "health" | "start", launchId: string): Record<string, unknown>;
export declare function parseExternalPluginIndex(value: unknown): ExternalPluginIndex;
export declare function planExternalStartupRecovery(index: ExternalPluginIndex, value: unknown, failedAt: number): ExternalStartupRecovery;
export {};
