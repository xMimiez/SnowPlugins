declare module "*.svg" {
    const svg: string;
    export default svg;
}

declare module "#snow-plugins" {
    const plugins: Record<string, import("@snow-internal/core/plugins/types").PluginDefinition>;
    export default plugins;
}

declare module "snow-build-info" {
    const version: string;
    const supportedDiscordBuild: number;
}
