import type { CompatibilityStorageBackend } from "../compat/storage";
export declare function createSdkState(backend: CompatibilityStorageBackend, artifact: string): Promise<{
    readonly value: Record<string, unknown>;
    update(next: Record<string, unknown>): Promise<void>;
    commit(): Promise<void>;
    flush(): Promise<void>;
}>;
export type SdkState = Awaited<ReturnType<typeof createSdkState>>;
