export declare function runExternalHydrationTransaction(hydrate: (registered: Set<string>) => Promise<void>, unregister: (id: string) => Promise<void>): Promise<void>;
