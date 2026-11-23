import { Button } from "@snow-internal/discord/common/types/components";
import { ComponentProps, ComponentType } from "react";
type ActionButtonProps = Omit<ComponentProps<Button>, "onPress"> & {
    onPress?: () => void | Promise<unknown>;
};
export declare const AlertActionButton: ComponentType<ActionButtonProps>;
export default function AlertModal(props: Record<string, unknown>): import("react").JSX.Element;
export {};
