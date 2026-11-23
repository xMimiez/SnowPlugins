import { type ReactElement, type ReactNode } from "react";
export interface ProfileNameProps {
    user: {
        id: string;
    };
    guildId?: string;
}
type Wrap = (name: ReactElement<ProfileNameProps>) => ReactNode | undefined;
export declare function patchProfileName(wrap: Wrap): (() => boolean) | undefined;
export {};
