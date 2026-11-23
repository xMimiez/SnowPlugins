export type MetroCacheSlot = "current" | "previous";
export interface MetroCacheFiles {
    current: string | null;
    previous: string | null;
}
/**
 * Both module cache files in one synchronous native call. Undefined when the loader predates the
 * method; native returns null for a missing, oversized, or unreadable file.
 */
export declare function readMetroCacheFiles(): MetroCacheFiles | undefined;
/** Atomic when the loader supports it, otherwise through Discord's file module. */
export declare function writeMetroCacheFile(slot: MetroCacheSlot, text: string): Promise<void>;
