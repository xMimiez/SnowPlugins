import { commitPluginState } from "../sdk/definition";
import { type ParsedExternalPluginManifest } from "../manifest";
import { type ExternalPluginArtifactRecord, type InstalledExternalPlugin } from "./installed-index";
import type { PluginDefinition } from "../types";
export declare const completeExternalPromotion: unique symbol;
type ExternalPluginDefinition = PluginDefinition & {
    [completeExternalPromotion](): void;
    [commitPluginState](): Promise<void>;
};
/** Requirements are pure manifest data checked against values read once per launch. */
export declare function externalRequirementFailure(manifest: ParsedExternalPluginManifest): string | undefined;
export declare function externalPluginDefinition(installed: InstalledExternalPlugin, artifact: ExternalPluginArtifactRecord, updateStartupIds?: ReadonlySet<string>): ExternalPluginDefinition;
export {};
