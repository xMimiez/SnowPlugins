type Bound = ReturnType<typeof import("./source/packages/core/src/plugins/sdk/bindings").createHostBindings>["@snow/api/patcher"];
export declare const before: Bound["before"];
export declare const after: Bound["after"];
export declare const instead: Bound["instead"];
export declare const PatchPriority: Bound["PatchPriority"];
export type * from "./source/packages/api/src/runtime/patcher";