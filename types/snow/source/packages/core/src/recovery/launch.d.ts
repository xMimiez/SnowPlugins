import type { SafeLaunchReason } from "./bridge";
export type LaunchMode = "normal" | "safe" | "safe-once";
export interface SafeLaunch {
    reason: SafeLaunchReason;
    /** Epoch milliseconds. */
    requestedAt: number;
    detail: string | null;
    /** The request file could not be removed; native remembers it so it is honored only once. */
    clearFailed: boolean;
}
export interface LaunchInfo {
    mode: LaunchMode;
    launchId: string;
    /** Set for a one-time safe launch. */
    safeLaunch: SafeLaunch | null;
    /** Epoch milliseconds of each native stage reached so far, and of process-start. */
    nativeStages: Readonly<Record<string, number>>;
}
/**
 * The launch the tweak describes on SnowLoader.launch, or null on a tweak without recovery
 * support. Read on each call: native publishes it again once Snow's bundle has evaluated.
 */
export declare function getLaunchInfo(): LaunchInfo | null;
/** Whether the tweak implements the diagnostics and recovery bridge methods. */
export declare const hasRecoveryBridge: () => boolean;
export declare const isSafeOnceLaunch: () => boolean;
