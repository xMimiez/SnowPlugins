export interface CodeblockProps {
    selectable?: boolean;
    style?: import("react-native").TextStyle;
    children?: string;
}
export default function Codeblock({ selectable, style, children }: CodeblockProps): import("react").JSX.Element;
