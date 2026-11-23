import type { Metro } from "../types";
/**
 * Wraps Metro module factories when Discord's bundle defines them. Snow's entry installs the define
 * hook before Discord's bundle runs, so this file must not import anything that touches Discord's
 * modules or Snow's native modules.
 */
export interface ModuleLoadListener {
    aboutToRun(id: number): void;
    loaded(id: number, exports: unknown): void;
    failed(id: number, error: unknown): void;
}
export declare const getImportingModuleId: () => number;
/** True while the module's factory runs, when its exports may still be incomplete. */
export declare const isModuleRunning: (id: number) => boolean;
/** Modules defined after Snow's module system started, for example from a Metro segment. */
export declare const getLateModuleIds: () => readonly number[];
export declare const getLateDefinitionCount: () => number;
export declare function wrapFactory(factory: Metro.FactoryFn, id: number): Metro.FactoryFn;
