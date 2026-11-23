import type { ExternalPluginProvenance, InstalledExternalPlugin } from "./installed-index";
/** Where a waiting update moves the plugin: a repository, or a URL install of its manifest. */
export type ExternalPluginWaitingSource = {
    kind: "repository";
    provenance: ExternalPluginProvenance;
} | {
    kind: "url";
    sourceKey: string;
    manifestUrl: string;
};
/** The provenance updates follow: a waiting update's source, which becomes the plugin's. */
export declare function followedProvenance(plugin: Pick<InstalledExternalPlugin, "pending" | "provenance">): ExternalPluginProvenance | undefined;
/** The manifest URL update checks fetch: a waiting URL install's, else the plugin's. */
export declare function followedSourceKey(plugin: Pick<InstalledExternalPlugin, "pending" | "sourceKey">): string;
/** The plugin fields a waiting update's source sets once its trial succeeds. */
export declare function waitingSourceFields(source: ExternalPluginWaitingSource): Partial<InstalledExternalPlugin>;
