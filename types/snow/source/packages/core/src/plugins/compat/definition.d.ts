import { type CompatibilityStorageBackend } from "./storage";
import type { PluginDefinition } from "../types";
import { type ParsedExternalPluginManifest } from "../manifest";
import type { CompatibilityFacadeOptions } from ".";
interface CompatibilityPluginInput {
    manifest: ParsedExternalPluginManifest;
    source: string;
    artifactSha256: string;
    storageBackend: CompatibilityStorageBackend;
    createFacade: (options: CompatibilityFacadeOptions) => unknown;
}
export declare function createCompatibilityPluginDefinition(format: "bunny" | "vendetta", input: CompatibilityPluginInput): Promise<PluginDefinition>;
export {};
