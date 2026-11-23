export declare const hostOf: (url: string) => string;
/**
 * The host a manifest names for its bundle, relative to the manifest. A download can redirect
 * elsewhere, so compare this only with another declared host.
 */
export declare const declaredBundleHost: (bundleUrl: string, manifestUrl: string) => string;
