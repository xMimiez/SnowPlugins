import { type NormalizedError } from "./errors";
export type RuntimePhase = "capturing" | "preinitializing" | "initialized" | "starting" | "ready" | "stopping" | "stopped" | "failed";
export interface RuntimeSnapshot {
    phase: RuntimePhase;
    changedAt: number;
    error?: NormalizedError;
}
export declare class RuntimeCoordinator {
    #private;
    get snapshot(): Readonly<RuntimeSnapshot>;
    transition(phase: RuntimePhase): void;
    fail(error: unknown): void;
    initialize(task: () => Promise<void>): Promise<void>;
}
export declare const runtimeCoordinator: RuntimeCoordinator;
