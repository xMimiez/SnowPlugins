import { type ImageSourcePropType } from "react-native";
import { type IconName } from "./components/Icon";
export type ToastIcon = IconName | ImageSourcePropType;
export declare const showToast: (content: string, icon?: ToastIcon) => void;
