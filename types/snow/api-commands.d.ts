type Bound = ReturnType<typeof import("./source/packages/core/src/plugins/sdk/bindings").createHostBindings>["@snow/api/commands"];
export declare const registerCommand: Bound["registerCommand"];