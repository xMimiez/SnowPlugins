import { TableRowIcon } from "@snow-internal/discord/common/components";
import { type IconName } from "@snow-internal/discord/icons";
import type { ComponentProps } from "react";
export interface RowIconProps extends Omit<ComponentProps<typeof TableRowIcon>, "source" | "IconComponent"> {
    name: IconName;
}
export default function RowIcon({ name, ...props }: RowIconProps): import("react").JSX.Element;
