/**
 * Replaces image assets where React Native resolves an asset ID to an image source, so every
 * image using the asset changes and other elements cost nothing. Images resolved some other way
 * (a `{ uri }` source, Discord's vector icons, native images) are not affected.
 */
export interface AssetOverrideSource {
    /** Any URI React Native's image loader accepts: `file://`, `https://`, or `data:`. */
    uri: string;
    /** Defaults to the original asset's size. */
    width?: number;
    height?: number;
    /** Defaults to 1. */
    scale?: number;
}
/**
 * Overrides one asset by ID, or every asset with a name, including ones registered later. An ID
 * override wins over a name override. Images update when they next resolve their source.
 */
export declare function overrideAsset(target: number | string, source: AssetOverrideSource): () => void;
