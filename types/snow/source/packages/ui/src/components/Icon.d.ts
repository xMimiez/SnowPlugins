import { type DiscordIconProps, type IconName } from "@snow-internal/discord/icons";
export type { IconName } from "@snow-internal/discord/icons";
export interface IconProps extends Omit<DiscordIconProps, "size"> {
    name: IconName;
    size?: number | DiscordIconProps["size"];
}
export default function Icon({ name, size, style, ...props }: IconProps): import("react").JSX.Element | null;
