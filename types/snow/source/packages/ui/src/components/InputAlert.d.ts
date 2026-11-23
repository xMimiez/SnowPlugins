export interface InputAlertProps {
    title?: string;
    confirmText?: string;
    confirmColor?: string;
    /** A rejected promise keeps the alert open and displays the error's message. */
    onConfirm: (input: string) => void | Promise<void>;
    cancelText?: string;
    placeholder?: string;
    initialValue?: string;
    secureTextEntry?: boolean;
    onClose?: () => void;
}
export default function InputAlert({ title, confirmText, confirmColor, onConfirm, cancelText, placeholder, initialValue, secureTextEntry, onClose, }: InputAlertProps): import("react").JSX.Element;
