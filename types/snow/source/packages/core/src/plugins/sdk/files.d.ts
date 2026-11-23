import * as host from "@snow-internal/native/fs";
import type { SdkContext } from "./definition";
export declare function createSdkFiles(context: SdkContext): {
    readFile: (name: string, options?: Parameters<typeof host.readFile>[1]) => Promise<string>;
    writeFile: (name: string, contents: string) => Promise<void>;
    removeFile: (name: string) => Promise<undefined>;
    fileExists: (name: string) => Promise<boolean>;
    clearFolder: (name: string) => Promise<undefined>;
    downloadFile(url: string, name: string, options?: Parameters<typeof host.downloadFile>[2]): Promise<host.DownloadResult>;
};
