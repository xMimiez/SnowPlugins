import type { SerializableValue } from "./types.js";
export interface InspectOptions {
    depth?: number;
    entries?: number;
    stringLength?: number;
    /** Replaces the default key filter. Token-like string values are still redacted. */
    redactKeys?: RegExp;
    /** Leaves out non-enumerable object properties. */
    enumerableOnly?: boolean;
}
/**
 * Never reads accessor properties. Any repeated object reference is shown as
 * circular, even without a real cycle.
 */
export declare function inspectValue(value: unknown, options?: InspectOptions): SerializableValue;
