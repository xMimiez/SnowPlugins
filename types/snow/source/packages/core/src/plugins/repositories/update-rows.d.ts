import type { AvailableUpdate } from "../external/update-types";
import { type PlanContext } from "./plan";
import { type Track } from "./tracks";
/** An installed plugin whose provenance state is tracked, as update discovery sees it. */
export interface TrackedPlugin {
    id: string;
    name: string;
    /** The pending version when one is waiting, else the current one. */
    version: string;
    manifestSha256: string;
    enabled: boolean;
    paused: boolean;
    repository: string;
    track: Track;
}
/**
 * What every tracked plugin's track resolves to in the cached indexes: newer is an update, older
 * a rollback, and the same version under another manifest hash changed files. Pinned plugins never
 * update and are only counted. Pure: it reads no network and no global state.
 */
export declare function repositoryUpdateRows(plugins: readonly TrackedPlugin[], context: PlanContext, repositoryName: (url: string) => string): {
    updates: AvailableUpdate[];
    pinned: number;
};
/** Updates the user can install now: not changed files and not a repository row that is blocked. */
export declare function installableUpdates(updates: readonly AvailableUpdate[]): AvailableUpdate[];
/**
 * What installing these updates downloads. Each repository row includes the new plugins it adds,
 * so a plugin two rows add is counted once. known is false when any update has no size.
 */
export declare function downloadSize(updates: readonly AvailableUpdate[]): {
    bytes: number;
    known: boolean;
};
