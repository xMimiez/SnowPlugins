type Bound = ReturnType<typeof import("./source/packages/core/src/plugins/sdk/bindings").createHostBindings>["@snow/api"];
export declare const assets: Bound["assets"];
export declare const patcher: Bound["patcher"];
export declare const flux: Bound["flux"];
export declare const react: Bound["react"];
export declare const ui: Bound["ui"];
export declare const native: Bound["native"];