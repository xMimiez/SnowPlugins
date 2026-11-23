import { type ExternalPluginCandidate } from "./index";
import type { AvailableUpdate, InstallResult } from "./update-types";
/** URL updates downloaded and verified for the batch review. */
export interface PreparedUrlUpdates {
    candidates: Map<string, ExternalPluginCandidate>;
    /** The host each verified bundle was served from, after any redirect. */
    codeHosts: Map<string, string>;
    /** Why an update could not be prepared; the review marks it and the others go on. */
    failed: Map<string, string>;
    /** Which updates waited for their plugin to be turned on when the review opened. */
    waits: ReadonlyMap<string, boolean>;
}
/**
 * Downloads the URL updates among the selected rows, in install order, the way the single-plugin
 * review does. Each must be the exact manifest the check pinned, and the exact code when the
 * manifest pins a hash; a Bunny manifest pins none, so its code is whatever it serves. Its dependencies are
 * checked against what runs once the updates before it install; an update that waits for its plugin
 * to be turned on does not count. Never throws; a failed row keeps its reason.
 */
export declare function prepareUrlUpdates(rows: readonly AvailableUpdate[], waits: ReadonlyMap<string, boolean>, onProgress: (name: string) => void): Promise<PreparedUrlUpdates>;
/** Installs the download the review showed; nothing is fetched again. */
export declare function commitUrlUpdate(prepared: PreparedUrlUpdates, update: AvailableUpdate): Promise<InstallResult>;
/** Discards every download that was not installed. */
export declare function finishUrlUpdates(prepared: PreparedUrlUpdates): Promise<void>;
