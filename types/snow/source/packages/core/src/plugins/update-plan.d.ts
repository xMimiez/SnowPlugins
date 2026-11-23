/** An installed external plugin as the update planner sees it. */
export interface PlannedPlugin {
    id: string;
    version: string;
    paused: boolean;
    /** Required dependency IDs. */
    dependencies: readonly string[];
    /** Declared ranges for required and optional dependencies. */
    ranges: Readonly<Record<string, string>>;
}
/** What a fetched manifest offers for one installed plugin. */
export interface UpdateOffer {
    id: string;
    version: string;
    requirementFailure?: string;
    /** Why this update cannot be installed with others and must be reviewed on its own. */
    batchBlocker?: string;
    /** The plugin is off or the launch is safe, so the update waits and others cannot rely on it. */
    waits?: boolean;
    dependencies: readonly string[];
    optionalDependencies: readonly string[];
    ranges: Readonly<Record<string, string>>;
}
interface UpdateBreak {
    dependent: string;
    /** The dependent's own offered update, which accepts the new version. */
    fixedBy?: string;
}
export interface UpdateEvaluation {
    id: string;
    blocked: string[];
    older: boolean;
    sameVersion: boolean;
    unmetOptional: string[];
    /** Required dependencies that only another offered update brings into range. */
    needs: string[];
    /** Installed plugins whose declared range excludes the new version. */
    breaks: UpdateBreak[];
}
export interface SelectionIssues {
    unfixedBreaks: string[];
    missingNeeds: string[];
    conflicts: string[];
}
export declare function evaluateUpdates(installed: ReadonlyMap<string, PlannedPlugin>, offers: readonly UpdateOffer[]): UpdateEvaluation[];
/** What each update would leave unresolved if exactly the selected updates were installed. */
export declare function selectionIssues(evaluations: readonly UpdateEvaluation[], offers: readonly UpdateOffer[], selection: ReadonlySet<string>): Map<string, SelectionIssues>;
/** The preselection: unblocked, newer updates that leave nothing unresolved among themselves. */
export declare function safeSelection(evaluations: readonly UpdateEvaluation[], offers: readonly UpdateOffer[]): string[];
/** Selected updates with each one after the selected plugins its new manifest requires. */
export declare function installOrder(offers: readonly UpdateOffer[], selection: ReadonlySet<string>): string[];
export {};
