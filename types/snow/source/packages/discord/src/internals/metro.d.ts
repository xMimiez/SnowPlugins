import type { Metro } from "../types";
export declare const metroModules: Metro.ModuleList;
/** Every module ID, including modules defined after startup. */
export declare function allModuleIds(): Generator<number>;
export declare const isExcluded: (id: number) => boolean;
/** Finished loading without an error, and searchable. Never initializes anything. */
export declare function isLoaded(id: number): boolean;
/** Runs Discord's entry module, and with it Discord's startup modules, if it has not run yet. */
export declare function loadEntryModule(): void;
/**
 * Loads a module, or returns its exports if it already loaded. A module that throws is recorded,
 * skipped for the rest of this launch, and returns undefined, with Discord's global error handler
 * silenced during the attempt.
 */
export declare function requireModule(id: Metro.ModuleID): any;
