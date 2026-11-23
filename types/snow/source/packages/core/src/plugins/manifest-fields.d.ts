export declare const MAX_LIST_ENTRIES = 32;
export interface PluginManifestLink {
    /** HTTPS, normalized. */
    url: string;
    label?: string;
}
export interface PluginManifestAuthor {
    name: string;
    id?: string;
    /** Absent means author. Only Snow manifests and repository indexes carry it. */
    role?: "author" | "contributor";
    links?: PluginManifestLink[];
}
export declare function requireString(value: unknown, label: string, maximum: number): string;
export declare function requireLicense(value: unknown): string;
export declare function requireId(value: unknown, label?: string, allowCore?: boolean): string;
export declare function requireHttpsURL(value: unknown, label: string, base?: string): string;
/** Names and Discord IDs only, ignoring other fields: the Vendetta and Bunny formats. */
export declare function requireAuthors(value: unknown, minimum?: number): PluginManifestAuthor[];
/**
 * Snow manifests and repository index entries: each person may also carry a role and up to five
 * HTTPS links. Other fields in an entry are ignored, as released Snow ignores role and links, so
 * credits never stop a manifest from installing on an older release.
 */
export declare function requireCreditedAuthors(value: unknown): PluginManifestAuthor[];
export declare function requireIdList(value: unknown, label: string): string[];
export declare function assertOnlyKeys(value: Record<string, unknown>, allowed: ReadonlySet<string>, label: string): void;
