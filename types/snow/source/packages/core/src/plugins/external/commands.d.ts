import { type InstalledExternalPlugin } from "./installed-index";
import type { ExternalPluginCandidate } from "./index";
export declare function installedPluginFromCandidate(candidate: ExternalPluginCandidate): InstalledExternalPlugin;
export declare function installExternalPluginCandidate(candidate: ExternalPluginCandidate, updatingId?: string): Promise<InstalledExternalPlugin>;
/** Saves the plugin as enabled after a trial start. byDependency marks it as turned on for another plugin. */
export declare function enableExternalPlugin(runtimeId: string, options?: {
    byDependency?: boolean;
}): Promise<void>;
/** A session start is a full trial start; only the saved choice stays as it is. */
export declare function startExternalPluginForSession(runtimeId: string): Promise<void>;
export declare function stopExternalPluginForSession(runtimeId: string): Promise<void>;
/**
 * Saves the plugin and every plugin that requires it as off. Optional dependents that used it
 * restart without it, except those listed in switchOff, which are saved as off too.
 */
export declare function disableExternalPlugin(runtimeId: string, switchOff?: readonly string[]): Promise<void>;
export declare function retryExternalPlugin(runtimeId: string): Promise<void>;
export declare function uninstallExternalPlugin(runtimeId: string): Promise<void>;
/**
 * Deletes the plugin's saved state and its files folder. A running plugin is refused unless
 * stopFirst, which stops it for this session first; it then starts again with defaults.
 */
export declare function removeExternalPluginData(runtimeId: string, options?: {
    stopFirst?: boolean;
}): Promise<void>;
/** Paused plugins are left out of batch and background update checks; manual updates still work. */
export declare function setExternalPluginUpdatesPaused(runtimeId: string, paused: boolean): Promise<void>;
/** Saves each listed plugin's enabled flag; a quarantined plugin is never saved as on. */
export declare function setExternalPluginsEnabled(enabled: Readonly<Record<string, boolean>>): Promise<void>;
