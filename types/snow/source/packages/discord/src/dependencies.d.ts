/**
 * Patterns over a module's dependency list, the module IDs Metro recorded for its imports in
 * import order. Reading the list never runs the module, so these patterns can rule modules in or
 * out before loading them. Module IDs change between Discord bundles: resolve anchors (React, the
 * import tracker) at runtime and prefer offsets, which survive because the bundler numbers files
 * that are bundled together consecutively.
 */
declare const ANY: unique symbol;
/** Matches any one dependency and consumes its position. */
export declare const anyDependency: typeof ANY;
export interface OffsetEntry {
    readonly kind: "offset";
    /** `module` is the module under test; `parent` is the module whose list is being compared. */
    readonly base: "module" | "parent";
    readonly min: number;
    readonly max: number;
}
export interface NestedEntry {
    readonly kind: "nested";
    readonly pattern: DependencyPattern;
    readonly at?: OffsetEntry;
}
/** An exact module ID, any dependency, an offset, or a dependency whose own list matches. */
export type DependencyEntry = number | typeof ANY | OffsetEntry | NestedEntry;
export interface DependencyPatternOptions {
    /** The list may be longer than the pattern. Implied by min and max. */
    prefix?: boolean;
    /** Compare from this position. */
    skip?: number;
    /** Compare against the last positions. Cannot combine with prefix or skip. */
    end?: boolean;
    min?: number;
    max?: number;
    /**
     * `ordered`: entries in order with anything between them, each taking the earliest fit.
     * `unordered`: every entry matched somewhere; wildcards are not allowed.
     */
    order?: "positional" | "ordered" | "unordered";
}
export interface DependencyPattern {
    readonly entries: readonly DependencyEntry[];
    readonly prefix: boolean;
    readonly skip: number;
    readonly end: boolean;
    readonly min: number | undefined;
    readonly max: number | undefined;
    readonly order: "positional" | "ordered" | "unordered";
    /** Structural cache key. Equal for structurally identical patterns. */
    readonly key: string;
    /** False when validation failed in a production build. */
    readonly valid: boolean;
}
/** Matches the dependency at exactly this offset from the module under test. */
export declare function moduleOffset(offset: number): OffsetEntry;
/** Matches the dependency at exactly this offset from the module whose list is compared. */
export declare function parentOffset(offset: number): OffsetEntry;
/** Matches a dependency within an inclusive offset range. */
export declare function offsetRange(min: number, max: number, base?: OffsetEntry["base"]): OffsetEntry;
/** Matches a dependency whose own dependency list matches the pattern, optionally at an offset. */
export declare function nestedDependencies(pattern: DependencyPattern, at?: OffsetEntry): NestedEntry;
export declare function dependencyPattern(entries: readonly DependencyEntry[], options?: DependencyPatternOptions): DependencyPattern;
/** Whether a module's dependency list matches, without initializing the module. */
export declare function matchesDependencies(pattern: DependencyPattern, moduleId: number): boolean;
export {};
