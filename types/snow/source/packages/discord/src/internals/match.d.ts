import type { FilterFn } from "../types";
/** Undefined when the module does not match, otherwise whether to unwrap its default export. */
export declare function filterExports<A extends unknown[]>(moduleExports: any, moduleId: number, filter: FilterFn<A>): boolean | undefined;
