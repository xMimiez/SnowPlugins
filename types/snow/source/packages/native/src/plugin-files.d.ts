import { type NativeInboxCandidate, type NativeLocalPluginFiles } from "./bridge";
/** Opens Files for a plugin's manifest and bundle, checked and staged natively; null if cancelled. */
export declare function pickPluginFiles(signal?: AbortSignal): Promise<NativeLocalPluginFiles | null>;
/** Plugins waiting in Documents/snow/plugins/inbox; reading them installs nothing. */
export declare function listPluginInbox(): Promise<NativeInboxCandidate[]>;
export declare const stageInboxPlugin: (folder: string) => Promise<NativeLocalPluginFiles>;
