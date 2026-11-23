import { React } from "@snow-internal/discord/common";
import { Falsy } from "react-native";
import type { JSX } from "react";
type ErrorBoundaryState = {
    hasErr: false;
} | {
    hasErr: true;
    error: Error;
};
export interface ErrorBoundaryProps {
    children: JSX.Element | Falsy | (JSX.Element | Falsy)[];
}
export default class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps);
    static contextType: any;
    static getDerivedStateFromError: (error: Error) => {
        hasErr: boolean;
        error: Error;
    };
    render(): (JSX.Element | Falsy)[] | JSX.Element | Falsy;
}
export {};
