import type { RemoteObject, RemoteValue } from "@snow-internal/dev/protocol";
import type { InspectionSession } from "./coordinator";
interface ReactRendererSummary {
    id: number | string;
    packageName: string | null;
    version: string | null;
}
interface ReactRootSummary {
    rendererId: number | string;
    root: RemoteObject;
}
interface ReactTreeNode {
    fiber: RemoteObject;
    name: string;
    tag: number | null;
    key: string | null;
    children: ReactTreeNode[];
    truncated: boolean;
}
interface ReactAdapterStatus {
    available: boolean;
    reason: string;
    renderers: ReactRendererSummary[];
}
export declare class ReactInspector {
    #private;
    constructor(globalObject: object);
    status(): ReactAdapterStatus;
    roots(session: InspectionSession): ReactRootSummary[];
    tree(session: InspectionSession, handle: string, maximumDepth?: number, maximumNodes?: number): ReactTreeNode;
    element(session: InspectionSession, handle: string): Omit<ReactTreeNode, "children"> & {
        props: RemoteValue;
        state: RemoteValue;
    };
}
export {};
