import { TextStyles, ThemeColors } from "@snow-internal/ui/types";
import { Nullish } from "@snow-internal/api/lib/utils/types";
import { FC, JSX, MutableRefObject, PropsWithoutRef, ReactNode, Ref, RefObject } from "react";
import type * as RN from "react-native";
import { Falsy, ImageSourcePropType, PressableProps } from "react-native";
import { SharedValue } from "react-native-reanimated";
import type { SvgXml as NativeSvgXml } from "react-native-svg";
import { LiteralUnion } from "type-fest";
import type { DiscordIconProps } from "@snow-internal/discord/icons";
type Style = RN.ViewStyle & RN.ImageStyle & RN.TextStyle;
export type NotificationProgress = React.ComponentType<{
    percent: number;
}>;
type InteractiveSize = "sm" | "md" | "lg";
type ButtonVariant = "primary" | "secondary" | "tertiary" | "destructive" | "active";
interface ButtonProps {
    disabled?: boolean;
    onPress: () => void;
    loading?: boolean;
    variant?: LiteralUnion<ButtonVariant, string>;
    text?: string;
    size?: LiteralUnion<InteractiveSize, string>;
    iconPosition?: "start" | "end";
    scaleAmountInPx?: number;
    icon?: ImageSourcePropType | ReactNode;
    style?: Style;
    grow?: boolean;
}
export type Button = React.ForwardRefExoticComponent<ButtonProps>;
interface TwinButtonsProps {
    children: ReactNode;
}
export type TwinButtons = React.ComponentType<TwinButtonsProps>;
interface SegmentedControlItem {
    id: string;
    label: string;
    page?: JSX.Element | null;
}
export interface SegmentedControlStateArgs {
    items: SegmentedControlItem[];
    pageWidth: number;
    defaultIndex?: number;
}
export interface SegmentedControlState {
    activeIndex: SharedValue<number>;
    pagerRef: RefObject<unknown>;
    scrollTarget: SharedValue<number>;
    scrollOverflow: SharedValue<number>;
    scrollOffset: SharedValue<number>;
    items: SegmentedControlItem[];
    itemDimensions: SharedValue<unknown[]>;
    pageWidth: number;
    pressedIndex: SharedValue<number>;
    onPageChangeRef: MutableRefObject<unknown>;
    setActiveIndex: (index: number) => void;
    setItemDimensions: (index: number, dimensions: unknown[]) => void;
    useReducedMotion: boolean;
}
interface SegmentedControlProps {
    state: SegmentedControlState;
    variant?: string;
}
export type SegmentedControl = React.FC<SegmentedControlProps>;
interface SegmentedControlPagesProps {
    state: SegmentedControlState;
}
export type SegmentedControlPages = React.FC<SegmentedControlPagesProps>;
interface CompatSegmentedControlProps {
    values: string[];
    selectedSegmentIndex?: number;
    onValueChange?: (index: number) => void;
    onSetActiveIndex?: (index: number) => void;
}
export type CompatSegmentedControl = React.FC<CompatSegmentedControlProps>;
interface SliderProps {
    value: number;
    minimumValue: number;
    maximumValue: number;
    step?: number;
    onValueChange: (v: number) => void;
    minimumTrackTintColor?: string;
    maximumTrackTintColor?: string;
    thumbTintColor?: string;
    style?: RN.ViewStyle;
    disabled?: boolean;
}
export type Slider = React.FC<SliderProps>;
interface TextInputProps extends Omit<RN.TextInputProps, "onChange" | "onChangeText" | "value"> {
    defaultValue?: string;
    description?: string;
    editable?: boolean;
    errorMessage?: string;
    focusable?: boolean;
    grow?: boolean;
    isCentered?: boolean;
    isClearable?: boolean;
    isDisabled?: boolean;
    isRound?: boolean;
    label?: string;
    leadingIcon?: React.FC<any>;
    leadingPressableProps?: PressableProps;
    leadingText?: string;
    onChange?: (text: string) => void;
    size?: "sm" | "md" | "lg";
    state?: "error" | "default";
    style?: Style;
    trailingIcon?: React.FC<any>;
    trailingPressableProps?: PressableProps;
    trailingText?: string;
    value?: string | Nullish;
}
export type TextInput = React.FC<TextInputProps>;
interface RowButtonProps {
    variant?: LiteralUnion<ButtonVariant, string>;
    style?: Style;
    icon?: ImageSourcePropType | ReactNode;
    label: string | ReactNode;
    subLabel?: string | ReactNode;
    onPress: () => void;
    disabled?: boolean;
}
export type RowButton = React.FC<RowButtonProps>;
interface StackProps {
    direction?: "vertical" | "horizontal";
    spacing?: number;
}
export type Stack = React.FC<React.PropsWithChildren<StackProps> & RN.ViewProps>;
interface FABProps {
    icon: ImageSourcePropType | ReactNode;
    style?: Style;
    onPress: () => void;
    positionBottom?: number;
    positionRight?: number;
}
export type FloatingActionButton = React.FC<FABProps>;
interface ActionSheetProps {
    scrollable?: boolean;
}
export type ActionSheet = React.FC<React.PropsWithChildren<ActionSheetProps>>;
type TextProps = React.ComponentPropsWithRef<typeof RN.Text> & {
    variant?: TextStyles;
    color?: ThemeColors;
    lineClamp?: number;
    maxFontSizeMultiplier?: number;
};
export type Text = React.FC<TextProps>;
interface IconButtonProps {
    label?: string;
    icon: ImageSourcePropType | ReactNode;
    onPress: () => void;
    disabled?: boolean;
    size?: InteractiveSize;
    variant?: ButtonVariant;
    style?: Style;
}
export type IconButton = React.FC<IconButtonProps>;
export type PressableScale = React.FC<PropsWithoutRef<typeof RN.Pressable>>;
interface TableRowBaseProps {
    arrow?: boolean;
    label: string | ReactNode;
    subLabel?: string | ReactNode;
    variant?: LiteralUnion<"danger", string>;
    icon?: JSX.Element | Falsy;
    disabled?: boolean;
    trailing?: ReactNode | React.ComponentType<any>;
}
interface TableRowProps extends TableRowBaseProps {
    onPress?: () => void;
}
export type TableRow = React.FC<TableRowProps> & {
    Icon: TableRowIcon;
    TrailingText: TableRowTrailingText;
    Arrow: FC<{}>;
};
interface TableRowTrailingTextProps {
    text: string;
}
export type TableRowTrailingText = FC<TableRowTrailingTextProps>;
interface TableRowIconProps {
    style?: RN.ImageStyle;
    variant?: LiteralUnion<"danger", string>;
    source?: ImageSourcePropType;
    IconComponent?: React.ComponentType<{
        color: string;
        size?: DiscordIconProps["size"];
    }>;
}
export type TableRowIcon = React.FC<TableRowIconProps>;
export type SvgXml = typeof NativeSvgXml;
interface TableRowGroupProps {
    title?: string;
    titleStyleType?: string;
    style?: RN.StyleProp<RN.ViewStyle>;
    children: ReactNode;
}
export type TableRowGroup = React.FC<TableRowGroupProps>;
interface TableRadioGroupProps {
    title: string;
    titleStyle?: RN.StyleProp<RN.TextStyle>;
    value?: string;
    defaultValue?: string;
    hasIcons?: boolean;
    onChange: <T extends string>(type: T) => void;
    children: ReactNode;
}
export type TableRadioGroup = FC<TableRadioGroupProps>;
interface TableRadioRowProps extends TableRowBaseProps {
    value: string;
}
export type TableRadioRow = FC<TableRadioRowProps>;
interface TableSwitchRowProps extends TableRowBaseProps {
    value: boolean;
    onValueChange: (value: boolean) => void;
}
export type TableSwitchRow = FC<TableSwitchRowProps>;
interface TableCheckboxRowProps extends TableRowBaseProps {
    checked: boolean;
    onPress: () => void;
}
export type TableCheckboxRow = FC<TableCheckboxRowProps>;
interface ContextMenuItem {
    label: string;
    variant?: LiteralUnion<"destructive", string>;
    iconSource?: number;
    action: () => unknown;
}
interface ContextMenuProps {
    triggerOnLongPress?: boolean;
    disableGesture?: boolean;
    items: ContextMenuItem[] | ContextMenuItem[][];
    align?: "left" | "right" | "above" | "below" | "auto" | null;
    title?: string;
    children: FC<Pick<PressableProps, "accessibilityActions" | "onAccessibilityAction"> & {
        ref: Ref<RN.View>;
        onPress(): void;
        onLongPress?: () => void;
    }>;
}
export type ContextMenu = FC<ContextMenuProps>;
export {};
