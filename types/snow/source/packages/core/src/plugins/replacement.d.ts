import type { PluginDefinition, PluginReloadResult } from "./types";
/**
 * Only for feature plugins that declare reload: "plugin". Enabled dependents are
 * restarted. Replacements run one at a time. On failure Snow attempts to restore
 * the previous plugin and enabled state. Rollback errors end up in an AggregateError.
 */
export declare function replacePlugin(replacement: PluginDefinition, options?: {
    enable?: boolean;
    signal?: AbortSignal;
    /** Commits after startup and health. Once this begins, only rejection rolls back. */
    finalize?: () => Promise<void>;
    /** Runs before the old code restarts. A rejection skips those restarts. */
    beforeRollback?: (dependents: readonly string[]) => Promise<void>;
}): Promise<PluginReloadResult>;
