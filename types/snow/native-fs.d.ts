type Bound = ReturnType<typeof import("./source/packages/core/src/plugins/sdk/bindings").createHostBindings>["@snow/native/fs"];
export declare const readFile: Bound["readFile"];
export declare const writeFile: Bound["writeFile"];
export declare const removeFile: Bound["removeFile"];
export declare const fileExists: Bound["fileExists"];
export declare const clearFolder: Bound["clearFolder"];
export declare const downloadFile: Bound["downloadFile"];