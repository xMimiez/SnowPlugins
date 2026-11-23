export { onAssetRegistered, registeredAssets, type AssetRecord, type AssetRegistrationCallback, } from "./patches";
export { overrideAsset, type AssetOverrideSource } from "./overrides";
export interface Asset {
    id: number;
    name: string;
    moduleId: number;
    type: string;
}
/** Lookups by name alone return this type when it exists: React Native on iOS cannot draw SVG files. */
export declare const PREFERRED_ASSET_TYPE = "png";
export interface CustomAssetDefinition {
    name: string;
    type: string;
    uri: string;
    width: number;
    height: number;
    scale?: number;
}
/**
 * An asset by name, of the given type or else the preferred one. Bundled assets first, then
 * custom ones. Loads only that asset's module once the name index has it.
 */
export declare function getAssetByName(name: string, type?: string): Asset | undefined;
/**
 * Registers an image that works anywhere Discord accepts an asset ID, and in name lookups. A
 * name and type Discord already bundles, or another custom asset uses, throws. React Native's
 * registry is append-only: disposing removes the asset from lookups, while elements still holding
 * the ID keep resolving to its URI.
 */
export declare function registerCustomAsset(definition: CustomAssetDefinition): {
    id: number;
    dispose: () => void;
};
/** Every bundled asset, loading their modules as it goes. Deduplicated by ID. */
export declare function iterateAssets(): Generator<Asset>;
export declare function findAsset(id: number): Asset | undefined;
/** Matches the full name, not a substring. Returns the preferred type when there are several. */
export declare function findAsset(name: string): Asset | undefined;
export declare function findAsset(filter: (a: Asset) => boolean): Asset | undefined;
/** A string matches the full name, not a substring, and returns every type. May load asset modules. */
export declare function filterAssets(param: string | ((a: Asset) => boolean)): Asset[];
export declare function findAssetId(name: string): number | undefined;
/** Whether the asset index is complete, how many names it holds, and how many have several types. */
export declare function getAssetIndexSummary(): {
    complete: boolean;
    names: number;
    multipleTypes: number;
};
