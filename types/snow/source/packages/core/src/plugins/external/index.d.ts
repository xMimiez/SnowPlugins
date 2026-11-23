import { assertExternalCandidateCollision } from "./validation";
import { type ParsedExternalPluginManifest } from "../manifest";
import { type ExternalPluginProvenance } from "./installed-index";
import type { NativePluginArtifactDownload } from "@snow-internal/native/bridge";
export { disableExternalPlugin, enableExternalPlugin, installExternalPluginCandidate, removeExternalPluginData, retryExternalPlugin, setExternalPluginUpdatesPaused, startExternalPluginForSession, stopExternalPluginForSession, uninstallExternalPlugin, } from "./commands";
export { disablePluginWithDependents, disableUnneededHelpers, enablePluginWithDependencies, restartPlugins, } from "./dependencies";
export type { ExternalPluginProvenance, InstalledExternalPlugin } from "./installed-index";
export { getExternalRegistrySnapshot, subscribeExternalRegistry } from "./registry";
export { getInstalledExternalPluginManifest } from "./validation";
export interface ExternalPluginCandidate {
    manifest: ParsedExternalPluginManifest;
    manifestSha256: string;
    artifact: NativePluginArtifactDownload;
    /** Recorded with the install or update. Null converts a repository install to a URL install. */
    provenance?: ExternalPluginProvenance | null;
}
export declare function hydrateExternalPlugins(): Promise<void>;
export declare function resetExternalPluginRegistry(): Promise<void>;
export declare function previewExternalPlugin(value: string, 
/** converting moves a repository plugin to this URL; identity checks still apply. */
options?: {
    signal?: AbortSignal;
    updatingId?: string;
    converting?: boolean;
    /** The plugins its dependencies are checked against; a batch adds its earlier updates. */
    definitions?: Parameters<typeof assertExternalCandidateCollision>[2];
}): Promise<ExternalPluginCandidate>;
/** Throws before any bundle download when the manifest's requirements are not met. */
export declare function assertPluginRequirements(manifest: ParsedExternalPluginManifest): void;
/** How a manifest is fetched: a repository pins its bytes, background checks skip Low Data Mode. */
interface ManifestRequest {
    expectedSha256?: string;
    expectedBytes?: number;
    allowConstrainedNetwork?: boolean;
}
/** Fetches and parses only the manifest, under the manifest size cap; no bundle is staged. */
export declare function fetchExternalPluginManifest(value: string, signal?: AbortSignal, timeoutMs?: number, request?: ManifestRequest): Promise<{
    manifest: ParsedExternalPluginManifest;
    manifestSha256: string;
}>;
/**
 * Downloads without changing the registry; callers validate their proposed dependency graph. A
 * repository passes the manifest's pinned hash and size in request.
 */
export declare function downloadExternalPluginCandidate(value: string, signal: AbortSignal | undefined, validateManifest: (manifest: ParsedExternalPluginManifest) => void, request?: ManifestRequest): Promise<ExternalPluginCandidate>;
export declare function discardExternalPluginCandidate(candidate: ExternalPluginCandidate): Promise<void>;
export declare const checkExternalPluginUpdate: (runtimeId: string, signal?: AbortSignal) => Promise<ExternalPluginCandidate>;
