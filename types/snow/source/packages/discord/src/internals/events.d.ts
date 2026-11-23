/**
 * Module load events. Subscribers run synchronously inside Discord's require, so they must stay
 * cheap and use loaded-scope lookups only. Each call is guarded: a throwing subscriber is logged and
 * never reaches Discord's module loading. Lists are replaced on change, so subscribing or disposing
 * during delivery takes effect from the next module.
 */
export type ModuleLoadedCallback = (id: number, exports: any, searchable: boolean) => void;
type Dispose = () => void;
/** Every module, just before its factory runs. Its exports object is still empty. */
export declare function onModuleAboutToRun(callback: (id: number) => void, owner?: string): Dispose;
/** Every module whose factory returned, including modules Snow excludes from searches. */
export declare function onModuleLoaded(callback: ModuleLoadedCallback, owner?: string): Dispose;
/** Every module whose factory threw. No loaded event follows. */
export declare function onModuleFailed(callback: (id: number, error: unknown) => void, owner?: string): () => undefined;
/** Fires once, when the module finishes loading, then removes itself. */
export declare function subscribeModule(id: number, callback: (exports: any) => void, owner?: string): () => void;
export {};
