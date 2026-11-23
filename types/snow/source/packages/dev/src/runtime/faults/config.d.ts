export interface FluxFault {
    action: string;
    /** throw: a subscriber throws. block: Snow's Flux interceptor drops the action. */
    mode: "throw" | "block";
}
/** Documents/snow/dev-faults.json. Every key is optional. */
export interface DevFaults {
    /** Faults stay off in safe mode unless set, so a safe launch can recover from them. */
    applyInSafeMode: boolean;
    snowInitThrows: boolean;
    flux: FluxFault[];
    waitForThrows: boolean;
    storeGetterThrows?: {
        store: string;
        getter: string;
    };
    insteadThrows: boolean;
    appStartThrows: boolean;
    rejections: boolean;
    startBusyMs: number;
    startThrows: string[];
    startHangs: string[];
    moduleFactoryThrows: number[];
    fatalAfterMs?: number;
    renderThrows?: {
        component: string;
        channelId?: string;
    };
    actionSheetReport: boolean;
    testReports: number;
}
interface ParsedDevFaults {
    faults: DevFaults;
    /** Keys that were ignored, and why. */
    problems: string[];
}
/** Keeps every valid key and lists the rest, so one typo does not void the whole file. */
export declare function parseDevFaults(value: unknown): ParsedDevFaults;
export {};
