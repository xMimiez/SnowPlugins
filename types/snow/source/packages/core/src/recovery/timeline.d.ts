/** What the startup recorder knows when the launch record is written. */
interface TimelineInput {
    clock: string;
    /** Epoch milliseconds per stage. */
    stages: Readonly<Record<string, number>>;
    plugins: readonly {
        id: string;
        phase: string;
        startedAt: number;
        durationMs: number;
        outcome: "ok" | "failed";
    }[];
    snowFailed: boolean;
}
type DiscordMarks = "off" | "applied" | "unavailable";
/** Gives native error reports the bundle identity once Discord's modules are known. */
export declare function publishBundleIdentity(): void;
/**
 * Adds Snow's stage to Discord's app-start log when the developer setting is on. Settings load
 * with Snow and are known once they hydrate, so earlier stages wait and keep their own deltas.
 */
export declare function recordDiscordMark(stage: string, deltaMs: number): void;
/**
 * One write per launch, after startup so it never delays the first render. Discord's signal
 * replaces a pending fallback write; a fallback never replaces a pending write.
 */
export declare function scheduleTimelineWrite(stage: string, snapshot: () => TimelineInput): void;
export declare const getDiscordMarksStatus: () => DiscordMarks;
export {};
