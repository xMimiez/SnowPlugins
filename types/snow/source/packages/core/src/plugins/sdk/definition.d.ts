import type { ComponentType, ExoticComponent } from "react";
import type { PluginContext, PluginDefinition } from "../types";
import type { LibraryExport } from "./libraries";
export type ExternalPlugin = Pick<PluginDefinition, "start" | "stop" | "health"> & {
    settings?: ComponentType | ExoticComponent;
    /** Library plugins only: returns the API one consumer receives, once per consumer start. */
    exports?: LibraryExport;
};
export interface PluginIdentity {
    readonly id: string;
    readonly name: string;
    readonly version: string;
}
/** Read-only values for feature detection. Unknown Discord values are undefined. */
export interface PluginHost {
    readonly discordVersion?: string;
    readonly discordBuild?: string;
    readonly discordOtaBuild?: string;
    /** The Snow plugin API version, for example `1.0`. */
    readonly pluginApiVersion: string;
    /** Snow's display version. Do not parse it; branch on pluginApiVersion instead. */
    readonly snowVersion?: string;
}
export interface PluginModule {
    definePlugin<T extends ExternalPlugin>(definition: T): T;
    readonly plugin: PluginIdentity;
    readonly host: PluginHost;
    /** Lists a non-fatal error in the plugin's info sheet. The plugin keeps running. */
    reportError(error: unknown): void;
    readonly signal: AbortSignal;
    readonly logger: Pick<Console, "debug" | "info" | "log" | "warn" | "error">;
    onDispose(cleanup: () => unknown): () => unknown;
}
export type HostModules = Readonly<Record<string, object>>;
export interface PluginFactory {
    imports: Record<string, string[]>;
    create(modules: HostModules): ExternalPlugin;
}
export declare const commitPluginState: unique symbol;
export type SdkDefinition = PluginDefinition & {
    exports?: LibraryExport;
    [commitPluginState](): Promise<void>;
};
export interface SdkContext extends PluginContext {
    identity: PluginIdentity;
    assertActive(): void;
}
