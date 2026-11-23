interface ReleaseVersion {
    numbers: [number, number, number];
    prerelease: string[];
}
export declare function parseReleaseVersion(text: string): ReleaseVersion;
export declare function isReleaseVersion(text: string): boolean;
export declare const isPrerelease: (text: string) => boolean;
/** SemVer 2.0.0 precedence (section 11); negative when left is older. */
export declare function compareReleaseVersions(left: string, right: string): number;
export {};
