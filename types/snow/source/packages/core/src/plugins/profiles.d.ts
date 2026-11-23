import { type ProfilePlugin, type ProfileSwitchPlan } from "./profile-plan";
export interface PluginProfile {
    id: string;
    name: string;
    plugins: Record<string, ProfilePlugin>;
    createdAt: number;
    updatedAt: number;
}
interface ProfilesState {
    loaded: boolean;
    activeId: string;
    profiles: PluginProfile[];
    /** Set for a launch running a profile once; nothing is mirrored or saved during it. */
    launchOnlyId?: string;
}
export declare const useProfiles: import("zustand").UseBoundStore<import("zustand").StoreApi<ProfilesState>>;
/**
 * Loads profiles before any plugin starts. A next-launch-only pointer is consumed here, and its
 * profile's plugins are used in memory for this launch without saving any flag.
 */
export declare function loadProfiles(): Promise<void>;
/** Drops an uninstalled plugin from every profile. */
export declare function removePluginFromProfiles(id: string): void;
export declare function createProfile(name: string, fromCurrent: boolean): void;
export declare function renameProfile(id: string, name: string): void;
export declare function duplicateProfile(id: string): void;
export declare function deleteProfile(id: string): void;
export declare function previewProfile(id: string): ProfileSwitchPlan;
/**
 * Records the switch, saves the profile's plugins as the live flags, marks it active, and
 * reloads Discord. Nothing reloads unless every write finished; if a write fails after the
 * switch was recorded, the next launch finishes it. Quarantined plugins are never saved as on.
 */
export declare function switchProfile(id: string): Promise<void>;
/** Runs the profile for the next launch only, then the active profile again after that. */
export declare function runProfileNextLaunch(id: string): Promise<void>;
export {};
