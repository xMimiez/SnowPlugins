/**
 * The React DevTools server in a `host`, `host:port`, or `[ipv6]:port` address, tolerating a
 * pasted `ws://` prefix. Undefined when the host is empty or the port is out of range.
 */
export declare function parseDevToolsAddress(address: string): {
    host: string;
    port: number;
} | undefined;
