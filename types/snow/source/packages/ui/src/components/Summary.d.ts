import type { IconName } from "./Icon";
import type { JSX } from "react";
export interface SummaryProps {
    label: string;
    icon?: IconName;
    noPadding?: boolean;
    noAnimation?: boolean;
    children: JSX.Element | JSX.Element[];
}
export default function Summary({ label, icon, noPadding, noAnimation, children, }: SummaryProps): JSX.Element;
