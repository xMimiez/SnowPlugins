/**
 * The plugin API version, separate from the Snow release. Bump MINOR for additions existing
 * plugins cannot observe, MAJOR for removals or changed shapes (see CONTRIBUTING.md).
 */
export declare const PLUGIN_API_VERSION = "1.0";
export interface PluginRequirements {
    discord: string;
    discordBuild: string;
    pluginApi: string;
}
/** Schema 2 manifests, and any manifest that declares no ranges, run on plugin API 1.x. */
export declare const LEGACY_PLUGIN_REQUIREMENTS: PluginRequirements;
export interface PluginHostValues {
    discordVersion?: string;
    discordBuild?: string;
    discordOtaBuild?: string;
}
interface RequirementCheck {
    key: keyof PluginRequirements;
    label: string;
    description: string;
    running?: string;
    satisfied: boolean;
}
export declare function defaultPluginApiRange(apiVersion?: string): string;
export declare function checkPluginRequirements(requirements: PluginRequirements, host: PluginHostValues): RequirementCheck[];
/** The install and update error for the first unmet requirement. */
export declare function requirementFailure(checks: readonly RequirementCheck[]): string | undefined;
/** Every availability reason from incompatibilityReason starts with this. */
export declare const INCOMPATIBLE_REASON_PREFIX = "Not compatible with this version";
/** The availability reason shown for an installed plugin whose requirements stopped matching. */
export declare function incompatibilityReason(checks: readonly RequirementCheck[]): string | undefined;
export {};
