import { type PluginGraph } from "./dependency-plans";
/** A profile's entry for one plugin it turns on. */
export interface ProfilePlugin {
    /** Turned on only because another plugin in the profile needs it. */
    automatic?: boolean;
}
export interface ProfileSwitchPlan {
    /** Every non-core plugin that is on after the switch. */
    target: Record<string, ProfilePlugin>;
    /** Plugins in the target that are off now. */
    turnOn: string[];
    /** Plugins that are on now and off after the switch. */
    turnOff: string[];
    /** Plugins the profile wants that cannot be turned on. */
    staysOff: {
        id: string;
        reason: string;
    }[];
}
export declare function profileNameProblem(name: string, others: readonly string[]): string | undefined;
/**
 * What switching to a profile turns on and off. Dependencies are added as automatic; anything
 * quarantined, not compatible, missing, or with unmet dependencies stays off with a reason.
 */
export declare function planProfileSwitch(graph: PluginGraph, wanted: Readonly<Record<string, ProfilePlugin>>): ProfileSwitchPlan;
