import type { InstalledExternalPlugin } from "../external/installed-index";
import type { RepositoryPlugin } from "./index-format";
import { type RepositoriesState } from "./store";
/**
 * url and local: not repository installs. tracked: updates come from its repository. off: the
 * repository is off or not confirmed. withdrawn: the index no longer lists it. orphaned: the
 * repository was removed; adding the same URL again tracks it again.
 */
type ProvenanceState = "url" | "local" | "tracked" | "off" | "withdrawn" | "orphaned";
export declare function provenanceState(plugin: Pick<InstalledExternalPlugin, "provenance" | "sourceKind">, state?: RepositoriesState): ProvenanceState;
export declare function repositoryEntry(repository: string, id: string, state?: RepositoriesState): RepositoryPlugin | undefined;
/**
 * How many installed plugins, themes, and fonts came from this repository. Theme and font sources
 * stay recorded after they are removed, so the caller says which are still installed.
 */
export declare function installedFromRepository(repository: string, plugins: Iterable<Pick<InstalledExternalPlugin, "provenance">>, isInstalledAddon: (key: string) => boolean, state?: RepositoriesState): number;
export {};
