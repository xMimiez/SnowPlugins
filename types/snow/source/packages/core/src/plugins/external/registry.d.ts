import { type ExternalPluginArtifactReference, type ExternalPluginIndex } from "./installed-index";
interface ExternalRegistrySnapshot {
    hydrated: boolean;
    error?: string;
    index: ExternalPluginIndex;
}
export declare let registry: ExternalRegistrySnapshot;
export declare const enqueueRegistry: <T>(operation: () => Promise<T>) => Promise<T>;
export declare const enqueueExternalLifecycle: <T>(operation: () => Promise<T>) => Promise<T>;
export declare function publishRegistry(next: ExternalRegistrySnapshot): void;
export declare function getExternalRegistrySnapshot(): ExternalRegistrySnapshot;
export declare function subscribeExternalRegistry(listener: () => void): () => void;
export declare function reservePluginArtifactCommit(reference: ExternalPluginArtifactReference, expectedGeneration?: number): Promise<void>;
export declare function abandonPluginArtifactCommit(reference: ExternalPluginArtifactReference): Promise<void>;
export declare function recoverPluginArtifactCommits(): Promise<void>;
export declare function replaceIndex(mutate: (index: ExternalPluginIndex) => ExternalPluginIndex): Promise<ExternalPluginIndex>;
export {};
