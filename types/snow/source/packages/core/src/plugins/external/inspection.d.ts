/** Read-only details for the plugins.inspect dev operation: source, provenance, and dependencies. */
export declare function inspectPluginSource(id: string): {
    external: {
        format: import("../manifest").ExternalPluginFormat;
        enabled: boolean;
        quarantined: boolean;
        version: string;
        pendingVersion: string | null;
        sha256: string;
        manifestSha256: string;
        sourceKind: string;
        manifestUrl: string | null;
        requestedManifestUrl: string | null;
        provenance: import("./installed-index").ExternalPluginProvenance | null;
        provenanceState: "local" | "off" | "orphaned" | "tracked" | "url" | "withdrawn";
    } | null;
    requires: import("../requirements").PluginRequirements | null;
    dependencies: string[];
    optionalDependencies: string[];
    ranges: Record<string, string>;
    library: boolean;
    consumers: string[];
    libraries: {
        id: string;
        connected: boolean;
    }[];
    startFailure: import("../types").PluginStartFailure | null;
};
