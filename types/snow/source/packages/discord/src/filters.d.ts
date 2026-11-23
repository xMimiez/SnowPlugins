import { type DependencyPattern } from "./dependencies";
import type { FilterFn } from "./types";
export declare const byProps: import("./types").FilterDefinition<string[]>;
export declare const byName: import("./types").FilterDefinition<[string]>;
export declare const byDisplayName: import("./types").FilterDefinition<[string]>;
export declare const byTypeName: import("./types").FilterDefinition<[string]>;
export declare const byStoreName: import("./types").FilterDefinition<[string]>;
export declare const byTypeDisplayName: import("./types").FilterDefinition<[string]>;
export declare const byFilePath: import("./types").FilterDefinition<[string, boolean]>;
export declare const byMutableProp: import("./types").FilterDefinition<[string]>;
type AnyFilter = FilterFn<any>;
/**
 * Matches modules by their dependency list. It can run before a module is initialized, so lookups
 * load only the modules that pass it.
 */
export declare function byDependencies(pattern: DependencyPattern): FilterFn<[DependencyPattern]>;
/** Matches when every filter matches; dependency filters run first on uninitialized modules. */
export declare const allOf: (...filters: AnyFilter[]) => AnyFilter;
/** Matches when any filter matches. All parts must be the same kind. */
export declare const anyOf: (...filters: AnyFilter[]) => AnyFilter;
export {};
