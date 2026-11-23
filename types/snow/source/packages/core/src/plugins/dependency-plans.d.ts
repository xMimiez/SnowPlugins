/** One plugin as the dependency prompts see it. */
export interface PlanNode {
    id: string;
    name: string;
    version: string;
    core: boolean;
    enabled: boolean;
    /** Turned on only because another plugin needed it. */
    byDependency: boolean;
    running: boolean;
    /** Why it cannot run for reasons of its own; never its saved choice or its dependencies. */
    problem?: string;
    dependencies: readonly string[];
    optionalDependencies: readonly string[];
    ranges: Readonly<Record<string, string>>;
    /** Optional dependencies it was started with this session. */
    bound: ReadonlySet<string>;
}
export type PluginGraph = ReadonlyMap<string, PlanNode>;
type EnablePlan = {
    kind: "ready";
}
/** Plugins to turn on first, deepest first. */
 | {
    kind: "confirm";
    turnOn: string[];
} | {
    kind: "blocked";
    plugin: string;
    reason: string;
};
interface DisablePlan {
    /** Enabled plugins that require it, directly or through others; they are turned off too. */
    switchOff: string[];
    /** Running plugins started with it as an optional dependency. */
    optional: string[];
}
export declare function planEnable(graph: PluginGraph, id: string): EnablePlan;
export declare function planDisable(graph: PluginGraph, id: string): DisablePlan;
export declare function planRestartOffer(graph: PluginGraph, id: string): string[];
/** Whether a plugin that is still on needs it, ignoring the ones in leaving. */
export declare function isStillNeeded(graph: PluginGraph, id: string, leaving?: ReadonlySet<string>): boolean;
/** Automatic helpers of turned-off plugins that nothing still on needs, dependents first. */
export declare function planUnneededHelpers(graph: PluginGraph, turnedOff: readonly string[], 
/** The graph before an uninstall, which still has the removed plugin's dependencies. */
previous?: PluginGraph): string[];
export {};
