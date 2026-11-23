import { type NativeNotModified, type NativePluginArtifactDownload, type NativePluginArtifactDownloadOptions } from "./bridge";
/**
 * A successful file download stays staged until you commit or discard its token.
 * With returnText the result holds the text and cannot be committed as a file.
 */
export declare function downloadPluginArtifact(options: Omit<NativePluginArtifactDownloadOptions, "ifNoneMatch" | "ifModifiedSince">, signal?: AbortSignal): Promise<NativePluginArtifactDownload>;
/** A text request that may send cache validators and so may come back not modified. */
export declare const fetchConditionalText: (options: Omit<NativePluginArtifactDownloadOptions, "returnText" | "fileCommitPath">, signal?: AbortSignal) => Promise<NativeNotModified | NativePluginArtifactDownload>;
export declare const commitPluginArtifact: (runtimeId: string, artifact: NativePluginArtifactDownload) => Promise<{
    sha256: string;
    bytes: number;
}>;
/** relativePath must match the fileCommitPath given at download time. */
export declare const commitDownloadedFile: (token: string, relativePath: string, validation: "none" | "sfnt") => Promise<{
    sha256: string;
    bytes: number;
}>;
export declare const readPluginArtifact: (runtimeId: string, sha256: string) => Promise<{
    source: string;
    sha256: string;
    bytes: number;
}>;
export declare const removePluginArtifact: (runtimeId: string, sha256: string) => Promise<{
    removed: boolean;
}>;
export declare const discardPluginArtifact: (token: string) => Promise<undefined>;
export declare const recoverPluginArtifacts: () => Promise<{
    removedTemporaryFiles: number;
}>;
export declare const readPluginArtifactIndex: () => Promise<Record<string, unknown>>;
export declare const resetPluginArtifactIndex: () => Promise<{
    generation: number;
}>;
/** Rejects unless the stored generation equals expectedGeneration. The new index must use expectedGeneration + 1. */
export declare const writePluginArtifactIndex: (index: Record<string, unknown>, expectedGeneration: number) => Promise<{
    generation: number;
}>;
export declare const readPluginStartupMarker: () => Promise<Record<string, unknown>>;
export declare const writePluginStartupMarker: (marker: Record<string, unknown>) => Promise<null>;
export declare const clearPluginStartupMarker: () => Promise<null>;
export declare const hashPluginIdentity: (value: string) => Promise<string>;
