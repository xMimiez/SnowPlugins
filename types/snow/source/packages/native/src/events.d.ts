type Listener = (payload: any) => void;
type AnyListener = (name: string, payload: unknown) => void;
/**
 * Registers Snow's event module with React Native. Synchronous, so it runs before native's first
 * event. False when React Native's registration function is not installed yet.
 */
export declare function registerNativeEvents(): boolean;
/**
 * Lets native deliver events, including the ones it held until now. Call once the listeners that
 * should see startup events exist. Does nothing on loaders without native events.
 */
export declare function enableNativeEvents(): void;
/** True once native can push events here; otherwise callers keep polling. */
export declare const nativeEventsSupported: () => boolean;
/** Calls back for each event with this name. */
export declare function onNativeEvent(name: string, listener: Listener): () => void;
/** Calls back for every event. */
export declare function onAnyNativeEvent(listener: AnyListener): () => void;
export declare const UPDATER_STATUS_EVENT = "snow.updater.status";
/** Native pushes updater status changes while at least one watch is active. */
export declare function watchUpdater(): () => void;
/** The updater status with the sequence of the newest pushed status, to order the two. */
export declare const updaterEventSnapshot: () => Promise<{
    status: import("./modules/update").UpdateStatus | null;
    sequence: number;
}>;
export {};
