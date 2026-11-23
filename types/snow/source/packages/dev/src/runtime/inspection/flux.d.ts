import type { RemoteValue } from "@snow-internal/dev/protocol";
import { type InspectionSession } from "./coordinator";
interface FluxDispatcherLike {
    subscribe(type: string, listener: (payload: unknown) => void): void;
    unsubscribe(type: string, listener: (payload: unknown) => void): void;
}
interface FluxCapture {
    sequence: number;
    timestamp: number;
    type: string;
    payload: RemoteValue;
}
interface FluxCaptureSummary {
    id: string;
    sessionId: string;
    types: string[];
    createdAt: number;
    expiresAt: number;
    captureLimit: number;
    captures: number;
    active: boolean;
}
export declare class FluxInspector {
    #private;
    constructor(dispatcher: FluxDispatcherLike);
    types(): string[];
    listeners(): Array<{
        type: string;
        listeners: number;
    }>;
    start(session: InspectionSession, requestedTypes: readonly string[], options?: {
        captureLimit?: number;
        ttlMs?: number;
    }): FluxCaptureSummary;
    list(sessionId: string): FluxCaptureSummary[];
    events(sessionId: string, id: string): FluxCapture[];
    stopOwned(sessionId: string, id: string): FluxCaptureSummary;
}
export {};
