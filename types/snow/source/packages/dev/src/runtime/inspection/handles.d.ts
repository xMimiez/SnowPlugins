import { type InspectionPrivacyMode, type RemotePropertyPage, type RemoteValue } from "@snow-internal/dev/protocol";
export declare class HandleStore {
    #private;
    constructor(maximumHandles: number, privacy: InspectionPrivacyMode);
    get size(): number;
    mirror(value: unknown, group?: string, key?: PropertyKey): RemoteValue;
    properties(handle: string, offset?: number, limit?: number): RemotePropertyPage;
    prototype(handle: string, depth?: number): RemoteValue[];
    release(handle: string): boolean;
    releaseGroup(group: string): number;
    clear(): void;
    value(handle: string): object;
}
