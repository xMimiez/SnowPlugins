import { filterAssets, findAsset, findAssetId, iterateAssets, type Asset } from "@snow-internal/api/assets";
import * as patcher from "@snow-internal/api/patcher";
import { findInReactTree, findInTree, safeFetch } from "@snow-internal/api/lib/utils";
import { findByDisplayName, findByDisplayNameAll, findByDisplayNameLazy, findByFilePath, findByFilePathLazy, findByName, findByNameAll, findByNameLazy, findByProps, findByPropsAll, findByPropsLazy, findByStoreName, findByStoreNameLazy, findByTypeName, findByTypeNameAll, findByTypeNameLazy, factories as metroFactories } from "@snow-internal/discord";
import * as discordComponents from "@snow-internal/discord/common/components";
import { showConfirmationAlert, showCustomAlert, showInputAlert } from "@snow-internal/ui/alerts";
import * as snowComponents from "@snow-internal/ui/components";
import * as sheets from "@snow-internal/ui/sheets";
import { createLegacyClassComponentStyles, createStyles } from "@snow-internal/ui/styles";
import { showToast } from "@snow-internal/ui/toasts";
import { jsx, jsxs } from "react/jsx-runtime";
import type { SnowApplicationCommand } from "@snow-internal/api/commands/types";
import type { ResourceScope } from "../../runtime";
import type { ParsedExternalPluginManifest } from "../manifest";
import type { CompatibilityStorage } from "./storage";
export interface CompatibilityFacadeOptions {
    manifest: ParsedExternalPluginManifest;
    scope: ResourceScope;
    storage: CompatibilityStorage;
}
declare function createThemedStyleSheet<T extends Record<string, unknown>>(sheet: T): T;
export declare function createCompatibilityFacade(options: CompatibilityFacadeOptions): Readonly<{
    profile: "bunny-spec3-kettu-2026-08-27" | "vendetta-kettu-2026-08-27";
    version: "bunny-spec3-kettu-2026-08-27" | "vendetta-kettu-2026-08-27";
    constants: Readonly<{
        DISCORD_SERVER: "https://discord.gg/n9QQ4XhhJP";
        DISCORD_SERVER_ID: "1015931589865246730";
        GITHUB: "https://github.com/vendetta-mod";
        HTTP_REGEX: RegExp;
        HTTP_REGEX_MULTI: RegExp;
        PLUGINS_CHANNEL_ID: "1091880384561684561";
        PROXY_PREFIX: "https://vd-plugins.github.io/proxy";
        THEMES_CHANNEL_ID: "1091880434939482202";
    }>;
    React: typeof globalThis.React;
    ReactNative: typeof import("react-native");
    react: typeof globalThis.React;
    colors: Readonly<{
        semantic: Record<string, any>;
        raw: Record<string, string>;
    }>;
    api: Readonly<{
        assets: Readonly<{
            readonly all: Record<string, Asset>;
            find: typeof findAsset;
            filterAssets: typeof filterAssets;
            findAsset: typeof findAsset;
            findAssetId: typeof findAssetId;
            iterateAssets: typeof iterateAssets;
            getAssetByName: (name: string) => Asset | undefined;
            getAssetByID: (assetId: number) => Asset | undefined;
            getAssetIDByName: typeof findAssetId;
            getAssetId: typeof findAssetId;
        }>;
        commands: Readonly<{
            registerCommand(command: SnowApplicationCommand): import("../../runtime").Cleanup;
        }>;
        debug: Readonly<{
            connectToDebugger: () => never;
            getDebugInfo: () => Readonly<{
                loader: "Snow";
                profile: "bunny-spec3-kettu-2026-08-27" | "vendetta-kettu-2026-08-27";
            }>;
        }>;
        flux: Readonly<{
            dispatcher: import("@snow-internal/discord/common/types/flux").Dispatcher;
            intercept(callback: (payload: Record<string, unknown> & {
                type: string;
            }) => unknown): import("../../runtime").Cleanup;
            subscribe(type: string, callback: (payload: unknown) => void): () => void;
        }>;
        native: {};
        patcher: Readonly<{
            before: ((func: string, parent: any, callback: (args: any[]) => unknown, options?: boolean | patcher.PatchOptions | undefined) => import("../../runtime").Cleanup) & {
                await: (func: string, parent: Promise<unknown>, callback: (args: any[]) => unknown, options?: boolean | patcher.PatchOptions | undefined) => import("../../runtime").Cleanup;
            };
            after: ((func: string, parent: any, callback: (args: any[], ret: any) => unknown, options?: boolean | patcher.PatchOptions | undefined) => import("../../runtime").Cleanup) & {
                await: (func: string, parent: Promise<unknown>, callback: (args: any[], ret: any) => unknown, options?: boolean | patcher.PatchOptions | undefined) => import("../../runtime").Cleanup;
            };
            instead: ((func: string, parent: any, callback: (args: any[], origFunc: Function) => unknown, options?: boolean | patcher.PatchOptions | undefined) => import("../../runtime").Cleanup) & {
                await: (func: string, parent: Promise<unknown>, callback: (args: any[], origFunc: Function) => unknown, options?: boolean | patcher.PatchOptions | undefined) => import("../../runtime").Cleanup;
            };
        }>;
        react: Readonly<{
            jsx: Readonly<{
                onJsxCreate(component: string, callback: (Component: any, ret: import("react").JSX.Element) => import("react").JSX.Element | void): void;
                deleteJsxCreate(component: string, callback: (Component: any, ret: import("react").JSX.Element) => import("react").JSX.Element | void): void;
            }>;
        }>;
        settings: Readonly<{}>;
        storage: Readonly<{
            createStorage(): never;
            useProxy(value?: object): object;
            useObservable(values: unknown[]): void;
            flush: () => Promise<void>;
        }>;
    }>;
    plugin: Readonly<{
        id: string;
        manifest: import("../manifest").BunnyPluginManifest | import("../manifest").VendettaPluginManifest | import("../manifest").SnowPluginDistributionManifest;
        logger: Readonly<{
            log: (...values: unknown[]) => void;
            info: (...values: unknown[]) => void;
            warn: (...values: unknown[]) => void;
            error: (...values: unknown[]) => void;
            debug: (...values: unknown[]) => void;
        }>;
        storage: Record<string, unknown>;
        createStorage<T extends Record<string, unknown>>(initial?: T): T;
        useProxy: <U extends object = Record<string, unknown>>(value?: U | undefined) => U;
        flushStorage: () => Promise<void>;
        install: () => never;
        update: () => never;
        remove: () => never;
    }>;
    plugins: Readonly<{
        readonly plugins: {
            [k: string]: Readonly<{
                id: string;
                name: string;
                version: string;
                enabled: boolean;
            }>;
        };
        fetchPlugin: () => never;
        installPlugin: () => never;
        removePlugin: () => never;
        startPlugin: (pluginId: string) => Promise<void>;
        stopPlugin: (pluginId: string) => Promise<void>;
        getSettings: (pluginId: string) => (() => import("react").JSX.Element) | undefined;
    }> | Readonly<{
        isCorePlugin: (pluginId: string) => boolean;
        isPluginInstalled: (pluginId: string) => boolean;
        isPluginEnabled: (pluginId: string) => boolean;
        getPluginSettingsComponent: (pluginId: string) => (() => import("react").JSX.Element) | null;
    }>;
    pluginManager: Readonly<{
        get(pluginId: string): Readonly<{
            id: string;
            name: string;
            version: string;
            enabled: boolean;
        }> | undefined;
        list(): Readonly<{
            id: string;
            name: string;
            version: string;
            enabled: boolean;
        }>[];
        startCurrent(): Promise<void>;
        stopCurrent(): Promise<void>;
    }>;
    managers: Readonly<{
        plugins: Readonly<{
            get(pluginId: string): Readonly<{
                id: string;
                name: string;
                version: string;
                enabled: boolean;
            }> | undefined;
            list(): Readonly<{
                id: string;
                name: string;
                version: string;
                enabled: boolean;
            }>[];
            startCurrent(): Promise<void>;
            stopCurrent(): Promise<void>;
        }> | Readonly<{
            readonly plugins: {
                [k: string]: Readonly<{
                    id: string;
                    name: string;
                    version: string;
                    enabled: boolean;
                }>;
            };
            fetchPlugin: () => never;
            installPlugin: () => never;
            removePlugin: () => never;
            startPlugin: (pluginId: string) => Promise<void>;
            stopPlugin: (pluginId: string) => Promise<void>;
            getSettings: (pluginId: string) => (() => import("react").JSX.Element) | undefined;
        }> | Readonly<{
            isCorePlugin: (pluginId: string) => boolean;
            isPluginInstalled: (pluginId: string) => boolean;
            isPluginEnabled: (pluginId: string) => boolean;
            getPluginSettingsComponent: (pluginId: string) => (() => import("react").JSX.Element) | null;
        }>;
    }>;
    storage: Readonly<{
        createStorage(): never;
        useProxy(value?: object): object;
        useObservable(values: unknown[]): void;
        flush: () => Promise<void>;
    }>;
    patcher: Readonly<{
        before: ((func: string, parent: any, callback: (args: any[]) => unknown, options?: boolean | patcher.PatchOptions | undefined) => import("../../runtime").Cleanup) & {
            await: (func: string, parent: Promise<unknown>, callback: (args: any[]) => unknown, options?: boolean | patcher.PatchOptions | undefined) => import("../../runtime").Cleanup;
        };
        after: ((func: string, parent: any, callback: (args: any[], ret: any) => unknown, options?: boolean | patcher.PatchOptions | undefined) => import("../../runtime").Cleanup) & {
            await: (func: string, parent: Promise<unknown>, callback: (args: any[], ret: any) => unknown, options?: boolean | patcher.PatchOptions | undefined) => import("../../runtime").Cleanup;
        };
        instead: ((func: string, parent: any, callback: (args: any[], origFunc: Function) => unknown, options?: boolean | patcher.PatchOptions | undefined) => import("../../runtime").Cleanup) & {
            await: (func: string, parent: Promise<unknown>, callback: (args: any[], origFunc: Function) => unknown, options?: boolean | patcher.PatchOptions | undefined) => import("../../runtime").Cleanup;
        };
    }>;
    commands: Readonly<{
        registerCommand(command: SnowApplicationCommand): import("../../runtime").Cleanup;
    }>;
    flux: Readonly<{
        dispatcher: import("@snow-internal/discord/common/types/flux").Dispatcher;
        intercept(callback: (payload: Record<string, unknown> & {
            type: string;
        }) => unknown): import("../../runtime").Cleanup;
        subscribe(type: string, callback: (payload: unknown) => void): () => void;
    }>;
    metro: Readonly<{
        find: (filter: Parameters<(filter: Parameters<typeof metroFactories.createSimpleFilter>[0]) => import("@snow-internal/discord/types").FilterFn<unknown[]>>[0]) => any;
        findAll: (filter: Parameters<(filter: Parameters<typeof metroFactories.createSimpleFilter>[0]) => import("@snow-internal/discord/types").FilterFn<unknown[]>>[0]) => any[];
        findByProps: typeof findByProps;
        findByPropsAll: typeof findByPropsAll;
        findByPropsLazy: (...args: Parameters<typeof findByPropsLazy>) => any;
        findByName: typeof findByName;
        findByNameAll: typeof findByNameAll;
        findByNameLazy: (...args: Parameters<typeof findByNameLazy>) => any;
        findByDisplayName: typeof findByDisplayName;
        findByDisplayNameAll: typeof findByDisplayNameAll;
        findByDisplayNameLazy: (...args: Parameters<typeof findByDisplayNameLazy>) => any;
        findByFilePath: typeof findByFilePath;
        findByFilePathLazy: (...args: Parameters<typeof findByFilePathLazy>) => any;
        findByTypeName: typeof findByTypeName;
        findByTypeNameAll: typeof findByTypeNameAll;
        findByTypeNameLazy: (...args: Parameters<typeof findByTypeNameLazy>) => any;
        findByStoreName: typeof findByStoreName;
        findByStoreNameLazy: (...args: Parameters<typeof findByStoreNameLazy>) => any;
        common: Readonly<{
            React: typeof globalThis.React;
            ReactNative: typeof import("react-native");
            Flux: any;
            FluxDispatcher: import("@snow-internal/discord/common/types/flux").Dispatcher;
            NavigationNative: any;
            assets: any;
            channels: any;
            chroma: any;
            clipboard: any;
            commands: any;
            components: typeof discordComponents;
            constants: any;
            i18n: {
                Messages: any;
            };
            invites: any;
            lodash: any;
            moment: any;
            navigation: any;
            navigationStack: any;
            stylesheet: Readonly<{
                createStyles: typeof createStyles;
                createThemedStyleSheet: typeof createThemedStyleSheet;
            }>;
            tokens: any;
            toasts: {
                open(key: string, toast: {
                    text: string;
                    icon?: import("react").ComponentType<import("@snow-internal/discord/icons").DiscordIconProps>;
                }): void;
                close(): void;
            };
            url: any;
            util: any;
        }>;
    }>;
    logger: Readonly<{
        log: (...values: unknown[]) => void;
        info: (...values: unknown[]) => void;
        warn: (...values: unknown[]) => void;
        error: (...values: unknown[]) => void;
        debug: (...values: unknown[]) => void;
    }>;
    _jsx: Readonly<{
        Fragment: import("react").ExoticComponent<import("react").FragmentProps>;
        jsx: typeof jsx;
        jsxs: typeof jsxs;
    }>;
    assets: Readonly<{
        readonly all: Record<string, Asset>;
        find: typeof findAsset;
        filterAssets: typeof filterAssets;
        findAsset: typeof findAsset;
        findAssetId: typeof findAssetId;
        iterateAssets: typeof iterateAssets;
        getAssetByName: (name: string) => Asset | undefined;
        getAssetByID: (assetId: number) => Asset | undefined;
        getAssetIDByName: typeof findAssetId;
        getAssetId: typeof findAssetId;
    }>;
    ui: Readonly<{
        dismissAlert: (key: string) => void;
        openAlert: (key: string, content: unknown) => void;
        alerts: Readonly<{
            showConfirmationAlert: typeof showConfirmationAlert;
            showCustomAlert: typeof showCustomAlert;
            showInputAlert: typeof showInputAlert;
        }>;
        assets: Readonly<{
            readonly all: Record<string, Asset>;
            find: typeof findAsset;
            filterAssets: typeof filterAssets;
            findAsset: typeof findAsset;
            findAssetId: typeof findAssetId;
            iterateAssets: typeof iterateAssets;
            getAssetByName: (name: string) => Asset | undefined;
            getAssetByID: (assetId: number) => Asset | undefined;
            getAssetIDByName: typeof findAssetId;
            getAssetId: typeof findAssetId;
        }>;
        components: Readonly<{
            LegacyAlert: any;
            CompatButton: any;
            HelpMessage: any;
            NotificationProgress: import("@snow-internal/discord/common/types/components").NotificationProgress;
            SafeAreaView: any;
            SafeAreaProvider: any;
            useSafeAreaInsets: any;
            contextMenu: any;
            ActionSheetRow: any;
            TwinButtons: import("@snow-internal/discord/common/types/components").TwinButtons;
            RowButton: import("@snow-internal/discord/common/types/components").RowButton;
            PressableScale: any;
            TableRow: import("@snow-internal/discord/common/types/components").TableRow;
            TableRowIcon: import("@snow-internal/discord/common/types/components").TableRowIcon;
            SvgXml: typeof import("react-native-svg").SvgXml;
            TableRowTrailingText: import("@snow-internal/discord/common/types/components").TableRowTrailingText;
            TableRowGroup: import("@snow-internal/discord/common/types/components").TableRowGroup;
            TableRadioGroup: import("@snow-internal/discord/common/types/components").TableRadioGroup;
            TableRadioRow: import("@snow-internal/discord/common/types/components").TableRadioRow;
            TableSwitchRow: import("@snow-internal/discord/common/types/components").TableSwitchRow;
            TableCheckboxRow: import("@snow-internal/discord/common/types/components").TableCheckboxRow;
            TableSwitch: any;
            TableRadio: any;
            TableCheckbox: any;
            FormSwitch: any;
            FormRadio: any;
            FormCheckbox: any;
            Card: any;
            RedesignCompat: any;
            AlertModal: any;
            AlertActionButton: any;
            AlertActions: any;
            AvatarPile: any;
            ContextMenu: import("@snow-internal/discord/common/types/components").ContextMenu;
            Stack: import("@snow-internal/discord/common/types/components").Stack;
            Avatar: any;
            TextInput: import("@snow-internal/discord/common/types/components").TextInput;
            TextArea: any;
            Slider: import("@snow-internal/discord/common/types/components").Slider;
            SegmentedControl: import("@snow-internal/discord/common/types/components").SegmentedControl;
            SegmentedControlPages: import("@snow-internal/discord/common/types/components").SegmentedControlPages;
            useSegmentedControlState: (arg: import("@snow-internal/discord/common/types/components").SegmentedControlStateArgs) => import("@snow-internal/discord/common/types/components").SegmentedControlState;
            CompatSegmentedControl: import("@snow-internal/discord/common/types/components").CompatSegmentedControl;
            ActionSheet: import("@snow-internal/discord/common/types/components").ActionSheet;
            BottomSheetScrollView: typeof import("react-native").ScrollView;
            BottomSheetTitleHeader: any;
            Text: import("@snow-internal/discord/common/types/components").Text;
            Forms: any;
            LegacyForm: any;
            LegacyFormArrow: any;
            LegacyFormCTA: any;
            LegacyFormCTAButton: any;
            LegacyFormCardSection: any;
            LegacyFormCheckbox: any;
            LegacyFormCheckboxRow: any;
            LegacyFormCheckmark: any;
            LegacyFormDivider: any;
            LegacyFormHint: any;
            LegacyFormIcon: any;
            LegacyFormInput: any;
            LegacyFormLabel: any;
            LegacyFormRadio: any;
            LegacyFormRadioGroup: any;
            LegacyFormRadioRow: any;
            LegacyFormRow: any;
            LegacyFormSection: any;
            LegacyFormSelect: any;
            LegacyFormSliderRow: any;
            LegacyFormSubLabel: any;
            LegacyFormSwitch: any;
            LegacyFormSwitchRow: any;
            LegacyFormTernaryCheckBox: any;
            LegacyFormText: any;
            LegacyFormTitle: any;
            FlashList: any;
            wrappers: typeof snowComponents.wrappers;
            Codeblock: typeof snowComponents.Codeblock;
            ErrorBoundary: typeof snowComponents.ErrorBoundary;
            Search: typeof snowComponents.Search;
            Summary: typeof snowComponents.Summary;
            SheetHeader: typeof snowComponents.SheetHeader;
            TextInputRow: typeof snowComponents.TextInputRow;
            SettingsPage: typeof snowComponents.SettingsPage;
            Icon: typeof snowComponents.Icon;
            RowIcon: typeof snowComponents.RowIcon;
            IconButton: typeof snowComponents.IconButton;
            FloatingActionButton: typeof snowComponents.FloatingActionButton;
            General: typeof import("react-native");
            Alert: any;
            Button: any;
        }>;
        rawColors: Record<string, string>;
        semanticColors: Record<string, any>;
        settings: Readonly<{}>;
        sheets: typeof sheets;
        showToast: typeof showToast;
        styles: Readonly<{
            createLegacyClassComponentStyles: typeof createLegacyClassComponentStyles;
            createStyles: typeof createStyles;
            createThemedStyleSheet: typeof createThemedStyleSheet;
        }>;
        toasts: Readonly<{
            showToast: typeof showToast;
        }>;
    }>;
    utils: Readonly<{
        findInReactTree: typeof findInReactTree;
        findInTree: typeof findInTree;
        safeFetch: typeof safeFetch;
        without<T extends Record<string, unknown>>(value: T, ...keys: string[]): Record<string, unknown>;
        unfreeze<T>(value: T): T;
    }>;
    native: {};
    themes: Readonly<{
        themes: Readonly<{}>;
        fetchTheme: () => never;
        installTheme: () => never;
        selectTheme: () => never;
        removeTheme: () => never;
        updateThemes: () => never;
        getCurrentTheme: () => null;
    }>;
    loader: Readonly<{
        config: Readonly<{}>;
        identity: Readonly<{
            features: Readonly<{}>;
            name: "Snow";
        }>;
    }>;
    debug: Readonly<{
        connectToDebugger: () => never;
        getDebugInfo: () => Readonly<{
            loader: "Snow";
            profile: "bunny-spec3-kettu-2026-08-27" | "vendetta-kettu-2026-08-27";
        }>;
    }>;
    debugger: Readonly<{
        connect: () => never;
    }>;
    unload: () => never;
}>;
export {};
