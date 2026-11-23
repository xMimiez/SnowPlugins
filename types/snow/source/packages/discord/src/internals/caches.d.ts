import { ModulesMapInternal } from "./enums";
type ModulesMap = {
    [flag in number | `_${ModulesMapInternal}`]?: number;
};
interface CacheKey {
    _v: number;
    _buildNumber: string;
    _bundle: string;
    _otaBuild: string;
    _modulesCount: number;
}
export interface MetroCache extends CacheKey {
    /** Modules whose exports are never worth searching. Failures are not persisted. */
    flagsIndex: Record<string, number>;
    findIndex: Record<string, ModulesMap | undefined>;
    /** Redesign component name to the module that provides it. */
    redesignIndex: Record<string, number>;
    /** Asset name to type to asset module ID. Complete once every asset module was indexed. */
    assetIndex: {
        complete: boolean;
        names: Record<string, Record<string, number>>;
    };
    /** Discord source path to module ID, as reported by Discord's import tracker. */
    pathIndex: Record<string, number>;
}
export interface MetroCacheStatus {
    outcome: "current" | "previous" | "rebuilt";
    source: "sync" | "async";
    bundle: string;
    otaBuild: string;
    modulesCount: number;
}
export declare const getMetroCache: () => MetroCache;
/** How this launch's cache was chosen. Undefined before the cache loads. */
export declare const getMetroCacheStatus: () => MetroCacheStatus | undefined;
export declare function invalidateCache(): void;
export {};
