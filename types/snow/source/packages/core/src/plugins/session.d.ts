type PluginProblemSource = "start" | "stop" | "health" | "timeout" | "reported" | "recovery" | "library";
export interface PluginProblem {
    at: number;
    source: PluginProblemSource;
    message: string;
    stack?: string;
}
/** Session-only runtime facts. None of them change a plugin's saved enabled choice. */
interface PluginSession {
    /** Stopped by the user for this session; it starts again on the next launch. */
    stoppedForSession: boolean;
    /** A stop failed or timed out, so its patches may linger until Discord reloads. */
    reloadRecommended: boolean;
    startedAfterLaunch: boolean;
    /** Optional dependencies that were usable and running when the plugin last started. */
    bound: Set<string>;
    problems: PluginProblem[];
}
export declare function pluginSession(id: string): PluginSession;
export declare function notifyPluginRuntime(): void;
/** For useSyncExternalStore: runtime states and session flags changed when the revision did. */
export declare function subscribePluginRuntime(listener: () => void): () => void;
export declare const getPluginRuntimeRevision: () => number;
export declare function recordPluginProblem(id: string, source: PluginProblemSource, error: unknown): void;
export {};
