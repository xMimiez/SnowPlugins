import type { PlanProblem } from "../repositories/plan";
import type { Track } from "../repositories/tracks";
import type { UpdateOffer } from "../update-plan";
/** Where a repository update comes from and what installing it adds. */
export interface RepositoryUpdateSource {
    url: string;
    name: string;
    kind: "update" | "rollback" | "changed";
    prerelease: boolean;
    /** The channel the plugin follows, for the rollback note. */
    channel: string | null;
    track: Track;
    /** Plugins this update installs with it, dependencies first. */
    adding: {
        id: string;
        name: string;
        version: string;
        bytes: number;
    }[];
    /** Why it cannot be selected: its plan does not resolve. */
    blocked?: PlanProblem;
}
export interface AvailableUpdate {
    id: string;
    name: string;
    currentVersion: string;
    version: string;
    /** The new bundle hash; Bunny manifests carry none, so their code change is unknown. */
    sha256?: string;
    bytes?: number;
    /** A repository update pins the manifest hash its index lists. */
    manifestSha256: string;
    /**
     * The hosts the new and installed manifests name for their bundles, before any redirect. Unset
     * for repository updates, whose code host is read once they download.
     */
    codeHost?: string;
    previousCodeHost?: string;
    /** The plugin is off, so the update waits until it is switched on. */
    appliesWhenOn: boolean;
    offer: UpdateOffer;
    repository?: RepositoryUpdateSource;
}
export type InstallResult = {
    status: "updated";
} | {
    status: "failed" | "skipped";
    reason: string;
};
