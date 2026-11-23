import type { OperationParameters } from "@snow-internal/dev/protocol";
type ReloadParameters = OperationParameters<"plugins.reload">;
export declare function reloadSdkPlugin(values: ReloadParameters, signal?: AbortSignal): Promise<{
    id: string;
    previousVersion?: string;
    version: string;
    restarted: string[];
    resourceCount: number;
    buildId: string;
}>;
export {};
