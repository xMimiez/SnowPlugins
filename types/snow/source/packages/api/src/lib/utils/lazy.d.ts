type ExemptedEntries = Record<symbol | string, unknown>;
interface LazyOptions<E extends ExemptedEntries> {
    hint?: "function" | "object";
    exemptedEntries?: E;
}
/**
 * The factory runs on first use. A falsy result throws on property access.
 * Null and undefined are retried on the next access, anything else is cached.
 */
export declare function proxyLazy<T, I extends ExemptedEntries>(factory: () => T, opts?: LazyOptions<I>): T;
/**
 * Each destructured property becomes its own lazy proxy. Only use it for object
 * or function properties, since a proxy cannot stand in for a primitive.
 */
export declare function lazyDestructure<T extends Record<PropertyKey, unknown>, I extends ExemptedEntries>(factory: () => T, opts?: LazyOptions<I>): T;
export declare function getProxyFactory<T>(obj: T): (() => T) | void;
export {};
