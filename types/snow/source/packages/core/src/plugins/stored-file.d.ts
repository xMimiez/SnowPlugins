import type { PersistStorage } from "zustand/middleware";
import type { Recovered } from "./stored-shapes";
/**
 * Persist storage that checks the saved shape on read. A file that is not JSON or has the
 * wrong shape is kept as it was in one `<name>.invalid.json` copy, and the store starts from
 * what the parser recovered. None of these stores migrate, so the stored version is not used.
 */
export declare function validatedFileStorage<S>(path: string, parse: (state: unknown) => Recovered<S>): PersistStorage<S>;
