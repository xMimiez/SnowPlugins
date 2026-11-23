import { type ClientMessage, type ProtocolMessage, type ServerMessage, type SerializableValue } from "./types.js";
export declare class ProtocolValidationError extends Error {
    constructor(message: string);
}
export declare function encodeMessage(message: ProtocolMessage): string;
/** Oversized results become a RESPONSE_TOO_LARGE error, never a truncated response. */
export declare function encodeResponseMessage(id: string, result: SerializableValue | undefined): string;
export declare function parseClientMessage(frame: string | ArrayBuffer): ClientMessage;
export declare function parseServerMessage(frame: string | ArrayBuffer): ServerMessage;
/** Finite numbers only, keys up to 256 characters, depth up to 80. */
export declare function isSerializableValue(value: unknown, depth?: number): value is SerializableValue;
