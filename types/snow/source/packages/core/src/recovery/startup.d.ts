/** In expected order. Each is recorded once per launch; one that never happens stays absent. */
export type StartupStage = "metro-captured" | "discord-index-requested" | "metro-cache-ready" | "snow-initialized" | "discord-index-required" | "run-application-resumed" | "plugins-ready" | "first-frames" | "discord-started";
export type PluginPhase = "eagerStart" | "start";
export interface PluginStartRecord {
    id: string;
    phase: PluginPhase;
    /** Epoch milliseconds. */
    startedAt: number;
    durationMs: number;
    outcome: "ok" | "failed";
}
type ClockSource = "performance" | "nativePerformanceNow" | "date";
/** Records the stage once, tells native what is in progress, and runs the stage's follow-up. */
export declare function markStartupStage(stage: StartupStage): void;
/**
 * Called synchronously around each plugin lifecycle call during startup, so a plugin that blocks
 * the JavaScript thread is the one native names. Starts after plugins-ready are not recorded.
 */
export declare function recordPluginPhase(id: string, phase: PluginPhase, status: "running" | "ok" | "failed"): void;
/** Snow could not start. Discord continues without it, so nothing is left to watch. */
export declare function markSnowFailed(): void;
export declare function getStartupSnapshot(): {
    clock: ClockSource;
    /** Epoch milliseconds. */
    stages: {
        [k: string]: number;
    };
    plugins: PluginStartRecord[];
    watching: boolean;
    stallReported: boolean;
    snowFailed: boolean;
};
export type StartupSnapshot = ReturnType<typeof getStartupSnapshot>;
export {};
