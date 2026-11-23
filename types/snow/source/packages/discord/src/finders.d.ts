import { FilterFn } from "./types";
/**
 * - `loaded`: only modules Discord already initialized. Never runs a module.
 * - `prechecked`: also initializes modules that pass a dependency filter's pre-check.
 * - `exhaustive` (default): falls back to initializing modules in ID order until one matches.
 */
export type LookupScope = "loaded" | "prechecked" | "exhaustive";
export interface LookupOptions {
    scope?: LookupScope;
}
type Match = {
    id: number;
    defaultExport: boolean;
};
/**
 * Checks cached IDs, then loaded modules, then modules passing a dependency pre-check, and only
 * then, in the exhaustive scope, initializes modules in ID order. Returns an empty object on a miss.
 * defaultExport tells the caller whether to unwrap the default export.
 */
export declare function findModule<A extends unknown[]>(filter: FilterFn<A>, { scope }?: LookupOptions): Partial<Match>;
export declare function findModuleId<A extends unknown[]>(filter: FilterFn<A>, options?: LookupOptions): number | undefined;
/** Checks default exports first. May initialize Discord modules unless the scope is loaded. */
export declare function findExports<A extends unknown[]>(filter: FilterFn<A>, options?: LookupOptions): any;
/**
 * Every match. Without a complete cached result this checks loaded and pre-checked modules, and
 * an exports-only filter then initializes every remaining module: expensive on a cold cache.
 * A matching default export wins over its containing exports object.
 */
export declare function findAllModule<A extends unknown[]>(filter: FilterFn<A>): Match[];
export declare function findAllModuleId<A extends unknown[]>(filter: FilterFn<A>): number[];
export declare function findAllExports<A extends unknown[]>(filter: FilterFn<A>): any[];
export { waitFor, waitForModule } from "./internals/wait";
