import type { ComponentType, JSX } from "react";
type Callback = (Component: any, ret: JSX.Element) => JSX.Element | void;
/**
 * A component, matched by identity against the element type (functions, classes, and the objects
 * React uses for memo, forwardRef, lazy, and providers), or a string, matching a host type such as
 * "RCTView" exactly or a function or class component by its name.
 */
export type JsxTarget = string | ComponentType<any> | object;
export type JsxArgs = [type: any, props: any, key?: any];
export interface JsxHooks {
    /** Mutate the arguments or return replacements. Changing the type does not run its hooks. */
    before?(args: JsxArgs): JsxArgs | void;
    /**
     * Create the element yourself or call next for the lower-priority hooks and React's factory.
     * Returning null renders nothing; some Discord code inspects the elements it creates.
     */
    instead?(args: JsxArgs, next: (...args: JsxArgs) => JSX.Element | null): JSX.Element | null;
    /** Return a replacement element, or undefined to keep it. */
    after?(element: JSX.Element | null, target: any): JSX.Element | null | void;
}
/**
 * Hooks element creation for one component: before rewrites the type, props, or key; instead
 * replaces creation; after replaces the created element. Higher priority runs first in each phase
 * (the outermost instead hook). When a function component matches both by identity and by name,
 * the two sets merge by priority, and at equal priority identity hooks run first. A hook that throws is logged and skipped, and turned off after 3
 * failures. Applies to elements created after registration; React.createElement and code holding
 * its own reference to the JSX factory bypass hooks.
 */
export declare function hookJsx(target: JsxTarget, hooks: JsxHooks, options?: {
    priority?: number;
}): () => void;
/**
 * Matches components by identity or function name at element creation. Return a replacement
 * element, or undefined to keep the original. Pair with deleteJsxCreate on stop.
 */
export declare function onJsxCreate(Component: JsxTarget, callback: Callback): void;
/** Removes one registration. Unknown callbacks are ignored. */
export declare function deleteJsxCreate(Component: JsxTarget, callback: Callback): void;
export {};
