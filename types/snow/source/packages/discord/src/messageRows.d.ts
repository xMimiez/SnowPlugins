export interface MessageTarget {
    readonly channelId: string;
    readonly messageId: string;
}
/** Commits a no-op update so Discord re-reads the message. Unchanged records keep their rows. */
export declare function refreshMessage(channelId: string, messageId: string): void;
export interface RowRefresher {
    /** Regenerates the rows of these messages even though their records did not change. */
    refresh(targets: Iterable<MessageTarget>): void;
    /** Regenerates every row Discord has loaded for the channel. */
    refreshChannel(channelId: string): void;
    /**
     * Idempotent. Later refreshes do nothing. Rows refreshed just before still re-render: the last
     * refresher keeps Discord's change check patched for a moment.
     */
    dispose(): void;
}
/**
 * Holds one shared ChatManager patch while any refresher is alive. Throws when Discord's
 * message list modules are missing, so a plugin's start fails instead of rendering stale rows.
 */
export declare function createRowRefresher(): RowRefresher;
/** What Discord's row generator was called with. Every field is Discord's, so check shapes. */
export interface RowInput {
    readonly rowType?: unknown;
    readonly renderContentOnly?: unknown;
    readonly message?: unknown;
}
export type GeneratedRow = Readonly<Record<string, unknown>>;
/**
 * Returns a replacement row, or undefined to keep `row`. Discord reuses row objects, so copy
 * the path that changes instead of mutating it.
 */
export type RowTransform = (input: RowInput, row: GeneratedRow) => GeneratedRow | undefined;
/**
 * Runs `transform` on every row Discord generates, after the transforms added before it. All
 * transforms share one patch, removed with the last of them. `name` labels the one error log a
 * throwing transform gets; it is skipped for that row. Throws when Discord's row generator is
 * missing, so a plugin's start fails instead of doing nothing.
 */
export declare function addRowTransform(name: string, transform: RowTransform): () => void;
