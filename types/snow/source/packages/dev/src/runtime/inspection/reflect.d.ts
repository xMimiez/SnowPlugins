export declare function describeError(error: unknown): string;
export declare function bounded(value: number, minimum: number, maximum: number): number;
export declare function paginate(total: number, offset: number, limit: number, maximumLimit: number): {
    offset: number;
    limit: number;
};
export declare function nextPageOffset(offset: number, count: number, total: number): number | null;
export declare function isObjectLike(value: unknown): value is object;
export declare function dataProperty(target: unknown, key: PropertyKey): unknown;
export declare function stringProperty(target: unknown, key: PropertyKey): string | null;
/** Undefined for primitives and for proxies whose descriptor traps throw. */
export declare function descriptors(value: unknown): PropertyDescriptorMap | undefined;
export declare function inspectionId(prefix: string): string;
