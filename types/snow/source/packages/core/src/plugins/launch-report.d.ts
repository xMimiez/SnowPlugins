/** True once, shortly after the launch alert asked to show plugins with problems. */
export declare function consumeProblemsFilterRequest(): boolean;
/** Collected during launch; the alert lists each plugin once. */
export declare function reportLaunchProblem(id: string, name: string, message: string): void;
/** One alert per launch instead of one toast per plugin. */
export declare function showLaunchProblems(): Promise<void>;
