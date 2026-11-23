export declare function showSheet<T extends React.ComponentType<any>>(key: string, lazyImport: Promise<{
    default: T;
}> | T, props?: React.ComponentProps<T>): void;
export declare function hideSheet(key: string): void;
