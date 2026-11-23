import type { ResourceScope } from "../../runtime";
import type { PluginIdentity } from "./definition";
/** What a library's export function receives for one consumer. */
export interface LibraryConsumer {
    readonly consumer: PluginIdentity;
    /** Aborts when this library and consumer pair ends. */
    readonly signal: AbortSignal;
    /** Runs when the pair ends, in reverse order, each bounded by the lifecycle timeout. */
    onDispose(cleanup: () => unknown): () => void;
}
export type LibraryExport = (consumer: LibraryConsumer) => unknown;
/** A consumer start that failed because of a library, not the consumer's own code. */
export declare const isLibraryFailure: (error: unknown) => boolean;
export declare function isLibraryConnected(libraryId: string, consumerId: string): boolean;
/** Called once the library started and passed its health check. */
export declare function provideLibrary(id: string, name: string, exportApi: LibraryExport): void;
/** Ends every pair of a library that is stopping or failed. */
export declare function withdrawLibrary(id: string): Promise<void>;
/**
 * The module entry for one imported library at one consumer start. A running library gets a
 * fresh pair: its export function runs for this consumer and the result crosses a membrane.
 */
export declare function libraryEntry(options: {
    libraryId: string;
    optional: boolean;
    consumer: PluginIdentity;
    consumerScope: ResourceScope;
    names: readonly string[];
}): object;
