import { type ExternalPluginArtifactRecord, type ExternalPluginIndex, type InstalledExternalPlugin } from "./installed-index";
import { type ParsedExternalPluginManifest } from "../manifest";
import type { PluginDefinition } from "../types";
export declare function assertExternalArtifactIntegrity(manifest: ParsedExternalPluginManifest, artifact: ExternalPluginArtifactRecord): void;
export declare function validateInstalledExternalCollisions(index: ExternalPluginIndex, validateArtifact: (plugin: InstalledExternalPlugin, artifact: ExternalPluginArtifactRecord) => void): void;
export declare function collectInstalledExternalDependents(runtimeId: string, index: ExternalPluginIndex, dependencies?: (plugin: InstalledExternalPlugin, artifact: ExternalPluginArtifactRecord) => readonly string[]): Set<string>;
export declare function assertExternalCandidateCollision(manifest: ParsedExternalPluginManifest, index: ExternalPluginIndex, 
/** Without a version the range check is skipped, as when a restore checks only the graph. */
definitions: ReadonlyMap<string, Pick<PluginDefinition, "dependencies"> & Partial<Pick<PluginDefinition, "name" | "version">>>, isExternal: (id: string) => boolean, updatingId?: string): void;
export declare function getInstalledExternalPluginManifest(plugin: InstalledExternalPlugin, artifact?: ExternalPluginArtifactRecord): ParsedExternalPluginManifest;
