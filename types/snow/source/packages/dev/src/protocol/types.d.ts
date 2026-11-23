export declare const PROTOCOL_VERSION: 1;
export declare const MAX_FRAME_BYTES: number;
export declare const MAX_RESPONSE_BYTES: number;
export declare const MAX_REQUEST_ID_LENGTH = 96;
export type ConnectionRole = "device" | "controller";
export declare const CAPABILITIES: readonly ["flux.read", "inspection.read", "inspection.write", "logs.read", "metro.read", "native.read", "plugins.read", "plugins.write", "react.read", "runtime.read", "runtime.reload", "stores.read", "themes.read", "themes.write"];
export type Capability = (typeof CAPABILITIES)[number];
export type ErrorCode = "AUTHENTICATION_FAILED" | "CAPABILITY_DENIED" | "INCOMPATIBLE_CLIENT" | "INVALID_MESSAGE" | "INVALID_PARAMS" | "NOT_FOUND" | "REQUEST_CANCELLED" | "REQUEST_FAILED" | "RESPONSE_TOO_LARGE" | "REQUEST_TIMEOUT" | "UNSUPPORTED_OPERATION";
export interface ProtocolError {
    code: ErrorCode;
    message: string;
    details?: SerializableValue;
}
export interface ClientIdentity {
    role: ConnectionRole;
    sessionId: string;
    clientId: string;
    protocolVersion: typeof PROTOCOL_VERSION;
    capabilities: Capability[];
    token: string;
}
export interface RuntimeIdentity {
    buildId: string;
    snowVersion: string;
    discordVersion: string;
    discordBuild: string;
    hermesBytecodeVersion: number;
    reactNativeVersion: string;
    platform: "ios";
}
export interface RuntimeReadyPayload {
    identity: RuntimeIdentity;
    recoveredFrom?: "embedded" | "previous";
}
export interface RuntimeHealthPayload {
    phase: string;
    connectedAt: number;
    pluginCount: number;
    runningPluginCount: number;
    resourceCount: number;
    /** Added for plugin repositories; absent on older runtimes. */
    repositories?: RepositoryHealthPayload;
}
/** The repositories section of runtime.health. Times are epoch milliseconds. */
export interface RepositoryHealthPayload {
    loaded: boolean;
    /** The list file could not be read and was moved aside. */
    listReset: boolean;
    count: number;
    lastBackgroundCheckAt: number | null;
    repositories: {
        /** The index URL with any query string replaced by an ellipsis. */
        url: string;
        name: string | null;
        state: "on" | "off" | "untrusted" | "host-changed";
        trustedHost: string | null;
        servedFrom: string | null;
        refreshing: boolean;
        cached: boolean;
        cacheAgeMs: number | null;
        etag: string | null;
        entries: {
            plugins: number;
            themes: number;
            fonts: number;
        };
        skipped: number;
        lastAttemptAt: number | null;
        lastSuccessAt: number | null;
        lastError: string | null;
        failures: number;
        /** The last automatic refresh skipped Low Data Mode or a network other than Wi-Fi. */
        skippedAt: number | null;
        skippedReason: string | null;
    }[];
    /** Update discovery from cached indexes. */
    updates?: RepositoryUpdatesPayload;
}
export interface RepositoryUpdatesPayload {
    /** When the rows were last computed from cached indexes; null before the first time. */
    computedAt: number | null;
    /** Tracked plugins pinned to a version; they never get rows. */
    pinned: number;
    updates: {
        id: string;
        from: string;
        to: string;
        kind: "update" | "rollback" | "changed";
        repository: string;
        manifestSha256: string;
        /** Includes new dependencies. */
        bytes: number | null;
        appliesWhenOn: boolean;
        newDependencies: string[];
        /** Why the row cannot be selected, or null. */
        blocked: string | null;
    }[];
}
/** Fields plugins.inspect adds to the plugin it describes. */
export interface PluginSourcePayload {
    external: {
        format: "snow" | "vendetta" | "bunny";
        enabled: boolean;
        quarantined: boolean;
        version: string;
        pendingVersion: string | null;
        sha256: string;
        manifestSha256: string;
        sourceKind: "url" | "local-file";
        manifestUrl: string | null;
        requestedManifestUrl: string | null;
        provenance: {
            repository: string;
            entryId: string;
            channel: string | null;
            pinned: string | null;
            linkedAt: number;
        } | null;
        provenanceState: "url" | "local" | "tracked" | "off" | "withdrawn" | "orphaned";
    } | null;
    requires: {
        discord: string;
        discordBuild: string;
        pluginApi: string;
    } | null;
    dependencies: string[];
    optionalDependencies: string[];
    ranges: Record<string, string>;
    library: boolean;
    /** For a library: plugins currently connected to it. */
    consumers: string[];
    libraries: {
        id: string;
        connected: boolean;
    }[];
    startFailure: SerializableValue | null;
}
export interface PluginSummary {
    id: string;
    name: string;
    version: string;
    enabled: boolean;
    reload: "plugin" | "process" | "native";
    state: string;
    resourceCount: number;
}
export interface LogEventPayload {
    level: "debug" | "info" | "warn" | "error";
    message: SerializableValue[];
    timestamp: number;
    source?: string;
    stack?: string;
}
export type SerializablePrimitive = boolean | null | number | string;
export type SerializableValue = SerializablePrimitive | SerializableValue[] | {
    [key: string]: SerializableValue;
};
export interface HelloMessage {
    type: "hello";
    identity: ClientIdentity;
}
export interface AcceptedMessage {
    type: "accepted";
    sessionId: string;
    protocolVersion: typeof PROTOCOL_VERSION;
    heartbeatIntervalMs: number;
    credential?: string;
}
export interface RejectedMessage {
    type: "rejected";
    error: ProtocolError;
}
export interface RequestMessage {
    type: "request";
    id: string;
    operation: string;
    params?: SerializableValue;
    timeoutMs?: number;
    context?: RequestContext;
}
export interface RequestContext {
    ownerId: string;
}
export interface ResponseMessage {
    type: "response";
    id: string;
    result?: SerializableValue;
    error?: ProtocolError;
}
export interface EventMessage {
    type: "event";
    event: string;
    data?: SerializableValue;
}
export interface CancelMessage {
    type: "cancel";
    id: string;
}
export interface PingMessage {
    type: "ping";
    timestamp: number;
}
export interface PongMessage {
    type: "pong";
    timestamp: number;
}
export type ClientMessage = HelloMessage | RequestMessage | ResponseMessage | EventMessage | CancelMessage | PingMessage | PongMessage;
export type ServerMessage = AcceptedMessage | RejectedMessage | CancelMessage | RequestMessage | ResponseMessage | EventMessage | PingMessage | PongMessage;
export type ProtocolMessage = ClientMessage | ServerMessage;
export interface BuildArtifact {
    path: string;
    sha256: string;
    size: number;
    contentType: string;
}
export interface BuildManifest {
    schemaVersion: 2;
    buildId: string;
    createdAt: string;
    mode: "development" | "production";
    version: string;
    revision: string;
    discord: {
        version: string;
        build: string;
    };
    hermesBytecodeVersion: number;
    artifacts: BuildArtifact[];
}
