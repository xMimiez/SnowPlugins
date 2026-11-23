import { type CustomAssetDefinition } from "./assets";
import type { AssetOverrideSource } from "./assets/overrides";
import { type AssetRegistrationCallback } from "./assets/patches";
import { isBlocked, type Intercept, type InterceptOptions } from "./flux";
import { type JsxHooks, type JsxTarget } from "./react/jsx";
import { type PluginScope } from "./scope";
/**
 * Runtime registrations that stop with the plugin: each joins the plugin's scope, stops running
 * once its signal aborts, and has its failures attributed to the plugin.
 */
export declare function createRuntimeBindings(context: PluginScope): {
    flux: {
        intercept(callback: Intercept, options?: InterceptOptions): () => void;
        interceptActions(types: string | readonly string[], callback: Intercept, options?: InterceptOptions): () => void;
        isBlocked: typeof isBlocked;
    };
    jsx: {
        hookJsx(target: JsxTarget, hooks: JsxHooks, options?: {
            priority?: number;
        }): () => void;
    };
    patcher: {
        PatchPriority: {
            readonly EARLIEST: 1000;
            readonly EARLY: 500;
            readonly DEFAULT: 0;
            readonly LATE: -500;
            readonly LATEST: -1000;
        };
    };
    assets: {
        overrideAsset(target: number | string, source: AssetOverrideSource): () => void;
        registerCustomAsset(definition: CustomAssetDefinition): {
            id: number;
            dispose: () => void;
        };
        onAssetRegistered(callback: AssetRegistrationCallback, name?: string): () => void;
    };
};
