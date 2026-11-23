import { ResourceScope } from "@snow-internal/core/runtime";
import { type InspectionPrivacyMode, type InspectionSessionStatus, type InspectionSessionSummary } from "@snow-internal/dev/protocol";
import { HandleStore } from "./handles";
export interface InspectionSession {
    ownerId: string;
    summary: InspectionSessionSummary;
    handles: HandleStore;
    scope: ResourceScope;
    reserveCapture(): boolean;
}
interface SessionResource {
    summary: {
        id: string;
        sessionId: string;
        createdAt: number;
        active: boolean;
    };
}
interface SessionResourceOptions<Resource> {
    kind: string;
    stop(resource: Resource): unknown;
    stopFailure(id: string): string;
    releaseFailure: string;
}
/**
 * Stoppable resources (probes, Flux captures) owned by inspection sessions.
 * Every resource is stopped when its session closes; each session keeps at
 * most `maximumRetainedResources` stopped ones, newest first.
 */
export declare class SessionResources<Resource extends SessionResource> {
    #private;
    constructor(options: SessionResourceOptions<Resource>);
    set(id: string, resource: Resource): void;
    delete(id: string): void;
    inSession(sessionId: string): Resource[];
    activeCount(sessionId: string): number;
    require(sessionId: string, id: string): Resource;
    register(session: InspectionSession): void;
    trim(sessionId: string): void;
    stopSafely(id: string): void;
}
export declare class InspectionCoordinator {
    #private;
    open(ownerId: string, options?: {
        durationMs?: number;
        privacy?: InspectionPrivacyMode;
    }): InspectionSessionSummary;
    list(ownerId: string): InspectionSessionSummary[];
    get(id: string, ownerId: string): InspectionSession;
    finish(id: string, ownerId: string, status?: Exclude<InspectionSessionStatus, "active">): Promise<InspectionSessionSummary>;
    releaseOwner(ownerId: string): Promise<void>;
    dispose(): Promise<void>;
    health(): {
        activeSessions: number;
        handles: number;
        resources: number;
        cleanupFailures: number;
    };
    snapshot(record: InspectionSession): InspectionSessionSummary;
}
export declare const inspectionCoordinator: InspectionCoordinator;
export {};
