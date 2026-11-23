import { type LogEventPayload } from "@snow-internal/dev/protocol";
export interface DevelopmentConnectionOptions {
    url: string;
    sessionId: string;
    token: string;
    clientId: string;
    onCredential?(credential: string): void;
}
export declare class DevelopmentClient {
    #private;
    constructor(options: DevelopmentConnectionOptions);
    get connected(): boolean;
    start(): void;
    stop(): void;
    log(payload: LogEventPayload): void;
}
export declare function connectDevelopmentRuntimeFromPairing(pairingUrl: string, clientId: string, onCredential?: (credential: string) => void): void;
export declare function disconnectDevelopmentRuntime(): void;
export declare function isDevelopmentRuntimeConnected(): boolean;
export declare function emitDevelopmentLog(level: LogEventPayload["level"], message: unknown[], source?: string, stack?: string): void;
