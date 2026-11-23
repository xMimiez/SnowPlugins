import { TextStyles } from "@snow-internal/ui/types";
import { ImageStyle, TextStyle, ViewStyle } from "react-native";
type NamedStyles<T> = {
    [P in keyof T]: ViewStyle | TextStyle | ImageStyle;
};
export declare const ThemeContext: any;
export declare const TextStyleSheet: Record<TextStyles, TextStyle>;
/** Returns a hook, so call the result inside a component. */
export declare function createStyles<T extends NamedStyles<T>>(sheet: T | ((props: any) => T)): () => T;
export declare function createLegacyClassComponentStyles<T extends NamedStyles<T>>(sheet: T | ((props: any) => T)): (ctxt: typeof ThemeContext) => T;
export {};
