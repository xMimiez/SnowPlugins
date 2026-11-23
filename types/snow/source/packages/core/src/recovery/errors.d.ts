/** The stack (or text), then each cause labelled as one, cut to 8 KB. */
export declare function describeError(error: unknown): string;
export declare function summarizeError(error: unknown): string;
/**
 * Chains onto React Native's global error handler and always calls the previous one. It never
 * replaces ErrorUtils itself: requireModule and the dev client swap the handler and restore it.
 * Calling it again chains again only when something replaced Snow's handler.
 */
export declare function chainGlobalErrorHandler(): void;
/**
 * Snow could not start: native shows a report with a one-time safe launch action, and Discord
 * continues without Snow. On a tweak without the report, the caller's log is all there is.
 */
export declare function reportStartFailure(error: unknown): void;
