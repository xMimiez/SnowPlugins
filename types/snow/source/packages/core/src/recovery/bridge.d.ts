export type SafeLaunchReason = "user" | "error-boundary" | "error-report" | "recovery-menu" | "boot-loop" | "hang" | "unknown";
export type StartupMilestone = "resumed" | "startup-finished" | "first-frames" | "snow-failed";
/** Native also reports hangs and the previous launch's fatal error; JavaScript reports these. */
export type ErrorReportKind = "init-failure" | "stall" | "test";
declare module "@snow/native/bridge" {
    interface NativeBridgeMethods {
        "diagnostics.breadcrumb": {
            args: [stage: string, pluginId: string | null, phase: string | null];
            result: null;
        };
        "diagnostics.bundle": {
            args: [identity: string, moduleCount: number];
            result: null;
        };
        "diagnostics.fatal": {
            args: [summary: string, details: string];
            result: null;
        };
        "diagnostics.milestone": {
            args: [milestone: StartupMilestone];
            result: null;
        };
        "diagnostics.recovery": {
            args: [];
            result: {
                lastRecovery: unknown;
                previousFatal: boolean;
            };
        };
        "diagnostics.report": {
            args: [kind: ErrorReportKind, summary: string, details: string];
            result: boolean;
        };
        "diagnostics.showFatal": {
            args: [];
            result: null;
        };
        "diagnostics.timeline": {
            args: [record: Record<string, unknown>];
            result: null;
        };
        "recovery.restart": {
            args: [];
            result: null;
        };
        "recovery.safeLaunch": {
            args: [reason: SafeLaunchReason, detail: string | null];
            result: null;
        };
    }
}
