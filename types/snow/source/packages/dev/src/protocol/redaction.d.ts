/** Credential keys. Used when rendering logs and errors on the Mac. */
export declare function isSecretInspectionKey(key: PropertyKey): boolean;
/** Credential and personal data keys. Used by live handle inspection. */
export declare function isSensitiveInspectionKey(key: PropertyKey): boolean;
export declare function isSensitiveInspectionString(value: string): boolean;
export declare function redactSensitiveInspectionString(value: string): string;
