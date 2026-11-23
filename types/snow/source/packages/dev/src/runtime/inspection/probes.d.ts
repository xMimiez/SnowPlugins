import type { RemoteValue } from "@snow-internal/dev/protocol";
import { type InspectionSession } from "./coordinator";
type ProbePhase = "after" | "before" | "throw";
interface ProbeCapture {
    sequence: number;
    timestamp: number;
    phase: ProbePhase;
    thisValue?: RemoteValue;
    arguments?: RemoteValue;
    result?: RemoteValue;
    error?: RemoteValue;
}
interface ProbeSummary {
    id: string;
    sessionId: string;
    moduleId: string;
    path: string[];
    createdAt: number;
    expiresAt: number;
    captureLimit: number;
    captures: number;
    active: boolean;
}
interface ProbeTarget {
    moduleId: string;
    path: readonly string[];
    exports: unknown;
}
export declare class ProbeRegistry {
    #private;
    attach(session: InspectionSession, target: ProbeTarget, options?: {
        captureLimit?: number;
        ttlMs?: number;
    }): ProbeSummary;
    list(sessionId: string): ProbeSummary[];
    captures(sessionId: string, id: string): ProbeCapture[];
    stopOwned(sessionId: string, id: string): ProbeSummary;
}
export declare const probeRegistry: ProbeRegistry;
export {};
