export interface NormalizedError {
    message: string;
    name: string;
    stack?: string;
}
export declare function normalizeError(error: unknown): NormalizedError;
