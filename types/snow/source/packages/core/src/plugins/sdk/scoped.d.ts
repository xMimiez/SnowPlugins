import * as commands from "@snow-internal/api/commands";
import * as flux from "@snow-internal/api/flux";
import * as patcher from "@snow-internal/api/patcher";
import * as jsx from "@snow-internal/api/react/jsx";
import * as alerts from "@snow-internal/ui/alerts";
import { type ComponentProps, type ComponentType } from "react";
import type { SdkContext } from "./definition";
type JsxCallback = Parameters<typeof jsx.onJsxCreate>[1];
type JsxTarget = Parameters<typeof jsx.onJsxCreate>[0];
export declare function createScopedModules(context: SdkContext): {
    patcher: {
        before: patcher.PatchFn<(args: any[]) => unknown>;
        after: patcher.PatchFn<(args: any[], ret: any) => unknown>;
        instead: patcher.PatchFn<(args: any[], origFunc: Function) => unknown>;
    };
    commands: {
        registerCommand(command: Parameters<typeof commands.registerCommand>[0]): () => void;
    };
    flux: {
        dispatcher: import("@snow-internal/discord/common/types/flux").Dispatcher;
        subscribe(type: string, callback: Parameters<(actionType: string, callback: (payload: any) => void) => void>[1]): () => void;
        intercept(callback: Parameters<typeof flux.intercept>[0]): () => void;
    };
    jsx: {
        onJsxCreate(name: JsxTarget, callback: JsxCallback): void;
        deleteJsxCreate(name: JsxTarget, callback: JsxCallback): void;
    };
    sheets: {
        hideSheet: (key: string) => void | undefined;
        showSheet<T extends ComponentType<any>>(key: string, component: Promise<{
            default: T;
        }> | T, props?: ComponentProps<T>): void;
    };
    alerts: {
        dismissAlert(key: string): void;
        openAlert(key: string, content: unknown, onDismiss?: () => void): void;
        showCustomAlert(component: Parameters<typeof alerts.showCustomAlert>[0], props: Parameters<typeof alerts.showCustomAlert>[1]): string;
        showConfirmationAlert(options: alerts.ConfirmationAlertOptions): string;
        showInputAlert(options: Parameters<typeof alerts.showInputAlert>[0]): string;
    };
};
export {};
