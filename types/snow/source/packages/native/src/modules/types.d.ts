export declare namespace RNModules {
    interface FileManager {
        fileExists: (path: string) => Promise<boolean>;
        getSize: (uri: string) => Promise<boolean>;
        readFile(path: string, encoding: "base64" | "utf8"): Promise<string>;
        saveFileToGallery?(uri: string, fileName: string, fileType: "PNG" | "JPEG"): Promise<string>;
        writeFile(storageDir: "cache" | "documents", path: string, data: string, encoding: "base64" | "utf8"): Promise<string>;
        removeFile(storageDir: "cache" | "documents", path: string): Promise<unknown>;
        clearFolder(storageDir: "cache" | "documents", path: string): Promise<boolean>;
        getConstants: () => {
            DocumentsDirPath: string;
            CacheDirPath: string;
        };
        /** @deprecated */
        DocumentsDirPath: string;
    }
    interface ClientInfoModule {
        getConstants(): {
            SentryAlphaBetaDsn: string;
            SentryStaffDsn: string;
            SentryDsn: string;
            DeviceVendorID: string;
            Manifest: string;
            Build: string;
            Version: string;
            ReleaseChannel: string;
            OTABuild: string;
            Identifier: string;
        };
    }
}
