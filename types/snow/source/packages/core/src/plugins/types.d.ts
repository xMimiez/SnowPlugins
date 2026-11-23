import type { JSX } from "react";
import type { ResourceScope } from "../runtime";
export interface Developer {
    id: bigint;
    name: string;
}
export interface PluginContext {
    id: string;
    /** Shared by eagerStart and start. Disposed on stop or startup failure. */
    scope: ResourceScope;
    /** Aborted before stop runs, or when startup fails. */
    signal: AbortSignal;
}
export type PluginCleanup = void | (() => unknown);
/**
 * Return a cleanup function or register with context.scope. The scope is
 * disposed after stop, even if stop throws, and when startup fails.
 */
export type PluginLifecycle = (context: PluginContext) => PluginCleanup | Promise<PluginCleanup>;
export interface PluginDefinition {
    name: string;
    description: string;
    id: string;
    version: string;
    author: Developer[];
    /** Required dependency IDs. */
    dependencies?: string[];
    /** External plugins only: dependencies that add features when usable. */
    optionalDependencies?: string[];
    /** External plugins only: accepted version range by dependency ID. Missing means `*`. */
    dependencyRanges?: Record<string, string>;
    predicates?: (() => boolean)[];
    /** Why the plugin cannot start right now. Checked before dependencies and predicates. */
    unavailableReason?: () => string | undefined;
    requiresRestart?: boolean;
    start?: PluginLifecycle;
    /** Runs before start, before the UI is mounted. */
    eagerStart?: PluginLifecycle;
    stop?: (context: PluginContext) => void | Promise<void>;
    settings?(): JSX.Element;
    devOnly?: boolean;
    reload?: "plugin" | "process" | "native";
    /** Checked after a replacement starts. False or a rejection rolls back. */
    health?: (context: PluginContext) => boolean | Promise<boolean>;
}
export interface PluginReloadResult {
    id: string;
    previousVersion?: string;
    version: string;
    restarted: string[];
    resourceCount: number;
}
/** Written when Snow turns off a built-in feature plugin that failed at launch. */
export interface PluginStartFailure {
    reason: "start-failed" | "start-timeout" | "dependency-failed";
    dependency?: string;
    phase: "eagerStart" | "start";
    message: string;
    stack?: string;
    failedAt: number;
    automatic: true;
    snowRelease: string;
    discordBundle: string;
    retrying: boolean;
}
export interface PluginSetting {
    enabled: boolean;
    /** Turned on because another plugin needed it. Dropped when the plugin is turned off. */
    enabledByDependency?: boolean;
    startFailure?: PluginStartFailure;
}
export interface PluginSettingsStorage {
    [pluginId: string]: PluginSetting;
}
export type PluginState = {
    status: "registered";
} | {
    status: "unavailable";
    reason: string;
} | {
    status: "starting";
    phase: "eagerStart" | "start";
} | {
    status: "running";
    eagerStarted: boolean;
    started: boolean;
} | {
    status: "stopping";
} | {
    status: "stopped";
} | {
    status: "failed";
    error: import("../runtime").NormalizedError;
};
