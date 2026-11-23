import { type ExternalPluginCandidate } from "../external";
import type { PlanContext, PlanItem } from "./plan";
/** One plan at a time; the returned function ends it. */
export declare function beginPlan(): () => void;
/** The turned-on repositories' cached indexes and every plugin Snow knows about. */
export declare function planContext(): PlanContext;
/**
 * Downloads and verifies every item in order, before the review. Each manifest is fetched under
 * the index pin, checked against the release, and checked against the plugins installed plus the
 * items before it. Any failure discards everything downloaded so far.
 */
export declare function preparePlan(items: readonly PlanItem[], options?: {
    signal?: AbortSignal;
    onProgress?: (done: number, item: PlanItem) => void;
}): Promise<ExternalPluginCandidate[]>;
export declare function discardPlan(candidates: readonly ExternalPluginCandidate[]): Promise<void>;
interface PlanOutcome {
    installed: string[];
    /** Set when everything installed but turning the requested plugin on failed. */
    turnOnError?: string;
}
/**
 * Installs every candidate in order. An update goes last; when the plugin is on, the plugins its
 * new version needs are turned on first so it can start: the ones this plan installs and those in
 * needed, which another update in the same batch installed. Turning on a fresh install happens
 * only after everything installed, through the Plugins page's planner. If any step fails, the
 * commit is undone: what it installed is uninstalled and what it turned on is turned off. A failed
 * update restores the plugin's own record.
 */
export declare function commitPlan(items: readonly PlanItem[], candidates: readonly ExternalPluginCandidate[], turnOn: boolean, needed?: readonly string[]): Promise<PlanOutcome>;
export {};
