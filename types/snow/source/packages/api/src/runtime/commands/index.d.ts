import { SnowApplicationCommand } from "./types";
export declare function patchCommands(): () => boolean;
/**
 * Mutates the command to fill in its ID and defaults. The returned cleanup
 * removes the command and its execute patch. It is safe to call twice.
 */
export declare function registerCommand(command: SnowApplicationCommand): () => void;
