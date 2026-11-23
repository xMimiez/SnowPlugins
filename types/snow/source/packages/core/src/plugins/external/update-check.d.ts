import type { PreparedRepositoryUpdates } from "../repositories/updates";
import { type StoredUpdateCheck } from "../stored-shapes";
import { type UpdateEvaluation } from "../update-plan";
import type { AvailableUpdate, InstallResult } from "./update-types";
import { type PreparedUrlUpdates } from "./url-updates";
export type { AvailableUpdate } from "./update-types";
interface FailedCheck {
    id: string;
    name: string;
    reason: string;
}
/** Persisted so the banner and notification survive relaunches. Rebuildable; missing starts empty. */
export declare const useUpdateCheckState: import("zustand").UseBoundStore<Omit<import("zustand").StoreApi<StoredUpdateCheck>, "persist" | "setState"> & {
    setState(partial: Partial<StoredUpdateCheck> | StoredUpdateCheck | ((state: StoredUpdateCheck) => Partial<StoredUpdateCheck> | StoredUpdateCheck), replace?: false | undefined): unknown;
    setState(state: StoredUpdateCheck | ((state: StoredUpdateCheck) => StoredUpdateCheck), replace: true): unknown;
    persist: {
        setOptions: (options: Partial<import("zustand/middleware").PersistOptions<StoredUpdateCheck, StoredUpdateCheck, unknown>>) => void;
        clearStorage: () => void;
        rehydrate: () => Promise<void> | void;
        hasHydrated: () => boolean;
        onHydrate: (fn: (state: StoredUpdateCheck) => void) => () => void;
        onFinishHydration: (fn: (state: StoredUpdateCheck) => void) => () => void;
        getOptions: () => Partial<import("zustand/middleware").PersistOptions<StoredUpdateCheck, StoredUpdateCheck, unknown>>;
    };
}>;
interface UpdateSession {
    status: "idle" | "checking" | "preparing" | "installing";
    /** A check finished in this session, so the screen has a list to show. */
    checked: boolean;
    /** While checking: done of total; while installing: the plugin and its position. */
    progress?: {
        done: number;
        total: number;
        current?: string;
    };
    updates: AvailableUpdate[];
    evaluations: UpdateEvaluation[];
    failures: FailedCheck[];
    results: Record<string, InstallResult>;
    /** Repository plugins pinned to a version, which never get update rows. */
    pinned: number;
    /** When the repository rows were last computed from cached indexes. */
    repositoryRowsAt?: number;
    controller?: AbortController;
}
/** The live check for the Updates screen; never persisted. */
export declare const useUpdateSession: import("zustand").UseBoundStore<import("zustand").StoreApi<UpdateSession>>;
/** Manifest-only check of every covered plugin. Never downloads a bundle. */
export declare function checkForPluginUpdates(options?: {
    background?: boolean;
}): Promise<{
    found: AvailableUpdate[];
}>;
export declare function cancelPluginUpdateCheck(): void;
/** Drops an uninstalled plugin's listed updates and notices, so a reinstall is told again. */
export declare function forgetPluginUpdates(id: string): void;
/** The waiting updates the banner counts: listed and still not installed. */
export declare function waitingUpdateCount(): number;
/**
 * A while after startup, then on each return to the foreground; each run skips work whose
 * interval has not passed. Notifies only and never installs. Repository rows recompute from
 * cached indexes whenever plugins or repositories change. Calling it again keeps the schedule
 * already running. Returns the function that stops it: its timers, subscriptions, and listener.
 */
export declare function scheduleBackgroundUpdateCheck(): () => void;
/** The selected updates, downloaded and verified for the review. */
interface PreparedUpdates extends PreparedUrlUpdates {
    repository?: PreparedRepositoryUpdates;
}
/**
 * Downloads and verifies the selected updates before the review, so it can show where each one's
 * code came from. Undefined when the selection has nothing to download. Pass the result to
 * installPluginUpdates, or to discardPreparedUpdates when the review is dismissed.
 */
export declare function prepareSelectedUpdates(selection: ReadonlySet<string>): Promise<PreparedUpdates | undefined>;
export declare function discardPreparedUpdates(prepared: PreparedUpdates): Promise<void>;
/**
 * Installs the confirmed selection one at a time, dependencies first, committing exactly what
 * prepareSelectedUpdates downloaded. An item whose needed update failed is skipped; independent
 * items continue. Repository updates install with the plugins they newly need.
 */
export declare function installPluginUpdates(selection: ReadonlySet<string>, prepared?: PreparedUpdates): Promise<void>;
