import { type SerializableValue } from "@snow-internal/dev/protocol";
import type { FluxInspector } from "./flux";
import type { ProbeRegistry } from "./probes";
interface InspectionTimelineEvent {
    source: "flux" | "probe";
    sourceId: string;
    timestamp: number;
    sequence: number;
    type: string;
    data: SerializableValue;
}
export declare function inspectionTimeline(sessionId: string, probes: ProbeRegistry, flux: FluxInspector, options?: {
    after?: number;
    before?: number;
    limit?: number;
}): InspectionTimelineEvent[];
export {};
