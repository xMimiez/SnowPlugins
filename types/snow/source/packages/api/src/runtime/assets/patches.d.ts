/** React Native's asset record. Bundled assets carry the packager marker; custom ones do not. */
export interface AssetRecord {
    __packager_asset?: boolean;
    name: string;
    type: string;
    width?: number;
    height?: number;
    scales?: number[];
    httpServerLocation?: string;
    hash?: string;
    uri?: string;
}
interface AssetModule {
    registerAsset(assetDefinition: AssetRecord): number;
    getAssetByID(id: number): AssetRecord | undefined;
}
export type AssetRegistrationCallback = (asset: AssetRecord, id: number, moduleId: number) => void;
export declare let assetsModule: AssetModule;
/**
 * Calls back for every asset registered from now on, or only those with this name. Bundled
 * assets report the module that registered them; custom assets report -1.
 */
export declare function onAssetRegistered(callback: AssetRegistrationCallback, name?: string, owner?: string): () => void;
/** Every asset registered so far with its ID, in registration order. Loads no modules. */
export declare function registeredAssets(): Generator<[asset: AssetRecord, id: number]>;
export {};
