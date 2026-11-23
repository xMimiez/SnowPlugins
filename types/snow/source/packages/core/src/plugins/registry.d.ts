import { ResourceScope } from "../runtime";
import type { JSX } from "react";
import { isCorePlugin } from "./identifiers";
import type { PluginDefinition, PluginState } from "./types";
export interface PluginRuntime {
    controller: AbortController;
    eagerStarted: boolean;
    scope: ResourceScope;
    started: boolean;
    startPromise?: Promise<void>;
    stopPromise?: Promise<void>;
    state: PluginState;
}
type PluginAvailability = {
    available: true;
} | {
    available: false;
    reason: string;
};
export declare const pluginInstances: Map<string, PluginDefinition>;
export declare const pluginRuntimes: Map<string, PluginRuntime>;
export declare const externalPluginIds: Set<string>;
export { isCorePlugin };
export declare function requirePlugin(id: string): PluginDefinition;
export declare function assertPluginDefinition(id: string, value: unknown): asserts value is PluginDefinition;
export declare function runtimeFor(id: string): PluginRuntime;
/** Why the plugin cannot run for reasons of its own, leaving out its dependencies. */
export declare function ownUnavailableReason(id: string): string | undefined;
/**
 * Throws for an unknown ID. Optional dependencies never make a plugin unavailable, and a plugin's
 * saved enabled choice is never part of its own availability.
 */
export declare function getPluginAvailability(id: string): PluginAvailability;
export declare const isPluginAvailable: (id: string) => boolean;
/** An optional dependency is usable only inside the range the dependent declares for it. */
export declare function isOptionalDependencyUsable(plugin: PluginDefinition, dependencyId: string): boolean;
/** Required dependents, and dependents bound to an optional dependency this session, transitively. */
export declare function dependentIds(id: string): string[];
export declare function getPluginState(id: string): PluginState | undefined;
export declare function getPluginResourceCount(id: string): number;
export declare function validateReplaceablePlugin(plugin: PluginDefinition): void;
export declare const findPluginById: (id: string) => boolean;
export declare const isExternalPlugin: (id: string) => boolean;
export declare function definePlugin(instance: PluginDefinition): PluginDefinition;
export declare function getPluginSettingsComponent(id: string): (() => JSX.Element) | null;
