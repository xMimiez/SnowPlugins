/**
 * Snow's plugin version grammar: SemVer-flavored, but accepting the one- and two-segment
 * versions Discord uses. Build metadata is parsed and ignored for ordering.
 */
interface Version {
    segments: readonly number[];
    prerelease: readonly string[];
    text: string;
}
type Operator = ">=" | "<=" | ">" | "<" | "=";
interface Comparator {
    operator: Operator;
    version: Version;
}
/** An empty comparator list is the `*` range. */
interface VersionRange {
    comparators: readonly Comparator[];
    text: string;
}
/** Strict form used for every version a manifest declares. */
export declare function parseVersion(text: string): Version;
/** Lenient form for values read from Discord; anything unreadable is unknown. */
export declare function parseHostVersion(value: unknown): Version | undefined;
export declare function compareVersions(left: Version, right: Version): number;
export declare function parseVersionRange(text: string, options?: {
    singleSegment?: boolean;
}): VersionRange;
/** A prerelease candidate is checked by its numeric part. Only `*` accepts an unknown value. */
export declare function satisfiesRange(range: VersionRange, version: Version | undefined): boolean;
/** Unparseable versions, such as free-form schema 2 strings, satisfy only `*`. */
export declare function versionSatisfies(version: string, range: string): boolean;
export declare function describeRange(range: VersionRange): string;
export {};
