/**
 * What the plugin SDK hands each scoped API: the plugin's identity, its lifecycle signal, and its
 * resource scope. Registrations call assertActive, add their disposer to the scope, and stop
 * delivering once the signal aborts.
 */
export interface PluginScope {
    readonly id: string;
    readonly signal: AbortSignal;
    readonly scope: {
        add(cleanup: () => unknown): () => unknown;
    };
    assertActive(): void;
}
/** Registers a disposer with the plugin's scope and returns the scope's idempotent release. */
export declare function own(context: PluginScope, dispose: () => unknown): () => void;
