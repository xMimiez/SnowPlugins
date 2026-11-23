import type { ColorValue, ImageStyle } from "react-native";
export declare const buttonConstants: {
    DEFAULT_BUTTON_SIZE: string;
};
export declare const buttonStyles: {
    useIconSizeStyles(size: string, isIconButton?: boolean): ImageStyle;
    useButtonTextColorStyles(variant: string): {
        color: ColorValue;
    };
};
