import type { CompatibilityStorageBackend } from "../compat/storage";
import { type ParsedExternalPluginManifest } from "../manifest";
import type { PluginContext } from "../types";
import { type SdkDefinition } from "./definition";
export declare function createSdkDefinition(options: {
    manifest: ParsedExternalPluginManifest;
    source: string;
    artifactSha256: string;
    context: PluginContext;
    storageBackend: CompatibilityStorageBackend;
}): Promise<SdkDefinition>;
