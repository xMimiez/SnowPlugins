import type { ComponentType, ReactNode } from "react";
import type { IconName } from "./components/Icon";
/** A Snow icon name, a Discord asset ID, or a component. */
export type SettingsIcon = IconName | number | ComponentType;
type PageModule = {
    default: ComponentType<any>;
};
interface BaseRow {
    /** A React hook returning the title, also used as search text. */
    title: () => string;
    description?: () => string | undefined;
    trailing?: () => ReactNode;
    icon?: SettingsIcon;
    visible?: () => boolean;
    disabled?: () => boolean;
    /** A page row's ID: the row appears on that page instead of in a section. */
    parent?: string;
    /** Defaults to true. */
    searchable?: boolean;
}
export interface PageRow extends BaseRow {
    kind: "page";
    /** The page, or a loader for it that runs on first navigation. */
    page: ComponentType<any> | {
        load: () => Promise<PageModule>;
    };
}
export interface ToggleRow extends BaseRow {
    kind: "toggle";
    value: () => boolean;
    onChange(value: boolean): void;
}
export interface ActionRow extends BaseRow {
    kind: "action";
    onPress(): unknown;
}
export interface InfoRow extends BaseRow {
    kind: "info";
    onPress?(): unknown;
}
export type SettingsRow = PageRow | ToggleRow | ActionRow | InfoRow;
export interface SettingsSection {
    title: string;
    /** Row IDs in order. */
    rows: string[];
    /** Plugin sections sort ascending after Snow's section; ties keep registration order. */
    order?: number;
}
/**
 * Adds a row to Discord's settings, shown where a section or a parent page lists it. IDs are
 * prefixed with SNOW_ unless they already have it. Throws if the ID exists.
 */
export declare const registerSettingsRow: (id: string, row: SettingsRow) => () => void;
/** Adds a section to Discord's settings overview, after Snow's own section. */
export declare const registerSettingsSection: (id: string, section: SettingsSection) => () => void;
/**
 * Inserts a row into a Snow-registered section at an index; negative counts from the end, -1 is
 * last. Discord's own sections are not supported.
 */
export declare const insertSettingsRow: (sectionId: string, rowId: string, index?: number) => () => void;
export {};
