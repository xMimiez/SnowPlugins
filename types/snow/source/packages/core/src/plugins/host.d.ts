import type { PluginHostValues } from "./requirements";
interface PluginHostInfo extends PluginHostValues {
    /** Snow's display version, for example `v0.3.0 Beta`. Never used for gating. */
    snowVersion?: string;
    /** Changes whenever the running Snow bundle changes. */
    snowRelease?: string;
    /** Changes whenever Discord's JavaScript bundle changes (embedded or a new OTA). */
    discordBundle?: string;
}
/**
 * Reads Discord's client info and Snow's build once per launch; neither changes while the process
 * runs. A missing module or key stays unknown, which only the `*` range accepts. Never substitute
 * a placeholder.
 */
export declare function loadPluginHostValues(): Promise<void>;
export declare const getPluginHostValues: () => PluginHostInfo;
export {};
