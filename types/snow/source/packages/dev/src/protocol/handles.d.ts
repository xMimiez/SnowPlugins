import type { SerializablePrimitive } from "./types.js";
export type RemoteObjectSubtype = "array" | "date" | "error" | "map" | "promise" | "react-element" | "regexp" | "set" | "typed-array";
export interface RemotePrimitive {
    kind: "primitive";
    type: "bigint" | "boolean" | "null" | "number" | "string" | "symbol" | "undefined";
    value: SerializablePrimitive | string;
}
export interface RemoteObject {
    kind: "object";
    handle: string;
    group: string;
    type: "function" | "object";
    subtype?: RemoteObjectSubtype;
    description: string;
    childCount: number | null;
}
export interface RemoteRedacted {
    kind: "redacted";
    reason: "metadata-mode" | "sensitive-key" | "sensitive-value";
    type: string;
}
export interface RemoteUnavailable {
    kind: "unavailable";
    reason: string;
}
export type RemoteValue = RemoteObject | RemotePrimitive | RemoteRedacted | RemoteUnavailable;
export interface RemoteProperty {
    key: string;
    keyType: "string" | "symbol";
    configurable: boolean;
    enumerable: boolean;
    writable: boolean | null;
    accessor: {
        get: boolean;
        set: boolean;
    } | null;
    value?: RemoteValue;
}
export interface RemotePropertyPage {
    handle: string;
    properties: RemoteProperty[];
    total: number;
    offset: number;
    nextOffset: number | null;
}
