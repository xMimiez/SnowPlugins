export declare class ExternalStartupMarkerCoordinator {
    #private;
    acquire(runtimeId: string, deferred: boolean, dependents?: ReadonlySet<string>): Promise<boolean>;
    release(runtimeId: string): void;
}
export declare const externalStartupMarkers: ExternalStartupMarkerCoordinator;
