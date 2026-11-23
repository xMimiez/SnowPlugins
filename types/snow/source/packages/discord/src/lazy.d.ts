import type { FilterFn, LazyModuleContext } from "./types";
export declare function getLazyContext<A extends unknown[]>(proxy: any): LazyModuleContext<A> | void;
/**
 * The search runs on first use: cached IDs, loaded modules, pre-checked modules, then, as a last
 * resort, every module (logged as a slow lookup in development builds). Throws when nothing
 * matches. `resolve` can answer first without searching, for example from the store registry.
 */
export declare function createLazyModule<A extends unknown[]>(filter: FilterFn<A>, resolve?: () => unknown): any;
