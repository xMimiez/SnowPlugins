import { FilterCheckDef, FilterDefinition, ModuleExports } from "./types";
export declare function createFilterDefinition<A extends unknown[]>(fn: FilterCheckDef<A>, uniqMaker: (args: A) => string): FilterDefinition<A>;
export declare function createSimpleFilter(filter: (m: ModuleExports) => boolean, uniq?: string): import("./types").FilterFn<unknown[]>;
