type Bound = ReturnType<typeof import("./source/packages/core/src/plugins/sdk/bindings").createHostBindings>["@snow/ui/settings"];
export declare const registerSettingsRow: Bound["registerSettingsRow"];
export declare const registerSettingsSection: Bound["registerSettingsSection"];
export declare const insertSettingsRow: Bound["insertSettingsRow"];
export type { SettingsRow, SettingsSection, SettingsIcon } from "./source/packages/ui/src/settings";