/**
 * Turns on a confirmed plan deepest first, each marked as turned on automatically, then the
 * plugin itself. If a step fails, the plugins this turned on are turned off again, newest first.
 */
export declare function enablePluginWithDependencies(id: string, turnOnFirst?: readonly string[]): Promise<void>;
/**
 * Turns the plugin and every plugin that requires it off. Optional dependents in switchOff are
 * turned off too; the others restart without it.
 */
export declare const disablePluginWithDependents: (id: string, switchOff?: readonly string[]) => Promise<void>;
/** Restarts each plugin so it binds optional dependencies that started after it. */
export declare function restartPlugins(ids: readonly string[]): Promise<void>;
/** Turns helpers off in order, skipping any that a plugin still on needs by then. */
export declare function disableUnneededHelpers(ids: readonly string[]): Promise<void>;
