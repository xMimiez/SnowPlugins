import type { RemoteValue } from "@snow-internal/dev/protocol";
import type { InspectionSession } from "./coordinator";
import type { MetroCatalog } from "./metro";
interface StoreCatalogEntry {
    id: string;
    moduleId: string;
    path: string[];
    name: string;
    methods: string[];
    methodCount: number;
    keys: string[];
    keyCount: number;
}
interface StoreCatalogPage {
    entries: StoreCatalogEntry[];
    total: number;
    offset: number;
    nextOffset: number | null;
}
export declare class StoreCatalog {
    #private;
    constructor(metro: MetroCatalog);
    list(): Promise<StoreCatalogEntry[]>;
    page(offset?: number, limit?: number): Promise<StoreCatalogPage>;
    invalidate(): void;
    describe(session: InspectionSession, id: string): Promise<StoreCatalogEntry & {
        value: RemoteValue;
    }>;
}
export {};
