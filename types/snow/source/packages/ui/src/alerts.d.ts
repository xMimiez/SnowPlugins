import { InputAlertProps } from "@snow-internal/ui/components/InputAlert";
import type { JSX } from "react";
export declare const openAlert: any, dismissAlert: any;
export interface ConfirmationAlertOptions {
    title?: string;
    content: string | JSX.Element | (string | JSX.Element)[];
    confirmText?: string;
    confirmColor?: string;
    onConfirm: () => void;
    secondaryConfirmText?: string;
    onConfirmSecondary?: () => void;
    cancelText?: string;
    onCancel?: () => void;
    isDismissable?: boolean;
}
export declare function showConfirmationAlert(options: ConfirmationAlertOptions): any;
export declare const showCustomAlert: (component: React.ComponentType<any>, props: any) => any;
export declare const showInputAlert: (options: InputAlertProps) => any;
