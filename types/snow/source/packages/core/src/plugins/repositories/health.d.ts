/** The repositories section of runtime.health; read-only, for device tests. */
export declare function repositoryHealth(): {
    loaded: boolean;
    listReset: boolean;
    count: number;
    lastBackgroundCheckAt: number | null;
    updates: {
        computedAt: number | null;
        pinned: number;
        updates: {
            id: string;
            from: string;
            to: string;
            kind: "changed" | "rollback" | "update";
            repository: string;
            manifestSha256: string;
            bytes: number | null;
            appliesWhenOn: boolean;
            newDependencies: string[];
            blocked: string | null;
        }[];
    };
    repositories: {
        url: string;
        name: string;
        state: "host-changed" | "off" | "on" | "untrusted";
        trustedHost: string;
        servedFrom: string | null;
        refreshing: boolean;
        cached: boolean;
        cacheAgeMs: number | null;
        etag: string | null;
        entries: {
            plugins: number;
            themes: number;
            fonts: number;
        };
        skipped: number;
        lastAttemptAt: number | null;
        lastSuccessAt: number | null;
        lastError: string | null;
        failures: number;
        skippedAt: number | null;
        skippedReason: string | null;
    }[];
};
