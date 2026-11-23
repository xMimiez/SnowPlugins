/**
 * Errors from callbacks Snow runs inside Discord's code paths. Each failure is caught at the call
 * site, recorded here, and logged on its first occurrence, so Discord and the other callbacks keep
 * going. Records live for this launch only. Dependency-free: the module loader uses it before
 * Discord's modules exist.
 */
export type IsolationSite = "app-start-resume" | "asset-callback" | "flux-intercept" | "jsx-hook" | "module-callback" | "module-postprocess" | "native-event" | "patch-after" | "patch-before" | "settings-row";
export interface IsolatedError {
    /** Plugin registry ID, `discord` for Discord's own failures, otherwise `snow`. */
    owner: string;
    site: IsolationSite;
    /** Module ID, action type, method name, or another site-specific label. */
    detail: string;
    message: string;
    stack: string;
    count: number;
    firstAt: number;
    lastAt: number;
}
/** The message and the stack with each cause appended, capped at 4 KB. */
export declare function formatError(error: unknown): {
    message: string;
    stack: string;
};
/** The external plugin whose evaluated source appears first in the error's stack. */
export declare function stackOwner(error: unknown): string | undefined;
/** Records a contained failure and logs it the first time its owner, site, and detail occur. */
export declare function reportIsolatedError(error: unknown, site: IsolationSite, detail?: string | number, owner?: string): void;
export interface IsolatedErrorSummary {
    total: number;
    /** Distinct failures dropped because the record limit was reached. */
    overflow: number;
    owners: Record<string, number>;
    records: IsolatedError[];
}
/** A copy of this launch's records, most recent first. */
export declare function getIsolatedErrors(): IsolatedErrorSummary;
