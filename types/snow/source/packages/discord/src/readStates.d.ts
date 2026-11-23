/** One read state, in the shape Discord's bulk acknowledge takes. */
export interface ReadStateTarget {
    readonly channelId: string;
    readonly messageId: string;
    readonly readStateType: number;
}
export interface UnreadChannels {
    /** Unread server channels and joined threads. Never DMs. */
    readonly targets: readonly ReadStateTarget[];
    /** Servers with at least one target. */
    readonly guildCount: number;
    /** Mentions across the targets. */
    readonly mentionCount: number;
}
export interface ServerReadStates {
    /** Every server's unread channels and active joined threads, read from Discord's stores now. */
    collect(): UnreadChannels;
    /** Hands the targets to Discord's bulk acknowledge, which marks them and saves that to the account. */
    acknowledge(targets: readonly ReadStateTarget[]): void;
}
/**
 * Discord's server read state stores and its bulk acknowledge action. Throws when this Discord
 * build lacks any of them, so a caller can turn the feature off before showing anything.
 */
export declare function findServerReadStates(): ServerReadStates;
/**
 * The ReadAll plugin's mark-everything-as-read action while it runs, for screens that replace
 * Discord's server rail (ServerDrawer). It asks for the same confirmation as the rail button.
 */
export declare const useMarkAllReadAction: import("zustand").UseBoundStore<import("zustand").StoreApi<{
    markAllRead?: () => void;
}>>;
