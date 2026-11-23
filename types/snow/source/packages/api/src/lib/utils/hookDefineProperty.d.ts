import { LiteralUnion } from "type-fest";
type KeyOfOrAny<P, T extends object> = P extends keyof T ? T[P] : any;
/**
 * If the property already exists, cb runs once and nothing is hooked. Otherwise
 * assignments go through cb, whose result replaces the value unless it is null
 * or undefined. The returned cleanup turns it back into a plain property.
 */
export declare function hookDefineProperty<T extends object, P extends LiteralUnion<keyof T, PropertyKey>>(target: T, property: LiteralUnion<keyof T, PropertyKey>, cb: (val: KeyOfOrAny<P, T>) => KeyOfOrAny<P, T>): (() => void) | undefined;
export {};
