import type { RepositoryEntry, RepositoryPlugin, RepositoryRelease } from "./index-format";
import { type Track } from "./tracks";
/** A plugin as the plan sees it: installed external, a built-in feature, or a core plugin. */
export interface InstalledPlugin {
    id: string;
    name: string;
    version: string;
    kind: "external" | "builtin" | "core";
    enabled: boolean;
    quarantined: boolean;
}
/** Plans compute from cached indexes only, so building one never waits on the network. */
export interface PlanContext {
    /** Turned-on, confirmed repositories in priority order. */
    repositories: readonly {
        url: string;
        entries: readonly RepositoryEntry[];
    }[];
    installed: ReadonlyMap<string, InstalledPlugin>;
}
export interface PlanItem {
    id: string;
    name: string;
    repository: string;
    entry: RepositoryPlugin;
    release: RepositoryRelease;
    track: Track;
    /** The name of the plugin that needs it; unset for the requested plugin. */
    neededBy?: string;
    /** The requested plugin is installed and this replaces it. */
    updating?: boolean;
}
/** An installed dependency the user should know about before installing. */
interface PlanNote {
    id: string;
    name: string;
    state: "off" | "quarantined";
}
export type PlanProblem = {
    kind: "not-offered";
    id: string;
    neededBy: string;
    range: string;
} | {
    kind: "missing-core";
    id: string;
} | {
    kind: "builtin-dependency";
    id: string;
    neededBy: string;
} | {
    kind: "installed-out-of-range";
    id: string;
    name: string;
    version: string;
    range: string;
    neededBy: string;
} | {
    kind: "cycle";
    names: string[];
} | {
    kind: "too-many";
    limit: number;
    adding: number;
} | {
    kind: "already-installed" | "not-installed";
    id: string;
} | {
    kind: "pin-missing";
    id: string;
    version: string;
};
export type PlanResult = {
    kind: "ready";
    items: PlanItem[];
    notes: PlanNote[];
} | {
    kind: "blocked";
    problem: PlanProblem;
};
/**
 * Resolves the requested plugin and every required plugin it needs into install order,
 * dependencies first. A dependency comes from an installed plugin when one has its ID, otherwise
 * from the dependent's own repository, then the others in priority order.
 */
export declare function resolveInstallPlan(request: {
    repository: string;
    entryId: string;
    track?: Track;
    updating?: boolean;
}, context: PlanContext): PlanResult;
export {};
