import { Button as NativeButton, IconButton as NativeIconButton, FloatingActionButton as NativeFloatingActionButton } from "@snow-internal/discord/common/components";
import type { ComponentProps } from "react";
import { type IconName } from "./Icon";
type ButtonProps = Omit<ComponentProps<typeof NativeButton>, "icon"> & {
    icon?: IconName;
};
type IconButtonProps = Omit<ComponentProps<typeof NativeIconButton>, "icon"> & {
    icon: IconName;
};
type FloatingActionButtonProps = Omit<ComponentProps<typeof NativeFloatingActionButton>, "icon"> & {
    icon: IconName;
};
export declare function Button({ icon, ...props }: ButtonProps): import("react").JSX.Element;
export declare function IconButton({ icon, ...props }: IconButtonProps): import("react").JSX.Element;
export declare function FloatingActionButton({ icon, ...props }: FloatingActionButtonProps): import("react").JSX.Element;
export {};
