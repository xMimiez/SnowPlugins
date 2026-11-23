/**
 * Snow's view of Discord's Metro modules. Existing callers import from here; the implementation
 * lives in the loader (factory wrapper), metro (registry), events, waits, and failure list.
 */
export { getImportingModuleId } from "./loader";
export { onModuleAboutToRun, onModuleFailed, onModuleLoaded, subscribeModule } from "./events";
export { getModuleFailures, type ModuleFailure } from "./failures";
export { isLoaded, metroModules, requireModule } from "./metro";
export { waitFor, waitForModule, type ModuleFilter, type WaitForModuleOptions, type WaitForOptions, } from "./wait";
