export type UpdateChannel = "stable" | "nightly";
export interface UpdateArtifact {
    url: string;
    bytes: number;
    sha256: string;
}
export interface UpdateRelease {
    id: string;
    runtimeId: string;
    channel: UpdateChannel;
    version: string;
    sequence: number;
    commit: string;
    publishedAt: number;
    discordVersion: string;
    discordBuild: string;
    loaderRevision: number;
    storageRevision: number;
    hermesBytecode: number;
    bundle: UpdateArtifact;
    notices: string;
    releaseURL: string;
}
export interface UpdateManifest extends UpdateRelease {
    schemaVersion: 1;
}
export type UpdateReleaseSummary = Omit<UpdateRelease, "notices">;
export interface UpdateStatus {
    channel: UpdateChannel;
    configured: boolean;
    custom: boolean;
    returningToOfficial: boolean;
    returningToEmbedded: boolean;
    operation: "idle" | "checking" | "downloading" | "failed";
    operationId: number;
    running: Omit<UpdateReleaseSummary, "releaseURL" | "bundle">;
    offer: UpdateReleaseSummary | null;
    installation: UpdateReleaseSummary | null;
    pending: UpdateReleaseSummary | null;
    error: string | null;
    recovery: string | null;
    checkedAt: number | null;
    retryAt: number | null;
    hasCompatibleRelease: boolean;
    receivedBytes: number;
    totalBytes: number;
    downgrade: boolean;
}
declare const _default: {
    nativeBundleClear: () => Promise<null>;
    nativeDownload: () => Promise<null>;
    nativeReload: () => Promise<null>;
    nativeStatus: () => Promise<import("../loader").NativeBundleState>;
    status: () => Promise<UpdateStatus>;
    check: () => Promise<UpdateStatus>;
    checkIfDue: () => Promise<UpdateStatus>;
    consumeNotice: () => Promise<UpdateReleaseSummary | null>;
    download: (releaseId: string, allowDowngrade?: boolean) => Promise<UpdateStatus>;
    cancel: (operationId: number) => Promise<UpdateStatus>;
    setChannel: (channel: UpdateChannel) => Promise<UpdateStatus>;
    close: () => Promise<null>;
    reset: () => Promise<UpdateStatus>;
    useOfficial: () => Promise<UpdateStatus>;
    reject: () => Promise<null>;
    confirm: (releaseId: string) => Promise<null>;
};
export default _default;
