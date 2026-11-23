export * as utils from "./utils";
export * as api from "@snow-internal/api/index.js";
export * as metro from "@snow-internal/discord";
export { runtimeCoordinator as runtime } from "@snow-internal/core/runtime";
declare const _disposer: Array<() => unknown>;
export declare function unload(): void;
export declare namespace unload {
    var push: (fn: (typeof _disposer)[number]) => void;
}
