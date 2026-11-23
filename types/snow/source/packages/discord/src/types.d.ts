import { Nullish } from "@snow-internal/api/lib/utils/types";
/** @see {@link https://github.com/facebook/metro/blob/c2d7539dfc10aacb2f99fcc2f268a3b53e867a90/packages/metro-runtime/src/polyfills/require.js} */
export declare namespace Metro {
    type DependencyMap = Array<ModuleID> & {
        readonly paths?: Readonly<Record<ModuleID, string>> | undefined;
    };
    type InverseDependencyMap = Record<ModuleID, ModuleID[]>;
    type FactoryFn = (global: object, require: RequireFn, metroImportDefault: RequireFn, metroImportAll: RequireFn, moduleObject: {
        exports: any;
    }, exports: any, dependencyMap: DependencyMap | Nullish) => void;
    interface HotModuleReloadingData {
        _acceptCallback: (() => void) | Nullish;
        _disposeCallback: (() => void) | Nullish;
        _didAccept: boolean;
        accept: (callback?: () => void) => void;
        dispose: (callback?: () => void) => void;
    }
    type ModuleID = number;
    interface Module {
        id?: ModuleID;
        exports: any;
        hot?: HotModuleReloadingData;
    }
    interface ModuleDefinition {
        dependencyMap: DependencyMap | Nullish;
        error?: any;
        factory: FactoryFn | undefined;
        hasError: boolean;
        hot?: HotModuleReloadingData;
        importedAll: any;
        importedDefault: any;
        isInitialized: boolean;
        path?: string;
        publicModule: Module;
        verboseName?: string;
        __filePath?: string;
    }
    type ModuleList = Record<ModuleID, ModuleDefinition | Nullish>;
    type RequireFn = (id: ModuleID) => any;
    type DefineFn = (factory: FactoryFn, moduleId: ModuleID, dependencyMap?: DependencyMap, verboseName?: string, inverseDependencies?: InverseDependencyMap) => void;
    type ModuleDefiner = (moduleId: ModuleID) => void;
    type ClearFn = () => ModuleList;
    type RegisterSegmentFn = (segmentId: number, moduleDefiner: ModuleDefiner, moduleIds: Readonly<ModuleID[]> | Nullish) => void;
    interface Require extends RequireFn {
        importDefault: RequireFn;
        importAll: RequireFn;
        context: () => never;
        resolveWeak: () => never;
        unpackModuleId: (moduleId: ModuleID) => {
            localId: number;
            segmentId: number;
        };
        packModuleId: (value: {
            localId: number;
            segmentId: number;
        }) => ModuleID;
    }
}
export type ModuleExports = any;
export type FilterCheckDef<A extends unknown[]> = (args: A, module: any, modulesId: number, defaultCheck: boolean) => boolean;
export interface FilterFn<A extends unknown[]> {
    (m: any, id: number, defaultCheck: boolean): boolean;
    filter: FilterCheckDef<A>;
    raw: boolean;
    /** Cache key. Different matching rules need different keys. */
    uniq: string;
    uncached?: true;
    /**
     * Present on dependency-capable filters: a check on a module's dependency list that runs
     * before the module is initialized. Exports-only filters leave it out.
     */
    dependencies?: (id: number) => boolean;
}
export interface FilterDefinition<A extends unknown[]> {
    (...args: A): FilterFn<A>;
    /** Tests the default export but returns the whole exports object. */
    byRaw(...args: A): FilterFn<A>;
    uniqMaker(args: A): string;
}
export interface LazyModuleContext<A extends unknown[] = unknown[]> {
    filter: FilterFn<A>;
    indexed: boolean;
    moduleId?: number;
    getExports(cb: (exports: any) => void): () => void;
    subscribe(cb: (exports: any) => void): () => void;
    forceLoad(): any;
    get cache(): any;
}
