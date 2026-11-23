export declare const dispatcher: import("@snow-internal/discord/common/types/flux").Dispatcher;
export type FluxPayload = Record<string, any> & {
    type: string;
};
/**
 * Return null or undefined to leave the action alone, any other falsy value to block it, or an
 * object to merge into the payload. Other truthy values are ignored.
 */
export type Intercept = (payload: FluxPayload) => any;
export interface InterceptOptions {
    /** Higher runs first; equal priorities run in registration order. Defaults to 0. */
    priority?: number;
}
/**
 * Runs for every action Discord dispatches, before Discord's own interceptors. Prefer
 * interceptActions for specific types: this costs a call per action. A throwing interceptor is
 * logged once and treated as leaving the action alone. Hooks keep running after a block; check
 * isBlocked to skip work. Actions dispatched from an interceptor go through the dispatcher's own
 * queue, and store subscriptions (dispatcher.subscribe) run in Discord's loop with its error
 * handling.
 */
export declare function intercept(callback: Intercept, options?: InterceptOptions): () => void;
/** Like intercept, but runs only for actions with one of these types. */
export declare function interceptActions(types: string | readonly string[], callback: Intercept, options?: InterceptOptions): () => void;
/** Whether an earlier interceptor blocked this action. */
export declare function isBlocked(payload: object): boolean;
