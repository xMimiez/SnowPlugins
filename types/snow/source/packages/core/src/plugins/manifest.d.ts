import { type PluginManifestAuthor, type PluginManifestLink } from "./manifest-fields";
import { type PluginRequirements } from "./requirements";
import type { Developer, PluginDefinition } from "./types";
export declare const MAX_EXTERNAL_PLUGIN_BYTES: number;
export type { PluginManifestAuthor, PluginManifestLink } from "./manifest-fields";
interface SnowPluginManifestFields {
    id: string;
    name: string;
    description: string;
    version: string;
    authors: PluginManifestAuthor[];
    license: string;
    source: string;
    reload: "plugin";
}
interface PluginDependency {
    range: string;
    optional: boolean;
}
interface SnowPluginManifestV2 extends SnowPluginManifestFields {
    schemaVersion: 2;
    dependencies: string[];
}
interface SnowPluginManifestV3 extends SnowPluginManifestFields {
    schemaVersion: 3;
    requires: PluginRequirements;
    dependencies: Record<string, PluginDependency>;
    library: boolean;
}
type SnowPluginManifestBase = SnowPluginManifestV2 | SnowPluginManifestV3;
export type SnowPluginAuthoringManifest = SnowPluginManifestBase & {
    entry: string;
    bundle?: never;
};
export type SnowPluginDistributionManifest = SnowPluginManifestBase & {
    entry?: never;
    bundle: {
        url: string;
        sha256: string;
        bytes: number;
    };
};
type SnowPluginManifest = SnowPluginAuthoringManifest | SnowPluginDistributionManifest;
export declare function isSnowPluginDistributionManifest(manifest: SnowPluginManifest): manifest is SnowPluginDistributionManifest;
export interface VendettaPluginManifest {
    name: string;
    description: string;
    authors: PluginManifestAuthor[];
    main: string;
    hash: string;
    license?: string;
    source?: string;
    [key: string]: unknown;
}
export interface BunnyPluginManifest {
    id: string;
    spec: 3;
    version: string;
    type: "plugin";
    display: {
        name: string;
        description: string;
        authors: PluginManifestAuthor[];
    };
    main: string;
    extras?: Record<string, unknown>;
    [key: string]: unknown;
}
export type ExternalPluginFormat = "snow" | "vendetta" | "bunny";
type ExternalPluginIntegritySource = "manifest" | "local-pin";
export interface ParsedExternalPluginManifest {
    format: ExternalPluginFormat;
    runtimeId?: string;
    runtimeIdentity?: string;
    originalId?: string;
    sourceKey: string;
    manifestUrl: string;
    resolvedManifestUrl: string;
    name: string;
    description: string;
    version: string;
    authors: PluginManifestAuthor[];
    license?: string;
    source?: string;
    reload: "plugin";
    /** Absent for Vendetta and Bunny plugins, which run on pinned compatibility profiles. */
    requirements?: PluginRequirements;
    /** Required dependency IDs. */
    dependencies: string[];
    /** The fields below are only set for Snow plugins. */
    optionalDependencies?: string[];
    /** Accepted version range of every dependency, required or optional. */
    dependencyRanges?: Record<string, string>;
    library?: boolean;
    bundle: {
        url: string;
        sha256?: string;
        bytes?: number;
        integritySource: ExternalPluginIntegritySource;
    };
    manifest: SnowPluginDistributionManifest | VendettaPluginManifest | BunnyPluginManifest;
}
interface ExternalManifestLocation {
    sourceKey: string;
    resolvedManifestUrl: string;
}
/** A credited person as plugin pages show them. Built-in plugins set neither role nor links. */
export interface PluginPerson extends Developer {
    role?: PluginManifestAuthor["role"];
    links?: PluginManifestLink[];
}
export declare const pluginPerson: (author: PluginManifestAuthor) => PluginPerson;
export declare function manifestAuthors(manifest: ParsedExternalPluginManifest): PluginPerson[];
export declare function parseSnowPluginManifest(value: unknown): SnowPluginManifest;
/** A plugin installed from files: `local/<id>`, which never parses as a URL, so it cannot collide. */
export declare const localSourceKey: (id: string) => string;
/** The base its bundle name resolves against; a file URL, so no code host and no network. */
export declare const localManifestUrl: (id: string) => string;
export declare const isLocalSourceKey: (sourceKey: string) => boolean;
export declare function parseExternalPluginManifest(value: unknown, location: ExternalManifestLocation): ParsedExternalPluginManifest;
export declare function bindCompatibilityRuntimeId(manifest: ParsedExternalPluginManifest, identitySha256: string): ParsedExternalPluginManifest;
export declare function normalizePluginManifestURL(value: unknown): string;
export declare function assertExternalManifestDefinition(manifest: ParsedExternalPluginManifest, definition: PluginDefinition): void;
