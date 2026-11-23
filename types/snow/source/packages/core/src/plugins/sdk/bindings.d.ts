import React from "react";
import ReactNative from "react-native";
import * as jsxRuntime from "react/jsx-runtime";
import * as assets from "@snow-internal/api/assets";
import * as commandTypes from "@snow-internal/api/commands/types";
import * as utils from "@snow-internal/api/lib/utils";
import * as lazy from "@snow-internal/api/lib/utils/lazy";
import * as discord from "@snow-internal/discord";
import * as discordComponents from "@snow-internal/discord/common/components";
import * as stores from "@snow-internal/discord/common/stores";
import { reloadSnow } from "@snow-internal/native/reload";
import * as ui from "@snow-internal/ui";
import * as components from "@snow-internal/ui/components";
import * as colors from "@snow-internal/ui/components/color";
import * as styles from "@snow-internal/ui/styles";
import * as toasts from "@snow-internal/ui/toasts";
import type { PluginModule, SdkContext } from "./definition";
import type { SdkState } from "./state";
export declare function createHostBindings(context: SdkContext, state: SdkState): {
    "@snow/plugin": PluginModule;
    react: typeof React;
    "react-native": typeof ReactNative;
    "react/jsx-runtime": typeof jsxRuntime;
    "react/jsx-dev-runtime": {
        Fragment: React.ExoticComponent<React.FragmentProps>;
        jsx(type: React.ElementType, props: unknown, key?: React.Key): React.ReactElement;
        jsxs(type: React.ElementType, props: unknown, key?: React.Key): React.ReactElement;
        jsxDEV: typeof jsxRuntime.jsx;
    };
    "@snow/discord": {
        findModule<A extends unknown[]>(filter: import("@snow-internal/discord/types").FilterFn<A>, { scope }?: discord.LookupOptions): Partial<{
            id: number;
            defaultExport: boolean;
        }>;
        findModuleId<A extends unknown[]>(filter: import("@snow-internal/discord/types").FilterFn<A>, options?: discord.LookupOptions): number | undefined;
        findExports<A extends unknown[]>(filter: import("@snow-internal/discord/types").FilterFn<A>, options?: discord.LookupOptions): any;
        findAllModule<A extends unknown[]>(filter: import("@snow-internal/discord/types").FilterFn<A>): {
            id: number;
            defaultExport: boolean;
        }[];
        findAllModuleId<A extends unknown[]>(filter: import("@snow-internal/discord/types").FilterFn<A>): number[];
        findAllExports<A extends unknown[]>(filter: import("@snow-internal/discord/types").FilterFn<A>): any[];
        lookupFilePath: typeof discord.lookupFilePath;
        getStoreNames: typeof discord.getStoreNames;
        findByProps: <T = any>(...props: string[]) => T;
        findByPropsLazy: <T = any>(...props: string[]) => T;
        findByPropsAll: <T = any>(...props: string[]) => T[];
        findByName: <T = any>(name: string, expDefault?: boolean) => T;
        findByNameLazy: <T = any>(name: string, expDefault?: boolean) => T;
        findByNameAll: <T = any>(name: string, expDefault?: boolean) => T[];
        findByDisplayName: <T = any>(name: string, expDefault?: boolean) => T;
        findByDisplayNameLazy: <T = any>(name: string, expDefault?: boolean) => T;
        findByDisplayNameAll: <T = any>(name: string, expDefault?: boolean) => T[];
        findByTypeName: <T = any>(name: string, expDefault?: boolean) => T;
        findByTypeNameLazy: <T = any>(name: string, expDefault?: boolean) => T;
        findByTypeNameAll: <T = any>(name: string, expDefault?: boolean) => T[];
        findByStoreName: <T = any>(name: string) => T;
        findByStoreNameLazy: <T = any>(name: string) => T;
        getStore: <T = any>(name: string) => T | undefined;
        findByFilePath<T = any>(path: string, expDefault?: boolean): T;
        findByFilePathLazy: <T = any>(path: string, expDefault?: boolean) => T;
        findByTypeDisplayName: <T = any>(name: string, expDefault?: boolean) => T;
        findByTypeDisplayNameLazy: <T = any>(name: string, expDefault?: boolean) => T;
        findByTypeDisplayNameAll: <T = any>(name: string, expDefault?: boolean) => T[];
        factories: typeof discord.factories;
        filters: typeof discord.filters;
        lazy: typeof discord.lazy;
        waitFor(filter: import("@snow-internal/discord/types").FilterFn<any[]> | import("@snow-internal/discord/internals/wait").ModuleFilter, callback: (result: any, id: number) => void, options?: import("@snow-internal/discord/internals/wait").WaitForOptions): () => void;
        waitForModule(filter: import("@snow-internal/discord/types").FilterFn<any[]> | import("@snow-internal/discord/internals/wait").ModuleFilter, { signal, timeout }?: import("@snow-internal/discord/internals/wait").WaitForModuleOptions): Promise<any>;
        waitForStore(name: string, callback: (store: any) => void): () => void;
        findByStoreNameAsync(name: string, options?: import("@snow-internal/discord/internals/wait").WaitPromiseOptions): Promise<unknown>;
        waitForFilePath(path: string, callback: (exports: any, id: number) => void): () => void;
        findByFilePathAsync(path: string, options?: import("@snow-internal/discord/internals/wait").WaitPromiseOptions): Promise<unknown>;
        common: {
            components: typeof discordComponents;
            constants: any;
            channels: any;
            i18n: {
                Messages: any;
            };
            clipboard: any;
            assets: any;
            invites: any;
            commands: any;
            navigation: any;
            toasts: {
                open(key: string, toast: {
                    text: string;
                    icon?: React.ComponentType<import("@snow-internal/discord/icons").DiscordIconProps>;
                }): void;
                close(): void;
            };
            messageUtil: any;
            messageActions: any;
            replyActions: any;
            chatInput: any;
            MessageView: any;
            navigationStack: any;
            NavigationNative: any;
            semver: any;
            moment: any;
            chroma: any;
            lodash: any;
            util: any;
            tokens: any;
            useToken: any;
            url: any;
            Flux: any;
            FluxUtils: any;
            React: typeof React;
            ReactNative: typeof ReactNative;
            FluxDispatcher: import("@snow-internal/discord/common/types/flux").Dispatcher;
        };
    };
    "@snow/discord/common": {
        components: typeof discordComponents;
        constants: any;
        channels: any;
        i18n: {
            Messages: any;
        };
        clipboard: any;
        assets: any;
        invites: any;
        commands: any;
        navigation: any;
        toasts: {
            open(key: string, toast: {
                text: string;
                icon?: React.ComponentType<import("@snow-internal/discord/icons").DiscordIconProps>;
            }): void;
            close(): void;
        };
        messageUtil: any;
        messageActions: any;
        replyActions: any;
        chatInput: any;
        MessageView: any;
        navigationStack: any;
        NavigationNative: any;
        semver: any;
        moment: any;
        chroma: any;
        lodash: any;
        util: any;
        tokens: any;
        useToken: any;
        url: any;
        Flux: any;
        FluxUtils: any;
        React: typeof React;
        ReactNative: typeof ReactNative;
        FluxDispatcher: import("@snow-internal/discord/common/types/flux").Dispatcher;
    };
    "@snow/discord/common/stores": typeof stores;
    "@snow/discord/common/components": typeof discordComponents;
    "@snow/discord/wrappers": {
        lookupFilePath: typeof discord.lookupFilePath;
        getStoreNames: typeof discord.getStoreNames;
        findByProps: <T = any>(...props: string[]) => T;
        findByPropsLazy: <T = any>(...props: string[]) => T;
        findByPropsAll: <T = any>(...props: string[]) => T[];
        findByName: <T = any>(name: string, expDefault?: boolean) => T;
        findByNameLazy: <T = any>(name: string, expDefault?: boolean) => T;
        findByNameAll: <T = any>(name: string, expDefault?: boolean) => T[];
        findByDisplayName: <T = any>(name: string, expDefault?: boolean) => T;
        findByDisplayNameLazy: <T = any>(name: string, expDefault?: boolean) => T;
        findByDisplayNameAll: <T = any>(name: string, expDefault?: boolean) => T[];
        findByTypeName: <T = any>(name: string, expDefault?: boolean) => T;
        findByTypeNameLazy: <T = any>(name: string, expDefault?: boolean) => T;
        findByTypeNameAll: <T = any>(name: string, expDefault?: boolean) => T[];
        findByStoreName: <T = any>(name: string) => T;
        findByStoreNameLazy: <T = any>(name: string) => T;
        getStore: <T = any>(name: string) => T | undefined;
        findByFilePath<T = any>(path: string, expDefault?: boolean): T;
        findByFilePathLazy: <T = any>(path: string, expDefault?: boolean) => T;
        findByTypeDisplayName: <T = any>(name: string, expDefault?: boolean) => T;
        findByTypeDisplayNameLazy: <T = any>(name: string, expDefault?: boolean) => T;
        findByTypeDisplayNameAll: <T = any>(name: string, expDefault?: boolean) => T[];
        waitForStore(name: string, callback: (store: any) => void): () => void;
        findByStoreNameAsync(name: string, options?: import("@snow-internal/discord/internals/wait").WaitPromiseOptions): Promise<unknown>;
        waitForFilePath(path: string, callback: (exports: any, id: number) => void): () => void;
        findByFilePathAsync(path: string, options?: import("@snow-internal/discord/internals/wait").WaitPromiseOptions): Promise<unknown>;
    };
    "@snow/discord/finders": {
        findModule<A extends unknown[]>(filter: import("@snow-internal/discord/types").FilterFn<A>, { scope }?: discord.LookupOptions): Partial<{
            id: number;
            defaultExport: boolean;
        }>;
        findModuleId<A extends unknown[]>(filter: import("@snow-internal/discord/types").FilterFn<A>, options?: discord.LookupOptions): number | undefined;
        findExports<A extends unknown[]>(filter: import("@snow-internal/discord/types").FilterFn<A>, options?: discord.LookupOptions): any;
        findAllModule<A extends unknown[]>(filter: import("@snow-internal/discord/types").FilterFn<A>): {
            id: number;
            defaultExport: boolean;
        }[];
        findAllModuleId<A extends unknown[]>(filter: import("@snow-internal/discord/types").FilterFn<A>): number[];
        findAllExports<A extends unknown[]>(filter: import("@snow-internal/discord/types").FilterFn<A>): any[];
        waitFor(filter: import("@snow-internal/discord/types").FilterFn<any[]> | import("@snow-internal/discord/internals/wait").ModuleFilter, callback: (result: any, id: number) => void, options?: import("@snow-internal/discord/internals/wait").WaitForOptions): () => void;
        waitForModule(filter: import("@snow-internal/discord/types").FilterFn<any[]> | import("@snow-internal/discord/internals/wait").ModuleFilter, { signal, timeout }?: import("@snow-internal/discord/internals/wait").WaitForModuleOptions): Promise<any>;
    };
    "@snow/discord/filters": typeof discord.filters;
    "@snow/discord/factories": typeof discord.factories;
    "@snow/discord/lazy": typeof discord.lazy;
    "@snow/ui": {
        components: typeof components;
        styles: typeof styles;
        toasts: typeof toasts;
        openPluginInstaller: typeof ui.openPluginInstaller;
        Icon: typeof ui.Icon;
        RowIcon: typeof ui.RowIcon;
        alerts: {
            dismissAlert(key: string): void;
            openAlert(key: string, content: unknown, onDismiss?: () => void): void;
            showCustomAlert(component: Parameters<typeof ui.alerts.showCustomAlert>[0], props: Parameters<typeof ui.alerts.showCustomAlert>[1]): string;
            showConfirmationAlert(options: ui.alerts.ConfirmationAlertOptions): string;
            showInputAlert(options: Parameters<typeof ui.alerts.showInputAlert>[0]): string;
        };
        sheets: {
            hideSheet: (key: string) => void | undefined;
            showSheet<T extends React.ComponentType<any>>(key: string, component: Promise<{
                default: T;
            }> | T, props?: React.ComponentProps<T>): void;
        };
        settings: {
            registerSettingsRow(id: string, row: ui.settings.SettingsRow): () => void;
            registerSettingsSection(id: string, section: ui.settings.SettingsSection): () => void;
            insertSettingsRow(sectionId: string, rowId: string, index?: number): () => void;
        };
    };
    "@snow/ui/components": typeof components;
    "@snow/ui/components/wrappers": typeof components.wrappers;
    "@snow/ui/components/Buttons": {
        Button: typeof components.Button;
        IconButton: typeof components.IconButton;
        FloatingActionButton: typeof components.FloatingActionButton;
    };
    "@snow/ui/components/Icon": {
        default: typeof ui.Icon;
    };
    "@snow/ui/components/RowIcon": {
        default: typeof ui.RowIcon;
    };
    "@snow/ui/components/SettingsPage": {
        default: typeof components.SettingsPage;
    };
    "@snow/ui/components/TextInputRow": {
        default: typeof components.TextInputRow;
    };
    "@snow/ui/components/color": typeof colors;
    "@snow/ui/styles": typeof styles;
    "@snow/ui/toasts": typeof toasts;
    "@snow/ui/alerts": {
        dismissAlert(key: string): void;
        openAlert(key: string, content: unknown, onDismiss?: () => void): void;
        showCustomAlert(component: Parameters<typeof ui.alerts.showCustomAlert>[0], props: Parameters<typeof ui.alerts.showCustomAlert>[1]): string;
        showConfirmationAlert(options: ui.alerts.ConfirmationAlertOptions): string;
        showInputAlert(options: Parameters<typeof ui.alerts.showInputAlert>[0]): string;
    };
    "@snow/ui/sheets": {
        hideSheet: (key: string) => void | undefined;
        showSheet<T extends React.ComponentType<any>>(key: string, component: Promise<{
            default: T;
        }> | T, props?: React.ComponentProps<T>): void;
    };
    "@snow/ui/settings": {
        registerSettingsRow(id: string, row: ui.settings.SettingsRow): () => void;
        registerSettingsSection(id: string, section: ui.settings.SettingsSection): () => void;
        insertSettingsRow(sectionId: string, rowId: string, index?: number): () => void;
    };
    "@snow/api": {
        assets: {
            registeredAssets: typeof assets.registeredAssets;
            PREFERRED_ASSET_TYPE: "png";
            scheduleAssetIndex(): void;
            getAssetByName(name: string, type?: string): assets.Asset | undefined;
            iterateAssets(): Generator<assets.Asset>;
            findAsset(id: number): assets.Asset | undefined;
            findAsset(name: string): assets.Asset | undefined;
            findAsset(filter: (a: assets.Asset) => boolean): assets.Asset | undefined;
            filterAssets(param: string | ((a: assets.Asset) => boolean)): assets.Asset[];
            findAssetId(name: string): number | undefined;
            getAssetIndexSummary(): {
                complete: boolean;
                names: number;
                multipleTypes: number;
            };
            overrideAsset(target: number | string, source: assets.AssetOverrideSource): () => void;
            registerCustomAsset(definition: assets.CustomAssetDefinition): {
                id: number;
                dispose: () => void;
            };
            onAssetRegistered(callback: assets.AssetRegistrationCallback, name?: string): () => void;
        };
        patcher: {
            PatchPriority: {
                readonly EARLIEST: 1000;
                readonly EARLY: 500;
                readonly DEFAULT: 0;
                readonly LATE: -500;
                readonly LATEST: -1000;
            };
            before: import("@snow-internal/api/patcher").PatchFn<(args: any[]) => unknown>;
            after: import("@snow-internal/api/patcher").PatchFn<(args: any[], ret: any) => unknown>;
            instead: import("@snow-internal/api/patcher").PatchFn<(args: any[], origFunc: Function) => unknown>;
        };
        flux: {
            intercept(callback: import("@snow-internal/api/flux").Intercept, options?: import("@snow-internal/api/flux").InterceptOptions): () => void;
            interceptActions(types: string | readonly string[], callback: import("@snow-internal/api/flux").Intercept, options?: import("@snow-internal/api/flux").InterceptOptions): () => void;
            isBlocked: typeof import("@snow-internal/api/flux").isBlocked;
            dispatcher: import("@snow-internal/discord/common/types/flux").Dispatcher;
            subscribe(type: string, callback: Parameters<(actionType: string, callback: (payload: any) => void) => void>[1]): () => void;
        };
        react: {
            jsx: {
                hookJsx(target: import("@snow-internal/api/react/jsx").JsxTarget, hooks: import("@snow-internal/api/react/jsx").JsxHooks, options?: {
                    priority?: number;
                }): () => void;
                onJsxCreate(name: import("@snow-internal/api/react/jsx").JsxTarget, callback: (Component: any, ret: jsxRuntime.JSX.Element) => jsxRuntime.JSX.Element | void): void;
                deleteJsxCreate(name: import("@snow-internal/api/react/jsx").JsxTarget, callback: (Component: any, ret: jsxRuntime.JSX.Element) => jsxRuntime.JSX.Element | void): void;
            };
        };
        ui: {
            components: typeof components;
            styles: typeof styles;
            toasts: typeof toasts;
            openPluginInstaller: typeof ui.openPluginInstaller;
            Icon: typeof ui.Icon;
            RowIcon: typeof ui.RowIcon;
            alerts: {
                dismissAlert(key: string): void;
                openAlert(key: string, content: unknown, onDismiss?: () => void): void;
                showCustomAlert(component: Parameters<typeof ui.alerts.showCustomAlert>[0], props: Parameters<typeof ui.alerts.showCustomAlert>[1]): string;
                showConfirmationAlert(options: ui.alerts.ConfirmationAlertOptions): string;
                showInputAlert(options: Parameters<typeof ui.alerts.showInputAlert>[0]): string;
            };
            sheets: {
                hideSheet: (key: string) => void | undefined;
                showSheet<T extends React.ComponentType<any>>(key: string, component: Promise<{
                    default: T;
                }> | T, props?: React.ComponentProps<T>): void;
            };
            settings: {
                registerSettingsRow(id: string, row: ui.settings.SettingsRow): () => void;
                registerSettingsSection(id: string, section: ui.settings.SettingsSection): () => void;
                insertSettingsRow(sectionId: string, rowId: string, index?: number): () => void;
            };
        };
        native: {
            fs: {
                readFile: (name: string, options?: Parameters<typeof import("@snow-internal/native/fs").readFile>[1]) => Promise<string>;
                writeFile: (name: string, contents: string) => Promise<void>;
                removeFile: (name: string) => Promise<undefined>;
                fileExists: (name: string) => Promise<boolean>;
                clearFolder: (name: string) => Promise<undefined>;
                downloadFile(url: string, name: string, options?: Parameters<typeof import("@snow-internal/native/fs").downloadFile>[2]): Promise<import("@snow-internal/native/fs").DownloadResult>;
            };
            reloadSnow: typeof reloadSnow;
        };
    };
    "@snow/api/patcher": {
        PatchPriority: {
            readonly EARLIEST: 1000;
            readonly EARLY: 500;
            readonly DEFAULT: 0;
            readonly LATE: -500;
            readonly LATEST: -1000;
        };
        before: import("@snow-internal/api/patcher").PatchFn<(args: any[]) => unknown>;
        after: import("@snow-internal/api/patcher").PatchFn<(args: any[], ret: any) => unknown>;
        instead: import("@snow-internal/api/patcher").PatchFn<(args: any[], origFunc: Function) => unknown>;
    };
    "@snow/api/commands": {
        registerCommand(command: Parameters<typeof import("@snow-internal/api/commands").registerCommand>[0]): () => void;
    };
    "@snow/api/commands/types": typeof commandTypes;
    "@snow/api/flux": {
        intercept(callback: import("@snow-internal/api/flux").Intercept, options?: import("@snow-internal/api/flux").InterceptOptions): () => void;
        interceptActions(types: string | readonly string[], callback: import("@snow-internal/api/flux").Intercept, options?: import("@snow-internal/api/flux").InterceptOptions): () => void;
        isBlocked: typeof import("@snow-internal/api/flux").isBlocked;
        dispatcher: import("@snow-internal/discord/common/types/flux").Dispatcher;
        subscribe(type: string, callback: Parameters<(actionType: string, callback: (payload: any) => void) => void>[1]): () => void;
    };
    "@snow/api/react": {
        jsx: {
            hookJsx(target: import("@snow-internal/api/react/jsx").JsxTarget, hooks: import("@snow-internal/api/react/jsx").JsxHooks, options?: {
                priority?: number;
            }): () => void;
            onJsxCreate(name: import("@snow-internal/api/react/jsx").JsxTarget, callback: (Component: any, ret: jsxRuntime.JSX.Element) => jsxRuntime.JSX.Element | void): void;
            deleteJsxCreate(name: import("@snow-internal/api/react/jsx").JsxTarget, callback: (Component: any, ret: jsxRuntime.JSX.Element) => jsxRuntime.JSX.Element | void): void;
        };
    };
    "@snow/api/react/jsx": {
        hookJsx(target: import("@snow-internal/api/react/jsx").JsxTarget, hooks: import("@snow-internal/api/react/jsx").JsxHooks, options?: {
            priority?: number;
        }): () => void;
        onJsxCreate(name: import("@snow-internal/api/react/jsx").JsxTarget, callback: (Component: any, ret: jsxRuntime.JSX.Element) => jsxRuntime.JSX.Element | void): void;
        deleteJsxCreate(name: import("@snow-internal/api/react/jsx").JsxTarget, callback: (Component: any, ret: jsxRuntime.JSX.Element) => jsxRuntime.JSX.Element | void): void;
    };
    "@snow/api/assets": {
        registeredAssets: typeof assets.registeredAssets;
        PREFERRED_ASSET_TYPE: "png";
        scheduleAssetIndex(): void;
        getAssetByName(name: string, type?: string): assets.Asset | undefined;
        iterateAssets(): Generator<assets.Asset>;
        findAsset(id: number): assets.Asset | undefined;
        findAsset(name: string): assets.Asset | undefined;
        findAsset(filter: (a: assets.Asset) => boolean): assets.Asset | undefined;
        filterAssets(param: string | ((a: assets.Asset) => boolean)): assets.Asset[];
        findAssetId(name: string): number | undefined;
        getAssetIndexSummary(): {
            complete: boolean;
            names: number;
            multipleTypes: number;
        };
        overrideAsset(target: number | string, source: assets.AssetOverrideSource): () => void;
        registerCustomAsset(definition: assets.CustomAssetDefinition): {
            id: number;
            dispose: () => void;
        };
        onAssetRegistered(callback: assets.AssetRegistrationCallback, name?: string): () => void;
    };
    "@snow/api/lib/utils": typeof utils;
    "@snow/api/lib/utils/lazy": typeof lazy;
    "@snow/core/storage": {
        createPluginStore<T extends object>(id: string, defaults: T): {
            useStore: import("zustand").UseBoundStore<import("zustand").StoreApi<Omit<import("../../storage").PluginStore<T>, "updateSettings"> & {
                updateSettings(patch: Partial<T>): Promise<void>;
            }>>;
            settings: T;
        };
    };
    "@snow/native": {
        fs: {
            readFile: (name: string, options?: Parameters<typeof import("@snow-internal/native/fs").readFile>[1]) => Promise<string>;
            writeFile: (name: string, contents: string) => Promise<void>;
            removeFile: (name: string) => Promise<undefined>;
            fileExists: (name: string) => Promise<boolean>;
            clearFolder: (name: string) => Promise<undefined>;
            downloadFile(url: string, name: string, options?: Parameters<typeof import("@snow-internal/native/fs").downloadFile>[2]): Promise<import("@snow-internal/native/fs").DownloadResult>;
        };
        reloadSnow: typeof reloadSnow;
    };
    "@snow/native/fs": {
        readFile: (name: string, options?: Parameters<typeof import("@snow-internal/native/fs").readFile>[1]) => Promise<string>;
        writeFile: (name: string, contents: string) => Promise<void>;
        removeFile: (name: string) => Promise<undefined>;
        fileExists: (name: string) => Promise<boolean>;
        clearFolder: (name: string) => Promise<undefined>;
        downloadFile(url: string, name: string, options?: Parameters<typeof import("@snow-internal/native/fs").downloadFile>[2]): Promise<import("@snow-internal/native/fs").DownloadResult>;
    };
};
