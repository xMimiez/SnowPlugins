interface MetroModuleRecord {
    factory?: unknown;
    hasError?: boolean;
    isInitialized?: boolean;
    publicModule?: {
        exports?: unknown;
    };
    __filePath?: string;
}
export type MetroModuleSource = Record<string, MetroModuleRecord | null | undefined>;
interface MetroCatalogEntry {
    id: string;
    initialized: true;
    filePath: string | null;
    exportType: string;
    keys: string[];
    keyCount: number;
    keysTruncated: boolean;
    names: string[];
    fingerprint: string;
}
interface MetroCatalogPage {
    causedInitialization: false;
    entries: MetroCatalogEntry[];
    total: number;
    offset: number;
    nextOffset: number | null;
}
export declare class MetroCatalog {
    #private;
    constructor(modules: MetroModuleSource, requireModule: (id: number) => unknown);
    catalog(offset?: number, limit?: number): MetroCatalogPage;
    searchText(query: string, offset?: number, limit?: number): MetroCatalogPage;
    searchShape(keys: readonly string[], mode?: "all" | "any", offset?: number, limit?: number): MetroCatalogPage;
    describe(id: string): {
        entry: MetroCatalogEntry;
        exports: unknown;
    };
    /** `id` is a canonical safe-integer string, as validated for metro.load. */
    load(id: string): MetroCatalogEntry;
}
export declare function getRuntimeMetroCatalog(): MetroCatalog;
export {};
