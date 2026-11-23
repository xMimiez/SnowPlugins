import { type OperationName } from "./operations.js";
import type { SerializableValue } from "./types.js";
type Values = Record<string, SerializableValue>;
type Field<T> = (values: Values, key: string) => T;
/** Fields are checked in declaration order after unexpected keys are rejected. */
declare const schemas: {
    readonly "flux.capture": {
        readonly sessionId: Field<string>;
        readonly types: Field<string[]>;
        readonly captureLimit: Field<number | undefined>;
        readonly ttlMs: Field<number | undefined>;
    };
    readonly "flux.captures": {
        readonly sessionId: Field<string>;
    };
    readonly "flux.events": {
        readonly sessionId: Field<string>;
        readonly captureId: Field<string>;
    };
    readonly "flux.listeners": {};
    readonly "flux.stop": {
        readonly sessionId: Field<string>;
        readonly captureId: Field<string>;
    };
    readonly "flux.types": {};
    readonly "inspect.properties": {
        readonly offset: Field<number | undefined>;
        readonly limit: Field<number | undefined>;
        readonly sessionId: Field<string>;
        readonly handle: Field<string>;
    };
    readonly "inspect.prototype": {
        readonly sessionId: Field<string>;
        readonly handle: Field<string>;
        readonly depth: Field<number | undefined>;
    };
    readonly "inspect.release": {
        readonly sessionId: Field<string>;
        readonly handle: Field<string>;
    };
    readonly "inspect.releaseGroup": {
        readonly sessionId: Field<string>;
        readonly group: Field<string>;
    };
    readonly "inspection.close": {
        readonly sessionId: Field<string>;
    };
    readonly "inspection.get": {
        readonly sessionId: Field<string>;
    };
    readonly "inspection.open": {
        readonly durationMs: Field<number | undefined>;
        readonly privacy: Field<"metadata" | "values" | undefined>;
    };
    readonly "inspection.sessions": {};
    readonly "interaction.timeline": {
        readonly sessionId: Field<string>;
        readonly after: Field<number | undefined>;
        readonly before: Field<number | undefined>;
        readonly limit: Field<number | undefined>;
    };
    readonly "logs.list": {};
    readonly "metro.modules": {
        offset: Field<number | undefined>;
        limit: Field<number | undefined>;
    };
    readonly "metro.catalog": {
        offset: Field<number | undefined>;
        limit: Field<number | undefined>;
    };
    readonly "metro.describe": {
        readonly sessionId: Field<string>;
        readonly id: Field<string>;
    };
    readonly "metro.load": {
        readonly id: Field<string>;
        readonly confirm: Field<true>;
    };
    readonly "metro.search": {
        readonly offset: Field<number | undefined>;
        readonly limit: Field<number | undefined>;
        readonly query: Field<string | undefined>;
    };
    readonly "metro.searchShape": {
        readonly offset: Field<number | undefined>;
        readonly limit: Field<number | undefined>;
        readonly keys: Field<string[]>;
        readonly mode: Field<"all" | "any" | undefined>;
    };
    readonly "metro.searchText": {
        readonly offset: Field<number | undefined>;
        readonly limit: Field<number | undefined>;
        readonly query: Field<string | undefined>;
    };
    readonly "native.accessibility": {
        sessionId: Field<string>;
        depth: Field<number | undefined>;
        nodes: Field<number | undefined>;
    };
    readonly "native.hitTest": {
        readonly sessionId: Field<string>;
        readonly x: Field<number>;
        readonly y: Field<number>;
    };
    readonly "native.windows": {
        sessionId: Field<string>;
        depth: Field<number | undefined>;
        nodes: Field<number | undefined>;
    };
    readonly "patches.list": {};
    readonly "plugins.inspect": {
        readonly id: Field<string>;
    };
    readonly "plugins.list": {};
    readonly "plugins.reload": {
        readonly bundleUrl: Field<string | undefined>;
        readonly source: Field<string | undefined>;
        readonly manifest: Field<Values | undefined>;
        readonly sourceUrl: Field<string>;
        readonly expectedId: Field<string>;
        readonly expectedVersion: Field<string>;
        readonly enable: Field<boolean | undefined>;
    };
    readonly "probes.attach": {
        readonly sessionId: Field<string>;
        readonly moduleId: Field<string>;
        readonly path: Field<string[]>;
        readonly captureLimit: Field<number | undefined>;
        readonly ttlMs: Field<number | undefined>;
    };
    readonly "probes.captures": {
        readonly sessionId: Field<string>;
        readonly probeId: Field<string>;
    };
    readonly "probes.list": {
        readonly sessionId: Field<string>;
    };
    readonly "probes.stop": {
        readonly sessionId: Field<string>;
        readonly probeId: Field<string>;
    };
    readonly "react.element": {
        readonly sessionId: Field<string>;
        readonly handle: Field<string>;
    };
    readonly "react.roots": {
        readonly sessionId: Field<string>;
    };
    readonly "react.status": {};
    readonly "react.tree": {
        readonly sessionId: Field<string>;
        readonly handle: Field<string>;
        readonly depth: Field<number | undefined>;
        readonly nodes: Field<number | undefined>;
    };
    readonly "runtime.capabilities": {};
    readonly "runtime.health": {};
    readonly "runtime.reload": {};
    readonly "runtime.status": {};
    readonly "stores.describe": {
        readonly sessionId: Field<string>;
        readonly id: Field<string>;
    };
    readonly "stores.list": {
        offset: Field<number | undefined>;
        limit: Field<number | undefined>;
    };
    readonly "themes.inspect": {};
    readonly "themes.preview": {
        readonly id: Field<string>;
        readonly data: Field<Values>;
    };
    readonly "themes.restore": {
        readonly selectedId: Field<string | null>;
        readonly removeId: Field<string>;
    };
};
type Parsed<Schema> = {
    [Key in keyof Schema]: Schema[Key] extends Field<infer T> ? T : never;
};
type OptionalUndefined<T> = {
    [Key in keyof T as undefined extends T[Key] ? Key : never]?: T[Key];
} & {
    [Key in keyof T as undefined extends T[Key] ? never : Key]: T[Key];
};
/** The validated parameter object an operation receives. */
export type OperationParameters<Name extends OperationName> = OptionalUndefined<Parsed<(typeof schemas)[Name]>>;
export declare function validateOperationParameters<Name extends OperationName>(operation: Name, parameters: SerializableValue | undefined): OperationParameters<Name>;
export {};
