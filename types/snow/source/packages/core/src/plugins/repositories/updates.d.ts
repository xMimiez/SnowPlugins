import type { ExternalPluginCandidate } from "../external";
import type { AvailableUpdate, InstallResult } from "../external/update-types";
import { type PlanItem, type PlanProblem } from "./plan";
/**
 * The repository half of the platform's background update check: every 6 hours it refreshes all
 * confirmed repositories with conditional requests, skipping Low Data Mode, and in between it
 * refreshes only repositories whose last success is older than that. Never installs anything.
 */
export declare function backgroundRepositoryCheck(onWifi: boolean): Promise<void>;
/** A manual check: every turned-on repository, ignoring backoff and network limits. */
export declare function refreshForUpdateCheck(): Promise<{
    id: string;
    name: string;
    reason: string;
}[]>;
/** Recomputes repository update rows from cached indexes; never touches the network. */
export declare function computeRepositoryUpdates(): Promise<{
    updates: AvailableUpdate[];
    pinned: number;
}>;
/** A selected repository update its plan could not resolve when it was prepared. */
export declare class RepositoryUpdateBlocked extends Error {
    readonly pluginName: string;
    readonly problem: PlanProblem;
    constructor(pluginName: string, problem: PlanProblem);
}
interface PreparedGroup {
    items: PlanItem[];
    candidates: ExternalPluginCandidate[];
}
/** Downloaded and verified repository updates, waiting for the review. */
export interface PreparedRepositoryUpdates {
    groups: Map<string, PreparedGroup>;
    /**
     * The host each verified bundle was served from, after any redirect: every update and every
     * plugin an update installs with it.
     */
    codeHosts: Map<string, string>;
    installed: Set<string>;
    failed: Set<string>;
    end: () => void;
}
/**
 * Plans and downloads every selected repository update with the plugins it newly needs, before
 * the review. Rows are planned in install order against what the rows before them install, so a
 * shared new dependency is downloaded once. Each root must still match the hash the check pinned.
 */
export declare function prepareRepositoryUpdates(rows: readonly AvailableUpdate[], onProgress: (name: string) => void): Promise<PreparedRepositoryUpdates>;
/**
 * Commits one prepared update with the plugins it newly needs. A failure uninstalls only what this
 * update added; an update that needs a plugin whose own group failed is skipped.
 */
export declare function commitRepositoryUpdate(prepared: PreparedRepositoryUpdates, id: string): Promise<InstallResult>;
/** Discards whatever was downloaded but not installed, and ends the plan. */
export declare function finishRepositoryUpdates(prepared: PreparedRepositoryUpdates): Promise<void>;
export {};
