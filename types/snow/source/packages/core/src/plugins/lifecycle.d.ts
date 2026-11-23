import type { PluginDefinition } from "./types";
/** Starts after this are user actions rather than launch startup. */
export declare function markLaunchComplete(): void;
/** launch: a launch start of a feature plugin is bounded by the lifecycle timeout. */
export declare function runLifecycle(id: string, phase: "eagerStart" | "start", options?: {
    launch?: boolean;
}): Promise<void>;
/**
 * Starts dependencies first. Every non-core plugin it starts is saved as enabled, only after
 * its start succeeded. Safe mode skips non-core starts and still resolves.
 */
export declare function startPlugin(id: string): Promise<void>;
interface StopPass {
    /** Save stopped plugins and their required dependents as off. */
    persist: boolean;
    stopped: string[];
    requiredStopped: Set<string>;
    /** Optional dependents that were bound to a stopped plugin. */
    unbound: Set<string>;
}
/**
 * Stops dependents first, then the plugin, without changing saved choices. Resolves with the
 * optional dependents that were bound to a stopped plugin and are now stopped; callers decide
 * whether to restart them, which starts them unbound.
 */
export declare function stopPluginRuntime(id: string, pass?: Omit<StopPass, "persist">): Promise<string[]>;
/**
 * Stops dependents first and saves the plugin and its required dependents as off. Optional
 * dependents that used it restart without it.
 */
export declare function stopPlugin(id: string): Promise<void>;
/**
 * Stops the plugin and what depends on it, then starts again what this stopped, dependencies
 * first, so optional dependencies that started later are bound. Saved choices stay as they are.
 */
export declare function restartPluginRuntime(id: string): Promise<void>;
/** Why a stopped plugin cannot start for this session, or undefined when it can. */
export declare function sessionStartBlocker(id: string): string | undefined;
/** Starts the plugin and its stopped required dependencies; saved choices stay as they are. */
export declare function startPluginForSession(id: string): Promise<void>;
/**
 * Stops the plugin and its required dependents until they are started again or Discord
 * restarts. Optional dependents that used it restart without it. Saved choices stay as they are.
 */
export declare function stopPluginForSession(id: string): Promise<void>;
export declare function registerExternalPlugin(plugin: PluginDefinition): void;
export declare function unregisterExternalPlugin(id: string): Promise<void>;
export {};
