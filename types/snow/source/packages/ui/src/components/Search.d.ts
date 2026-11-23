import { ViewStyle } from "react-native";
export interface SearchProps {
    onChangeText?: (v: string) => void;
    placeholder: string;
    style?: ViewStyle;
    isRound?: boolean;
}
export default function Search({ onChangeText, placeholder, style, isRound }: SearchProps): import("react").JSX.Element;
