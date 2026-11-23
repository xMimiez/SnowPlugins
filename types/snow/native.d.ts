type Bound = ReturnType<typeof import("./source/packages/core/src/plugins/sdk/bindings").createHostBindings>["@snow/native"];
export declare const fs: Bound["fs"];
export declare const reloadSnow: Bound["reloadSnow"];