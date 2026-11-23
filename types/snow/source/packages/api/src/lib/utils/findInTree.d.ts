export type SearchTree = Record<string, any>;
export type SearchFilter = (tree: SearchTree) => boolean;
export interface FindInTreeOptions {
    /** Object properties to follow. An empty list allows all properties; arrays are always traversed. */
    walkable?: string[];
    /** Object properties to skip, including those listed in walkable. */
    ignore?: string[];
    /** Maximum depth from the root, which is depth zero. Defaults to 100. */
    maxDepth?: number;
}
/**
 * Depth-first search that returns the first match or undefined. A filter that
 * throws counts as no match. Only maxDepth bounds cycles, so the same object
 * can be visited more than once.
 */
export declare function findInTree(tree: SearchTree, filter: SearchFilter, { walkable, ignore, maxDepth }?: FindInTreeOptions): any;
