import type { PluginStartFailure } from "./types";
/** Core plugins abort startup instead, and external plugins have their own quarantine. */
export declare const isFeaturePlugin: (id: string) => boolean;
/**
 * Runs at launch before any plugin starts. A plugin Snow turned off gets one more start after
 * Snow's or Discord's bundle changed; records of plugins that no longer exist are dropped.
 */
export declare function retryFailedPluginsAfterUpdate(): void;
export declare function clearRecoveredStartFailure(id: string): void;
/**
 * Turns off a feature plugin that failed at launch, then the enabled feature plugins that need
 * it. Resolves with the IDs turned off, or none when the developer setting is off.
 */
export declare function disableFailedFeaturePlugin(id: string, phase: PluginStartFailure["phase"], error: unknown): Promise<string[]>;
