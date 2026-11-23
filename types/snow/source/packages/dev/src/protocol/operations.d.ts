import type { Capability } from "./types.js";
export type OperationEndpoint = "device" | "server";
export type OperationRisk = "control" | "mutation" | "read";
export interface OperationDefinition {
    capability: Capability;
    defaultTimeoutMs: number;
    description: string;
    endpoint: OperationEndpoint;
    maximumTimeoutMs: number;
    idempotent: boolean;
    risk: OperationRisk;
    stateful: boolean;
}
export declare const operations: {
    readonly "flux.capture": {
        readonly defaultTimeoutMs: 10000;
        readonly maximumTimeoutMs: 60000;
        readonly idempotent: false;
        readonly risk: "control";
        readonly stateful: true;
        readonly capability: "flux.read";
        readonly description: "Passively capture selected Flux action types within the capture limits";
        readonly endpoint: "device";
    };
    readonly "flux.captures": {
        readonly defaultTimeoutMs: 10000;
        readonly maximumTimeoutMs: 60000;
        readonly idempotent: true;
        readonly risk: "read";
        readonly stateful: false;
        readonly capability: "flux.read";
        readonly description: "List passive Flux captures in one of your inspection sessions";
        readonly endpoint: "device";
    };
    readonly "flux.events": {
        readonly defaultTimeoutMs: 10000;
        readonly maximumTimeoutMs: 60000;
        readonly idempotent: true;
        readonly risk: "read";
        readonly stateful: false;
        readonly capability: "flux.read";
        readonly description: "Read redacted events from one of your Flux captures";
        readonly endpoint: "device";
    };
    readonly "flux.listeners": {
        readonly defaultTimeoutMs: 10000;
        readonly maximumTimeoutMs: 60000;
        readonly idempotent: true;
        readonly risk: "read";
        readonly stateful: false;
        readonly capability: "flux.read";
        readonly description: "List observed Flux action listener counts without dispatching";
        readonly endpoint: "device";
    };
    readonly "flux.stop": {
        readonly defaultTimeoutMs: 10000;
        readonly maximumTimeoutMs: 60000;
        readonly idempotent: false;
        readonly risk: "control";
        readonly stateful: true;
        readonly capability: "flux.read";
        readonly description: "Stop one of your passive Flux captures";
        readonly endpoint: "device";
    };
    readonly "flux.types": {
        readonly defaultTimeoutMs: 10000;
        readonly maximumTimeoutMs: 60000;
        readonly idempotent: true;
        readonly risk: "read";
        readonly stateful: false;
        readonly capability: "flux.read";
        readonly description: "List observed Flux action types without dispatching";
        readonly endpoint: "device";
    };
    readonly "inspect.properties": {
        readonly defaultTimeoutMs: 10000;
        readonly maximumTimeoutMs: 60000;
        readonly idempotent: false;
        readonly risk: "control";
        readonly stateful: true;
        readonly capability: "inspection.read";
        readonly description: "Read a limited set of own-property descriptors without calling getters";
        readonly endpoint: "device";
    };
    readonly "inspect.prototype": {
        readonly defaultTimeoutMs: 10000;
        readonly maximumTimeoutMs: 60000;
        readonly idempotent: false;
        readonly risk: "control";
        readonly stateful: true;
        readonly capability: "inspection.read";
        readonly description: "Read a bounded prototype chain for a live inspection handle";
        readonly endpoint: "device";
    };
    readonly "inspect.release": {
        readonly defaultTimeoutMs: 10000;
        readonly maximumTimeoutMs: 60000;
        readonly idempotent: false;
        readonly risk: "control";
        readonly stateful: true;
        readonly capability: "inspection.read";
        readonly description: "Release a live object handle from this session";
        readonly endpoint: "device";
    };
    readonly "inspect.releaseGroup": {
        readonly defaultTimeoutMs: 10000;
        readonly maximumTimeoutMs: 60000;
        readonly idempotent: false;
        readonly risk: "control";
        readonly stateful: true;
        readonly capability: "inspection.read";
        readonly description: "Release a group of live object handles from this session";
        readonly endpoint: "device";
    };
    readonly "inspection.close": {
        readonly defaultTimeoutMs: 10000;
        readonly maximumTimeoutMs: 60000;
        readonly idempotent: false;
        readonly risk: "control";
        readonly stateful: true;
        readonly capability: "inspection.read";
        readonly description: "Close an inspection session and release all resources it holds";
        readonly endpoint: "device";
    };
    readonly "inspection.get": {
        readonly defaultTimeoutMs: 10000;
        readonly maximumTimeoutMs: 60000;
        readonly idempotent: true;
        readonly risk: "read";
        readonly stateful: false;
        readonly capability: "inspection.read";
        readonly description: "Read one of your inspection sessions";
        readonly endpoint: "device";
    };
    readonly "inspection.open": {
        readonly defaultTimeoutMs: 10000;
        readonly maximumTimeoutMs: 60000;
        readonly idempotent: false;
        readonly risk: "control";
        readonly stateful: true;
        readonly capability: "inspection.read";
        readonly description: "Open an inspection session with resource limits and an expiry";
        readonly endpoint: "device";
    };
    readonly "inspection.sessions": {
        readonly defaultTimeoutMs: 10000;
        readonly maximumTimeoutMs: 60000;
        readonly idempotent: true;
        readonly risk: "read";
        readonly stateful: false;
        readonly capability: "inspection.read";
        readonly description: "List active inspection sessions owned by this controller";
        readonly endpoint: "device";
    };
    readonly "interaction.timeline": {
        readonly defaultTimeoutMs: 10000;
        readonly maximumTimeoutMs: 60000;
        readonly idempotent: true;
        readonly risk: "read";
        readonly stateful: false;
        readonly capability: "inspection.read";
        readonly description: "Read Flux events and probe captures together by timestamp for one session";
        readonly endpoint: "device";
    };
    readonly "logs.list": {
        readonly defaultTimeoutMs: 10000;
        readonly maximumTimeoutMs: 60000;
        readonly idempotent: true;
        readonly risk: "read";
        readonly stateful: false;
        readonly capability: "logs.read";
        readonly description: "Read a limited number of recent Snow runtime logs";
        readonly endpoint: "server";
    };
    readonly "metro.modules": {
        readonly defaultTimeoutMs: 10000;
        readonly maximumTimeoutMs: 60000;
        readonly idempotent: true;
        readonly risk: "read";
        readonly stateful: false;
        readonly capability: "metro.read";
        readonly description: "Legacy alias for metro.catalog";
        readonly endpoint: "device";
    };
    readonly "metro.catalog": {
        readonly defaultTimeoutMs: 10000;
        readonly maximumTimeoutMs: 60000;
        readonly idempotent: true;
        readonly risk: "read";
        readonly stateful: false;
        readonly capability: "metro.read";
        readonly description: "Page through already-initialized Discord Metro modules";
        readonly endpoint: "device";
    };
    readonly "metro.describe": {
        readonly defaultTimeoutMs: 10000;
        readonly maximumTimeoutMs: 60000;
        readonly idempotent: false;
        readonly risk: "control";
        readonly stateful: true;
        readonly capability: "metro.read";
        readonly description: "Describe one initialized Metro module and create a session-local export handle";
        readonly endpoint: "device";
    };
    readonly "metro.load": {
        readonly defaultTimeoutMs: 20000;
        readonly maximumTimeoutMs: 60000;
        readonly idempotent: false;
        readonly risk: "mutation";
        readonly stateful: true;
        readonly capability: "inspection.write";
        readonly description: "Initialize a Metro module by numeric ID after confirmation";
        readonly endpoint: "device";
    };
    readonly "metro.search": {
        readonly defaultTimeoutMs: 10000;
        readonly maximumTimeoutMs: 60000;
        readonly idempotent: true;
        readonly risk: "read";
        readonly stateful: false;
        readonly capability: "metro.read";
        readonly description: "Legacy alias for metro.searchText";
        readonly endpoint: "device";
    };
    readonly "metro.searchShape": {
        readonly defaultTimeoutMs: 10000;
        readonly maximumTimeoutMs: 60000;
        readonly idempotent: true;
        readonly risk: "read";
        readonly stateful: false;
        readonly capability: "metro.read";
        readonly description: "Search initialized Metro modules by exact export-key shape";
        readonly endpoint: "device";
    };
    readonly "metro.searchText": {
        readonly defaultTimeoutMs: 10000;
        readonly maximumTimeoutMs: 60000;
        readonly idempotent: true;
        readonly risk: "read";
        readonly stateful: false;
        readonly capability: "metro.read";
        readonly description: "Search initialized Metro metadata without loading modules";
        readonly endpoint: "device";
    };
    readonly "native.accessibility": {
        readonly defaultTimeoutMs: 10000;
        readonly maximumTimeoutMs: 60000;
        readonly idempotent: true;
        readonly risk: "read";
        readonly stateful: false;
        readonly capability: "native.read";
        readonly description: "Read a bounded UIKit accessibility hierarchy on the main thread";
        readonly endpoint: "device";
    };
    readonly "native.hitTest": {
        readonly defaultTimeoutMs: 10000;
        readonly maximumTimeoutMs: 60000;
        readonly idempotent: true;
        readonly risk: "read";
        readonly stateful: false;
        readonly capability: "native.read";
        readonly description: "Identify the native UIKit ancestry at one screen coordinate";
        readonly endpoint: "device";
    };
    readonly "native.windows": {
        readonly defaultTimeoutMs: 10000;
        readonly maximumTimeoutMs: 60000;
        readonly idempotent: true;
        readonly risk: "read";
        readonly stateful: false;
        readonly capability: "native.read";
        readonly description: "Read a bounded UIKit window and view hierarchy on the main thread";
        readonly endpoint: "device";
    };
    readonly "patches.list": {
        readonly defaultTimeoutMs: 10000;
        readonly maximumTimeoutMs: 60000;
        readonly idempotent: true;
        readonly risk: "read";
        readonly stateful: false;
        readonly capability: "runtime.read";
        readonly description: "List active runtime patches installed by Snow";
        readonly endpoint: "device";
    };
    readonly "plugins.inspect": {
        readonly defaultTimeoutMs: 10000;
        readonly maximumTimeoutMs: 60000;
        readonly idempotent: true;
        readonly risk: "read";
        readonly stateful: false;
        readonly capability: "plugins.read";
        readonly description: "Inspect a Snow plugin without changing it";
        readonly endpoint: "device";
    };
    readonly "plugins.list": {
        readonly defaultTimeoutMs: 10000;
        readonly maximumTimeoutMs: 60000;
        readonly idempotent: true;
        readonly risk: "read";
        readonly stateful: false;
        readonly capability: "plugins.read";
        readonly description: "List Snow plugins, lifecycle states, and resource counts";
        readonly endpoint: "device";
    };
    readonly "plugins.reload": {
        readonly defaultTimeoutMs: 20000;
        readonly maximumTimeoutMs: 60000;
        readonly idempotent: false;
        readonly risk: "mutation";
        readonly stateful: true;
        readonly capability: "plugins.write";
        readonly description: "Replace one development plugin bundle";
        readonly endpoint: "device";
    };
    readonly "probes.attach": {
        readonly defaultTimeoutMs: 20000;
        readonly maximumTimeoutMs: 60000;
        readonly idempotent: false;
        readonly risk: "mutation";
        readonly stateful: true;
        readonly capability: "inspection.write";
        readonly description: "Attach a bounded capture-only probe to an exact initialized export path";
        readonly endpoint: "device";
    };
    readonly "probes.captures": {
        readonly defaultTimeoutMs: 10000;
        readonly maximumTimeoutMs: 60000;
        readonly idempotent: true;
        readonly risk: "read";
        readonly stateful: false;
        readonly capability: "inspection.read";
        readonly description: "Read a limited number of captures from one of your temporary probes";
        readonly endpoint: "device";
    };
    readonly "probes.list": {
        readonly defaultTimeoutMs: 10000;
        readonly maximumTimeoutMs: 60000;
        readonly idempotent: true;
        readonly risk: "read";
        readonly stateful: false;
        readonly capability: "inspection.read";
        readonly description: "List temporary probes in one of your inspection sessions";
        readonly endpoint: "device";
    };
    readonly "probes.stop": {
        readonly defaultTimeoutMs: 20000;
        readonly maximumTimeoutMs: 60000;
        readonly idempotent: false;
        readonly risk: "mutation";
        readonly stateful: true;
        readonly capability: "inspection.write";
        readonly description: "Stop one of your temporary probes and restore the original function";
        readonly endpoint: "device";
    };
    readonly "react.element": {
        readonly defaultTimeoutMs: 10000;
        readonly maximumTimeoutMs: 60000;
        readonly idempotent: false;
        readonly risk: "control";
        readonly stateful: true;
        readonly capability: "react.read";
        readonly description: "Describe a React Fiber in this session without running component code";
        readonly endpoint: "device";
    };
    readonly "react.roots": {
        readonly defaultTimeoutMs: 10000;
        readonly maximumTimeoutMs: 60000;
        readonly idempotent: false;
        readonly risk: "control";
        readonly stateful: true;
        readonly capability: "react.read";
        readonly description: "List React roots through the DevTools hook adapter when the required capability is available";
        readonly endpoint: "device";
    };
    readonly "react.status": {
        readonly defaultTimeoutMs: 10000;
        readonly maximumTimeoutMs: 60000;
        readonly idempotent: true;
        readonly risk: "read";
        readonly stateful: false;
        readonly capability: "react.read";
        readonly description: "Read the React tree adapter status from runtime checks";
        readonly endpoint: "device";
    };
    readonly "react.tree": {
        readonly defaultTimeoutMs: 10000;
        readonly maximumTimeoutMs: 60000;
        readonly idempotent: false;
        readonly risk: "control";
        readonly stateful: true;
        readonly capability: "react.read";
        readonly description: "Read a bounded descriptor-only React Fiber subtree";
        readonly endpoint: "device";
    };
    readonly "runtime.capabilities": {
        readonly defaultTimeoutMs: 10000;
        readonly maximumTimeoutMs: 60000;
        readonly idempotent: true;
        readonly risk: "read";
        readonly stateful: false;
        readonly capability: "runtime.read";
        readonly description: "Read host inspection capabilities confirmed by runtime checks";
        readonly endpoint: "device";
    };
    readonly "runtime.health": {
        readonly defaultTimeoutMs: 10000;
        readonly maximumTimeoutMs: 60000;
        readonly idempotent: true;
        readonly risk: "read";
        readonly stateful: false;
        readonly capability: "runtime.read";
        readonly description: "Read health information for the Snow runtime and the resources it owns";
        readonly endpoint: "device";
    };
    readonly "runtime.reload": {
        readonly defaultTimeoutMs: 20000;
        readonly maximumTimeoutMs: 60000;
        readonly idempotent: false;
        readonly risk: "mutation";
        readonly stateful: true;
        readonly capability: "runtime.reload";
        readonly description: "Reload Discord with the latest verified Snow bundle";
        readonly endpoint: "device";
    };
    readonly "runtime.status": {
        readonly defaultTimeoutMs: 10000;
        readonly maximumTimeoutMs: 60000;
        readonly idempotent: true;
        readonly risk: "read";
        readonly stateful: false;
        readonly capability: "runtime.read";
        readonly description: "Read Snow, Discord, React, Hermes, loader, and runtime status";
        readonly endpoint: "device";
    };
    readonly "stores.describe": {
        readonly defaultTimeoutMs: 10000;
        readonly maximumTimeoutMs: 60000;
        readonly idempotent: false;
        readonly risk: "control";
        readonly stateful: true;
        readonly capability: "stores.read";
        readonly description: "Describe one initialized Flux-like store without invoking getters";
        readonly endpoint: "device";
    };
    readonly "stores.list": {
        readonly defaultTimeoutMs: 10000;
        readonly maximumTimeoutMs: 60000;
        readonly idempotent: true;
        readonly risk: "read";
        readonly stateful: false;
        readonly capability: "stores.read";
        readonly description: "List initialized Flux-like stores using descriptor-only discovery";
        readonly endpoint: "device";
    };
    readonly "themes.inspect": {
        readonly defaultTimeoutMs: 10000;
        readonly maximumTimeoutMs: 60000;
        readonly idempotent: true;
        readonly risk: "read";
        readonly stateful: false;
        readonly capability: "themes.read";
        readonly description: "Inspect installed and selected Snow themes";
        readonly endpoint: "device";
    };
    readonly "themes.preview": {
        readonly defaultTimeoutMs: 20000;
        readonly maximumTimeoutMs: 60000;
        readonly idempotent: false;
        readonly risk: "mutation";
        readonly stateful: true;
        readonly capability: "themes.write";
        readonly description: "Apply one temporary development theme";
        readonly endpoint: "device";
    };
    readonly "themes.restore": {
        readonly defaultTimeoutMs: 20000;
        readonly maximumTimeoutMs: 60000;
        readonly idempotent: false;
        readonly risk: "mutation";
        readonly stateful: true;
        readonly capability: "themes.write";
        readonly description: "Restore theme state after a development preview";
        readonly endpoint: "device";
    };
};
export type OperationName = keyof typeof operations;
export type DeviceOperationName = {
    [Name in OperationName]: (typeof operations)[Name]["endpoint"] extends "device" ? Name : never;
}[OperationName];
export type ServerOperationName = Exclude<OperationName, DeviceOperationName>;
export declare function isOperationName(value: string): value is OperationName;
export declare function isDeviceOperationName(value: string): value is DeviceOperationName;
export declare function isServerOperationName(value: string): value is ServerOperationName;
export declare function isMutationCapability(capability: Capability): boolean;
