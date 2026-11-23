import { ViewStyle } from "react-native";
export interface SettingsTextInputProps {
    value: string;
    onChange: (v: string) => void;
    placeholder?: string;
    style?: ViewStyle;
    size?: "sm" | "md" | "lg";
    isClearable?: boolean;
    autoCapitalize?: "none" | "sentences" | "words" | "characters";
    autoCorrect?: boolean;
    leadingText?: string;
}
export default function SettingsTextInput({ value, onChange, placeholder, style, leadingText, size, isClearable, autoCapitalize, autoCorrect, }: SettingsTextInputProps): import("react").JSX.Element;
