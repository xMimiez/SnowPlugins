type Bound = ReturnType<typeof import("./source/packages/core/src/plugins/sdk/bindings").createHostBindings>["@snow/api/flux"];
export declare const dispatcher: Bound["dispatcher"];
export declare const subscribe: Bound["subscribe"];
export declare const intercept: Bound["intercept"];
export declare const interceptActions: Bound["interceptActions"];
export declare const isBlocked: Bound["isBlocked"];