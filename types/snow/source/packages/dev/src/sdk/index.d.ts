export type { Developer, PluginCleanup, PluginContext, PluginDefinition, PluginLifecycle, } from "@snow-internal/core/plugins/types";
export type { Argument as CommandArgument, CommandContext, CommandResult, SnowApplicationCommand, } from "@snow-internal/api/commands/types";
import type { PluginDefinition } from "@snow-internal/core/plugins/types";
/** Only type-checks. Snow registers and starts the plugin when it loads the bundle. */
export declare function definePlugin(definition: PluginDefinition): PluginDefinition;
