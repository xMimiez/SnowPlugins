import type { PluginStore } from "../../storage";
import type { SdkContext } from "./definition";
import type { SdkState } from "./state";
type ExternalStore<T> = Omit<PluginStore<T>, "updateSettings"> & {
    updateSettings(patch: Partial<T>): Promise<void>;
};
export declare function createSdkStorage(context: SdkContext, state: SdkState): {
    createPluginStore<T extends object>(id: string, defaults: T): {
        useStore: import("zustand").UseBoundStore<import("zustand").StoreApi<ExternalStore<T>>>;
        settings: T;
    };
};
export {};
