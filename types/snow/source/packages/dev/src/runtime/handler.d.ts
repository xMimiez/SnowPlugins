import type { DeviceOperationName, OperationParameters, RequestContext, SerializableValue } from "@snow-internal/dev/protocol";
import { type InspectionSession } from "./inspection/coordinator";
export interface DevelopmentHandlerContext {
    request: RequestContext;
    signal: AbortSignal;
}
/** Receives parameters already checked by validateOperationParameters. */
export type DevelopmentHandler<Name extends DeviceOperationName> = (params: OperationParameters<Name>, context: DevelopmentHandlerContext) => SerializableValue | undefined | Promise<SerializableValue | undefined>;
export type DevelopmentHandlers = {
    readonly [Name in DeviceOperationName]: DevelopmentHandler<Name>;
};
export declare function serializableResult(value: unknown): SerializableValue | undefined;
export declare function ownedSession(params: {
    sessionId: string;
}, context: DevelopmentHandlerContext): InspectionSession;
