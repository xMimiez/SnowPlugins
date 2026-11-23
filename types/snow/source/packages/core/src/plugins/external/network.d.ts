interface NetInfoModule {
    fetch(): Promise<{
        type?: unknown;
        isConnected?: unknown;
    }>;
}
/**
 * Discord bundles React Native community NetInfo; it is found by its export shape. Undefined
 * means the network type cannot be read on this build, so the Wi-Fi-only setting is hidden.
 */
export declare function findNetInfo(): Promise<NetInfoModule | undefined>;
/** True when NetInfo reports Wi-Fi or Ethernet; false when it cannot tell. */
export declare function isOnWifi(): Promise<boolean>;
export {};
