// Fallback for any library. For named imports with types, declare the exact module,
// for example `declare module "@snow-library/example.lib" { export function greet(): string; }`.
declare module "@snow-library/*" {
    /** False when an optional library is not installed or not running at this start. */
    export const available: boolean;
    const api: any;
    export default api;
}