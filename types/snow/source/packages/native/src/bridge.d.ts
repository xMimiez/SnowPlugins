import type { NativeBundleState } from "./loader";
import type { MetroCacheFiles, MetroCacheSlot } from "./metro-cache";
import type { UpdateChannel, UpdateReleaseSummary, UpdateStatus } from "./modules/update";
export interface NativeBridgeMethods {
    "backup.paths": {
        args: [];
        result: string[];
    };
    "backup.snapshot": {
        args: [paths: string[]];
        result: Record<string, string | null>;
    };
    "backup.status": {
        args: [];
        result: {
            pending: boolean;
            resetPending?: boolean;
            error: string | null;
        };
    };
    "backup.stage": {
        args: [files: Record<string, string | null>, expected: Record<string, string | null>];
        result: null;
    };
    "settings.reset": {
        args: [];
        result: null;
    };
    "backup.pick": {
        args: [];
        result: {
            requestId: string;
        };
    };
    "backup.poll": {
        args: [requestId: string];
        result: {
            ready: boolean;
            text?: string;
            cancelled?: boolean;
            error?: string;
        };
    };
    "backup.cancel": {
        args: [requestId: string];
        result: null;
    };
    "applemusic.get": {
        args: [];
        result: {
            authorization: "authorized";
            playing: false;
        } | {
            authorization: "authorized";
            playing: true;
            song: {
                album: string | null;
                artist: string | null;
                duration: {
                    elapsed: number;
                    total: number;
                };
                title: string | null;
            };
        } | {
            authorization: "denied" | "notDetermined" | "restricted";
        };
    };
    "applemusic.request": {
        args: [];
        result: null;
    };
    "messageLogger.setMarks": {
        args: [
            deletedIds: string[],
            textColor: number | null,
            removedSlots: Record<string, number[]>,
            removedFiles: Record<string, number[]>
        ];
        result: null;
    };
    "metroCache.read": {
        args: [];
        result: MetroCacheFiles;
    };
    "metroCache.write": {
        args: [slot: MetroCacheSlot, text: string];
        result: null;
    };
    "inspector.request": {
        args: [kind: NativeInspectionKind, options: NativeInspectionOptions | NativeHitTestOptions];
        result: {
            requestId?: string;
            error?: string;
        };
    };
    "inspector.poll": {
        args: [requestId: string];
        result: {
            ready: false;
        } | {
            ready: true;
            result?: NativeInspectionSnapshot | NativeHitTestResult;
            error?: string;
        } | {
            error: string;
        };
    };
    "inspector.cancel": {
        args: [requestId: string];
        result: {
            cancelled: boolean;
        };
    };
    "pluginArtifacts.request": {
        args: [options: NativePluginArtifactDownloadOptions];
        result: {
            requestId: string;
        };
    };
    "pluginArtifacts.poll": {
        args: [requestId: string];
        result: {
            ready: false;
        } | {
            ready: true;
            result: NativePluginArtifactDownload | NativeNotModified;
        } | {
            ready: true;
            error: string;
        } | {
            error: string;
        };
    };
    "pluginArtifacts.cancel": {
        args: [requestId: string];
        result: {
            cancelled: boolean;
        };
    };
    "pluginArtifacts.commit": {
        args: [runtimeId: string, requestId: string, expectedSha256: string, expectedBytes: number];
        result: {
            sha256: string;
            bytes: number;
        };
    };
    "pluginArtifacts.commitFile": {
        args: [requestId: string, relativePath: string, validation: "none" | "sfnt"];
        result: {
            sha256: string;
            bytes: number;
        };
    };
    "pluginArtifacts.read": {
        args: [runtimeId: string, sha256: string];
        result: {
            source: string;
            sha256: string;
            bytes: number;
        };
    };
    "pluginArtifacts.remove": {
        args: [runtimeId: string, sha256: string];
        result: {
            removed: boolean;
        };
    };
    "pluginArtifacts.recover": {
        args: [];
        result: {
            removedTemporaryFiles: number;
        };
    };
    "pluginArtifacts.readIndex": {
        args: [];
        result: Record<string, unknown>;
    };
    "pluginArtifacts.resetIndex": {
        args: [];
        result: {
            generation: number;
        };
    };
    "pluginArtifacts.writeIndex": {
        args: [index: Record<string, unknown>, expectedGeneration: number];
        result: {
            generation: number;
        };
    };
    "pluginArtifacts.readStartup": {
        args: [];
        result: Record<string, unknown>;
    };
    "pluginArtifacts.writeStartup": {
        args: [marker: Record<string, unknown>];
        result: null;
    };
    "pluginArtifacts.clearStartup": {
        args: [];
        result: null;
    };
    "pluginArtifacts.hashText": {
        args: [text: string];
        result: string;
    };
    "pluginFiles.pick": {
        args: [];
        result: {
            requestId: string;
        };
    };
    "pluginFiles.poll": {
        args: [requestId: string];
        result: {
            ready: false;
        } | {
            ready: true;
            cancelled: true;
        } | {
            ready: true;
            error: string;
        } | {
            ready: true;
            result: NativeLocalPluginFiles;
        };
    };
    "pluginFiles.cancel": {
        args: [requestId: string];
        result: null;
    };
    "pluginFiles.inbox": {
        args: [];
        result: {
            candidates: NativeInboxCandidate[];
        };
    };
    "pluginFiles.stageInbox": {
        args: [folder: string];
        result: NativeLocalPluginFiles;
    };
    "updater.clear": {
        args: [];
        result: null;
    };
    "updater.download": {
        args: [];
        result: null;
    };
    "updater.reload": {
        args: [];
        result: null;
    };
    "updater.status": {
        args: [];
        result: NativeBundleState;
    };
    "updater.snapshot": {
        args: [];
        result: UpdateStatus;
    };
    "events.ready": {
        args: [];
        result: null;
    };
    "events.watchUpdater": {
        args: [enabled: boolean];
        result: null;
    };
    "events.updaterSnapshot": {
        args: [];
        result: {
            status: UpdateStatus | null;
            sequence: number;
        };
    };
    "updater.check": {
        args: [];
        result: UpdateStatus;
    };
    "updater.checkDue": {
        args: [];
        result: UpdateStatus;
    };
    "updater.consumeNotice": {
        args: [];
        result: UpdateReleaseSummary | null;
    };
    "updater.stage": {
        args: [releaseId: string, allowDowngrade: boolean];
        result: UpdateStatus;
    };
    "updater.cancel": {
        args: [operationId: number];
        result: UpdateStatus;
    };
    "updater.channel": {
        args: [channel: UpdateChannel];
        result: UpdateStatus;
    };
    "updater.close": {
        args: [];
        result: null;
    };
    "updater.reset": {
        args: [];
        result: UpdateStatus;
    };
    "updater.official": {
        args: [];
        result: UpdateStatus;
    };
    "updater.reject": {
        args: [];
        result: null;
    };
    "updater.confirm": {
        args: [releaseId: string];
        result: null;
    };
}
export interface NativePluginArtifactDownloadOptions {
    url: string;
    maxBytes: number;
    timeoutMs?: number;
    expectedSha256?: string;
    expectedBytes?: number;
    returnText?: boolean;
    fileCommitPath?: string;
    /** Text requests only: sent as If-None-Match. Printable ASCII, at most 512 bytes. */
    ifNoneMatch?: string;
    /** Text requests only: sent as If-Modified-Since when there is no ETag. */
    ifModifiedSince?: string;
    /** Text requests only. False skips Low Data Mode and expensive networks. Defaults to true. */
    allowConstrainedNetwork?: boolean;
}
/** A checked manifest and its bundle, staged like a finished download with empty URLs. */
export interface NativeLocalPluginFiles {
    manifest: string;
    artifact: NativePluginArtifactDownload;
}
/** An inbox folder ("" is the inbox itself) with a manifest; error says why it cannot install. */
export interface NativeInboxCandidate {
    folder: string;
    manifest?: string;
    sha256?: string;
    error?: string;
}
export interface NativePluginArtifactDownload {
    token: string;
    requestedUrl: string;
    resolvedUrl: string;
    sha256: string;
    bytes: number;
    text?: string;
    /** Text results only, when the server sent them. */
    etag?: string;
    lastModified?: string;
}
/** A conditional text request the server answered with 304. */
export interface NativeNotModified {
    notModified: true;
    requestedUrl: string;
    resolvedUrl: string;
}
export interface NativeInspectionOptions {
    includeValues: boolean;
    maximumDepth: number;
    maximumNodes: number;
}
export interface NativeHitTestOptions {
    includeValues: boolean;
    x: number;
    y: number;
}
export type NativeInspectionKind = "accessibility" | "hitTest" | "windows";
export interface NativeHitTestResult {
    point: {
        x: number;
        y: number;
    };
    hit: boolean;
    ancestry: NativeInspectionNode[];
    valuesIncluded: boolean;
    mapping: "native-only";
}
export interface NativeInspectionRedactedValue {
    kind: "redacted";
    reason: "sensitive-value";
    type: "string";
}
export type NativeInspectionStringValue = string | null | NativeInspectionRedactedValue;
interface NativeInspectionNodeBase {
    kind: "accessibility" | "view";
    class: string;
    frame: {
        x: number;
        y: number;
        width: number;
        height: number;
    };
    accessibility: {
        element: boolean;
        hasIdentifier: boolean;
        hasLabel: boolean;
        hasHint: boolean;
        traits: number;
        identifier?: NativeInspectionStringValue;
        label?: NativeInspectionStringValue;
        hint?: NativeInspectionStringValue;
        value?: NativeInspectionStringValue;
    };
    children: NativeInspectionNode[];
    truncated: boolean;
}
export interface NativeAccessibilityInspectionNode extends NativeInspectionNodeBase {
    kind: "accessibility";
    hidden?: boolean;
    alpha?: number;
}
export interface NativeViewInspectionNode extends NativeInspectionNodeBase {
    kind: "view";
    bounds: {
        x: number;
        y: number;
        width: number;
        height: number;
    };
    hidden: boolean;
    alpha: number;
    userInteractionEnabled: boolean;
}
export type NativeInspectionNode = NativeAccessibilityInspectionNode | NativeViewInspectionNode;
export interface NativeInspectionSnapshot {
    windows: NativeInspectionNode[];
    visited: number;
    maximumDepth: number;
    maximumNodes: number;
    truncated: boolean;
    valuesIncluded: boolean;
}
export type NativeBridgeMethod = keyof NativeBridgeMethods;
export interface NativeBridgePayload<M extends NativeBridgeMethod = NativeBridgeMethod> {
    snow: {
        args: NativeBridgeMethods[M]["args"];
        method: M;
    };
}
export type NativeBridgeResponse<T> = {
    error: string;
} | {
    result: T;
};
export interface SnowNativeBridge {
    call<M extends NativeBridgeMethod>(payload: NativeBridgePayload<M>): Promise<NativeBridgeResponse<NativeBridgeMethods[M]["result"]>>;
    callSync<M extends NativeBridgeMethod>(payload: NativeBridgePayload<M>): NativeBridgeResponse<NativeBridgeMethods[M]["result"]>;
}
export declare class NativeBridgeError extends Error {
    readonly method: NativeBridgeMethod;
    constructor(method: NativeBridgeMethod, message: string, options?: ErrorOptions);
}
export declare function hasNativeBridge(): boolean;
/**
 * Rejects with NativeBridgeError on a failed call. Method-specific error fields
 * inside a successful result are left for the caller.
 */
export declare function callNative<M extends NativeBridgeMethod>(method: M, ...args: NativeBridgeMethods[M]["args"]): Promise<NativeBridgeMethods[M]["result"]>;
export declare function callNativeInspector(kind: "hitTest", options: NativeHitTestOptions, signal?: AbortSignal): Promise<NativeHitTestResult>;
export declare function callNativeInspector(kind: "accessibility" | "windows", options: NativeInspectionOptions, signal?: AbortSignal): Promise<NativeInspectionSnapshot>;
/** The AbortError thrown by cancelled bridge calls. */
export declare function nativeAbortError(message: string): Error;
/** Rejects with an AbortError if the signal aborts first. */
export declare function cancellableDelay(delayMs: number, signal: AbortSignal | undefined, abortError: () => Error): Promise<void>;
/** Same as callNative but blocks the JS thread. */
export declare function callNativeSync<M extends NativeBridgeMethod>(method: M, ...args: NativeBridgeMethods[M]["args"]): NativeBridgeMethods[M]["result"];
export {};
