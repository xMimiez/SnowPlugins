import type { PluginDefinition } from "./types";
export declare function pluginSourceUrl(runtimeId: string, artifactSha256: string): string;
type SourceEvaluator = (source: string, sourceUrl: string) => unknown;
export declare function evaluatePluginSource(source: string, sourceUrl: string, evaluator?: SourceEvaluator | undefined): unknown;
export declare function evaluateSnowPluginBundle(source: string, sourceUrl: string, evaluator?: SourceEvaluator): PluginDefinition;
export declare function withCompatibilityGlobal<T>(name: "bunny" | "vendetta", value: unknown, run: () => T): T;
export {};
