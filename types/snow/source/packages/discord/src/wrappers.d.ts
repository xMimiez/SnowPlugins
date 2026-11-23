import { type WaitPromiseOptions } from "./internals/wait";
export { lookupFilePath, type FilePathLookup } from "./internals/named-waits";
export { getStoreNames } from "./internals/stores";
/** Every named property must be truthy. May initialize Discord modules. */
export declare const findByProps: <T = any>(...props: string[]) => T;
export declare const findByPropsLazy: <T = any>(...props: string[]) => T;
export declare const findByPropsAll: <T = any>(...props: string[]) => T[];
export declare const findByName: <T = any>(name: string, expDefault?: boolean) => T;
export declare const findByNameLazy: <T = any>(name: string, expDefault?: boolean) => T;
export declare const findByNameAll: <T = any>(name: string, expDefault?: boolean) => T[];
export declare const findByDisplayName: <T = any>(name: string, expDefault?: boolean) => T;
export declare const findByDisplayNameLazy: <T = any>(name: string, expDefault?: boolean) => T;
export declare const findByDisplayNameAll: <T = any>(name: string, expDefault?: boolean) => T[];
export declare const findByTypeName: <T = any>(name: string, expDefault?: boolean) => T;
export declare const findByTypeNameLazy: <T = any>(name: string, expDefault?: boolean) => T;
export declare const findByTypeNameAll: <T = any>(name: string, expDefault?: boolean) => T[];
/** Answers from the store registry when the store has loaded, otherwise searches. */
export declare const findByStoreName: <T = any>(name: string) => T;
export declare const findByStoreNameLazy: <T = any>(name: string) => T;
/** A loaded store by name, or one cached from an earlier launch. Never searches unrelated modules. */
export declare const getStore: <T = any>(name: string) => T | undefined;
/** Calls back once a store with this name loads, after returning if it already has. */
export declare const waitForStore: <T = any>(name: string, callback: (store: T) => void) => () => void;
/** Resolves with the store once it loads. */
export declare const findByStoreNameAsync: <T = any>(name: string, options?: WaitPromiseOptions) => Promise<T>;
/** Discord source paths, for example `modules/main_tabs_v2/RootNavigationRef.native.tsx`. */
export declare function findByFilePath<T = any>(path: string, expDefault?: boolean): T;
export declare const findByFilePathLazy: <T = any>(path: string, expDefault?: boolean) => T;
/** Calls back with the module's exports once the module for this path loads. */
export declare const waitForFilePath: (path: string, callback: (exports: any, id: number) => void) => () => void;
/** Resolves with the module's exports once the module for this path loads. */
export declare const findByFilePathAsync: (path: string, options?: WaitPromiseOptions) => Promise<any>;
export declare const findByTypeDisplayName: <T = any>(name: string, expDefault?: boolean) => T;
export declare const findByTypeDisplayNameLazy: <T = any>(name: string, expDefault?: boolean) => T;
export declare const findByTypeDisplayNameAll: <T = any>(name: string, expDefault?: boolean) => T[];
