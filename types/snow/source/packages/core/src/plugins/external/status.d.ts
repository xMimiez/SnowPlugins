import { type ExternalPluginArtifactRecord } from "./installed-index";
export declare function recordPluginFailure(runtimeId: string, artifact: ExternalPluginArtifactRecord, phase: string, message: string, discardPending: boolean): Promise<void>;
export declare function recordPluginSuccess(runtimeId: string, artifact: ExternalPluginArtifactRecord, promotePending: boolean, enable?: boolean): Promise<void>;
/** Applies the startup marker left by a launch that stopped mid-startup. */
export declare function recoverIncompleteExternalStartup(): Promise<void>;
