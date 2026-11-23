type FaultFile = "absent" | "applied" | "unreadable" | "skipped-in-safe-mode";
/**
 * Dev builds only. Reads Documents/snow/dev-faults.json once, after eager plugins and before the
 * rest start, and applies each fault it lists. Nothing happens without the file.
 */
export declare function applyDevFaults(): Promise<void>;
export declare const getDevFaultsStatus: () => {
    file: FaultFile;
    applied: string[];
    problems: string[];
};
export {};
