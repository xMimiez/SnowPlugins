import type { CompatibilityStorageBackend } from "./compat/storage";
export declare function createPluginStorageBackend(runtimeId: string, mode?: "installed" | "development"): CompatibilityStorageBackend & {
    removeItem(name: string): Promise<void>;
};
