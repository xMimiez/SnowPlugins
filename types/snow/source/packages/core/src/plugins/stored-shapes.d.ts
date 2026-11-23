import type { PluginSettingsStorage } from "./types";
/** A stored state as read back; `valid` is false when anything was dropped or reset. */
export interface Recovered<S> {
    state: S;
    valid: boolean;
}
/** Each plugin's entry is checked on its own, so one bad entry does not turn every plugin off. */
export declare function parseStoredPluginSettings(value: unknown): Recovered<{
    settings: PluginSettingsStorage;
}>;
export interface StoredPluginPreferences {
    /** Check installed plugins' manifests about once a day and notify; never installs. */
    backgroundUpdateChecks: boolean;
    updateChecksOnWifiOnly: boolean;
    /** Developer setting: turn off built-in feature plugins that fail at launch. */
    disableFailedPlugins: boolean;
    /** Plugins already reported as not compatible, so the startup alert names only new ones. */
    reportedIncompatible: string[];
}
export declare const PLUGIN_PREFERENCE_DEFAULTS: StoredPluginPreferences;
/** Each field is checked on its own, so a bad field never resets the user's other choices. */
export declare function parseStoredPluginPreferences(value: unknown): Recovered<StoredPluginPreferences>;
export interface StoredUpdate {
    id: string;
    version: string;
    sha256?: string;
    bytes?: number;
    manifestSha256: string;
}
export interface StoredUpdateCheck {
    lastCheckedAt?: number;
    lastError?: string;
    updates: StoredUpdate[];
    /** `id:hash` pairs the user was already told about. */
    notified: string[];
    /** The last background notice, so a new set waits a day after the one before. */
    lastNotifiedAt?: number;
}
/** Rebuildable by the next check, so anything invalid starts the whole record empty. */
export declare function parseStoredUpdateCheck(value: unknown): Recovered<StoredUpdateCheck>;
