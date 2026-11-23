import { type ReactNode } from "react";
export interface HelpMessageProps {
    messageType?: number;
    children?: ReactNode;
}
interface Parts {
    Card: any;
    Text: any;
}
export declare function createHelpMessage({ Card, Text }: Parts): ({ messageType, children }: HelpMessageProps) => import("react").DetailedReactHTMLElement<import("react").InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;
export {};
