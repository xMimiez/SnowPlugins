type Bound = ReturnType<typeof import("./source/packages/core/src/plugins/sdk/bindings").createHostBindings>["@snow/ui/alerts"];
export declare const openAlert: Bound["openAlert"];
export declare const dismissAlert: Bound["dismissAlert"];
export declare const showConfirmationAlert: Bound["showConfirmationAlert"];
export declare const showCustomAlert: Bound["showCustomAlert"];
export declare const showInputAlert: Bound["showInputAlert"];
export type { ConfirmationAlertOptions } from "./source/packages/ui/src/alerts";