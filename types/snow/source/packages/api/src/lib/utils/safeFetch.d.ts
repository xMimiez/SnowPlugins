/**
 * Rejects on non-2xx responses. The timeout only covers waiting for the
 * response headers. Reading the body has no deadline.
 */
export declare function safeFetch(input: RequestInfo | URL, options?: RequestInit, timeout?: number): Promise<Response>;
