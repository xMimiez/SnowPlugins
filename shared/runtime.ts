// Shared plugin runtime on the Snow SDK. Snow scopes patches, hooks, sheets and alerts to the plugin itself.
/* eslint-disable @typescript-eslint/no-explicit-any */
// Default imports: these are the host's own objects, which patches and identity checks need. `import *` gives a frozen copy.
import React from "react";
import RN from "react-native";
import * as patcher from "@snow/api/patcher";
import * as commands from "@snow/api/commands";
import * as flux from "@snow/api/flux";
import * as jsx from "@snow/api/react/jsx";
import * as metro from "@snow/discord";
import * as common from "@snow/discord/common";
import * as discordComponents from "@snow/discord/common/components";
import * as snowComponents from "@snow/ui/components";
import * as sheets from "@snow/ui/sheets";
import * as alerts from "@snow/ui/alerts";
import { showToast } from "@snow/ui/toasts";
import { createPluginStore } from "@snow/core/storage";
import { definePlugin, plugin, signal, onDispose } from "@snow/plugin";

// Discord's modules are untyped and move between builds, so everything looked up at runtime is `any`.
export type Any = any;
type Settings = Record<string, Any>;
export type Runtime = ReturnType<typeof createRuntime>;
export interface PluginInstance { start?(): unknown; stop?(): unknown; Settings?: React.ComponentType<Any>; [key: string]: Any }
export interface PluginFactory { (r: Runtime): PluginInstance; defaults?: Settings }

export function createRuntime(defaults: Settings = {}) {
    const D: Any = discordComponents;
    const C: Any = { ...discordComponents, ...snowComponents };
    const listeners = new Set<() => void>();
    const requests = new Set<() => void>();
    const openSheets = new Map<string, () => void>();
    const { useStore, settings } = createPluginStore<Settings>(plugin.id, JSON.parse(JSON.stringify(defaults)));
    const flush = () => useStore.getState().updateSettings({});
    const r = {
        meta: plugin, React: React as Any, RN: RN as Any, C, D, h: React.createElement as Any, store: settings,
        common: common as Any,
        // Bunny-era names the ported plugins still read.
        metro: metro as Any, host: { metro: { ...metro, common: { ...common, components: discordComponents } } } as Any,
        context: { signal },
        get active() { return !signal.aborted; },
        status: {} as Record<string, Any>,
        api: { jsx: jsx as Any, patcher: patcher as Any, storage: { flush }, ui: alerts as Any },
        own: onDispose as (cleanup: () => unknown) => () => unknown,
        changed() { for (const fn of listeners) fn(); },
        useRefresh() {
            useStore();
            const [, bump] = React.useState(0);
            React.useEffect(() => { if (!r.active) return; const fn = () => bump(n => n + 1); listeners.add(fn); return () => { listeners.delete(fn); }; }, []);
            return () => r.changed();
        },
        set(key: string, value: Any) {
            if (!r.active) return;
            // Snow saves on every write; a failed save is logged by Snow.
            settings[key] = value;
            r.changed();
        },
        find(...props: string[]): Any { try { return metro.findByProps(...props); } catch { return undefined; } },
        byName(name: string, raw = false): Any { try { return metro.findByName(name, !raw) || metro.findByDisplayName(name, !raw); } catch { return undefined; } },
        byStore(name: string): Any { try { return metro.findByStoreName(name); } catch { return undefined; } },
        toast(message: unknown, icon?: Any) {
            if (!r.active) return;
            try { (showToast as Any)(String(message), icon); } catch { (showToast as Any)(String(message)); }
        },
        error(label: string, error: Any) { const text = `${label}: ${error?.message || error}`; console.error(`[${plugin.name}]`, text); r.status.lastError = text; r.changed(); r.toast(text); },
        patch(kind: "before" | "after" | "instead", parent: Any, key: string, callback: (...args: Any[]) => Any) {
            if (typeof parent?.[key] !== "function") return false;
            (patcher[kind] as Any)(key, parent, callback);
            return true;
        },
        subscribe(type: string, callback: (payload: Any) => void) { return (flux as Any).subscribe(type, callback) as () => void; },
        channelId(ctx: Any): string | null {
            if (typeof ctx === "string" && /^\d{5,}$/.test(ctx)) return ctx;
            if (ctx && !Array.isArray(ctx)) {
                const id = ctx.channel?.id || ctx.channel?.channelId || ctx.channelId || ctx.channel_id;
                if (id) return id;
            }
            const selected = r.byStore("SelectedChannelStore");
            return selected?.getChannelId?.() || selected?.getCurrentlySelectedChannelId?.() || selected?.getLastSelectedChannelId?.() || null;
        },
        local(channelId: string, content: unknown) {
            if (!r.active) return false;
            const util = r.find("sendBotMessage");
            if (typeof util?.sendBotMessage === "function") {
                try { util.sendBotMessage(channelId, content); return true; } catch { /* fall back to a toast */ }
            }
            r.toast(String(content));
            return false;
        },
        command(command: Any) {
            const name = command.name, execute = command.execute;
            return (commands as Any).registerCommand({
                ...command,
                options: (command.options || []).map((opt: Any) => ({ ...opt })),
                async execute(args: Any, ctx: Any) {
                    try { return await execute(args, ctx); } catch (error) { if (r.active) r.error(`/${name}`, error); }
                },
            }) as () => void;
        },
        async request(url: string, options: Any = {}, timeout = 15000, maxBytes = Infinity) {
            if (!r.active) throw new Error("Plugin stopped");
            const controller = new AbortController();
            let rejectDeadline: (error: Error) => void = () => {};
            const deadline = new Promise<never>((_, reject) => { rejectDeadline = reject; });
            const abort = () => { controller.abort(); rejectDeadline(new Error(r.active ? "Request timed out" : "Plugin stopped")); };
            requests.add(abort);
            signal.addEventListener("abort", abort, { once: true });
            const timer = setTimeout(abort, timeout);
            try {
                const response = await Promise.race([fetch(url, { ...options, signal: controller.signal }), deadline]);
                if (Number(response.headers?.get("content-length")) > maxBytes) { controller.abort(); throw new Error("Response exceeds the preview size limit"); }
                const text = await Promise.race([response.text(), deadline]);
                if (text.length > maxBytes) throw new Error("Response exceeds the preview size limit");
                if (!r.active) throw new Error("Plugin stopped");
                if (!response.ok) {
                    let body: Any; try { body = JSON.parse(text); } catch { body = {}; }
                    const error: Any = new Error(body.message || `HTTP ${response.status}`);
                    error.status = response.status; error.retryAfter = Number(body.retry_after) || 0; throw error;
                }
                return { response, text, json() { return text ? JSON.parse(text) : null; } };
            } finally { clearTimeout(timer); requests.delete(abort); signal.removeEventListener("abort", abort); }
        },
        async discord(path: string, options: Any = {}) {
            if (!path.startsWith("/") || path.startsWith("//")) throw new Error("Invalid Discord API path");
            if (!r.active) throw new Error("Plugin stopped");
            const found = r.find("HTTP", "get", "post", "put", "patch", "del") || r.find("get", "post", "put", "del");
            const client = found?.HTTP || found;
            const method = (options.method || "GET").toLowerCase().replace(/^delete$/, "del");
            if (typeof client?.[method] !== "function") throw new Error("Discord HTTP client unavailable");
            try {
                const response = await client[method]({ url: path, ...(options.body != null ? { body: typeof options.body === "string" ? JSON.parse(options.body) : options.body } : {}) });
                if (!r.active) throw new Error("Plugin stopped");
                if (response?.status >= 400) throw Object.assign(new Error(response.body?.message || `HTTP ${response.status}`), { status: response.status, body: response.body });
                return { response, json() { return response?.body ?? null; } };
            } catch (cause: Any) {
                const error: Any = new Error(cause?.body?.message || cause?.message || "Discord request failed");
                error.status = cause?.status; error.retryAfter = Number(cause?.body?.retry_after) || 0;
                throw error;
            }
        },
        hook(names: string[], transform: (element: Any, name: string) => Any) {
            const set = new Set(names);
            for (const name of names) {
                (jsx as Any).onJsxCreate(name, (_Component: Any, element: Any) => {
                    r.status[name] = (r.status[name] || 0) + 1;
                    try { return transform(element, name); } catch (error) { r.error(`JSX ${name}`, error); }
                });
            }
            r.patch("after", React, "createElement", (args: Any[], result: Any) => {
                if (!result) return;
                const type = args[0];
                const name = typeof type === "string" ? type : (type?.displayName || type?.name || type?.type?.name);
                if (!name || !set.has(name)) return;
                r.status[name] = (r.status[name] || 0) + 1;
                try { return transform(result, name) ?? result; } catch (error) { r.error(`createElement ${name}`, error); }
            });
        },
        // Discord builds each native chat row from this input. A returned copy replaces it for that row only.
        patchMessageInput(transform: (input: Any) => Any) {
            const redrawn = new Set<string>();
            let failed = false;
            // Rows drawn before the plugin started are redrawn once, so the change shows without reopening the chat.
            r.patch("before", r.byName("ChatManager")?.prototype, "determineChangeType", (args: Any[]) => {
                const id = args[0]?.message?.id;
                if (r.active && id && !redrawn.has(id)) { redrawn.add(id); args[0].forceRender = true; }
            });
            return r.patch("before", r.byName("createMessageContent", true), "default", (args: Any[]) => {
                if (!r.active) return;
                try { const next = transform(args[0]); if (next) return [next, ...args.slice(1)]; }
                catch (error) { if (!failed) console.error(`[${plugin.name}] Could not change a chat row`, error); failed = true; }
            });
        },
        patchRows(transform: (rows: Any) => Any) {
            const apply = (value: Any) => {
                try {
                    const wasString = typeof value === "string";
                    const next = transform(wasString ? JSON.parse(value) : value);
                    if (next == null) return value;
                    return wasString ? (typeof next === "string" ? next : JSON.stringify(next)) : next;
                } catch { return value; }
            };
            const modules: Any = RN.NativeModules || {};
            for (const key of Object.keys(modules)) {
                if (typeof modules[key]?.updateRows === "function") {
                    r.patch("before", modules[key], "updateRows", (args: Any[]) => { if (args && args[1] != null) args[1] = apply(args[1]); });
                }
            }
            const manager = r.byName("RowManager");
            const proto = manager?.prototype || manager;
            if (typeof proto?.generate === "function") r.patch("after", proto, "generate", (_args: Any[], row: Any) => apply(row));
        },
        hideSheets() { for (const close of [...openSheets.values()]) close(); },
        open(key: string, Component: React.ComponentType<Any>, props: Any = {}, options: { scrollable?: boolean; height?: number } = {}) {
            if (!r.active) throw new Error("Plugin stopped");
            const ActionSheet = D.ActionSheet;
            if (!ActionSheet) throw new Error("Snow bottom-sheet components unavailable");
            openSheets.get(key)?.();
            let closed = false;
            const close = () => { if (closed) return; closed = true; if (openSheets.get(key) === close) openSheets.delete(key); sheets.hideSheet(key); };
            class Boundary extends React.Component<{ children?: React.ReactNode }, { error: Any }> {
                state = { error: null as Any };
                static getDerivedStateFromError(error: Any) { return { error }; }
                componentDidCatch(error: Any) { r.error("Sheet rendering", error); }
                render() { if (!this.state.error) return this.props.children; const U = ui(r); return r.h(U.Page, { title: "Could not display this page", close }, r.h(U.Text, null, this.state.error.message)); }
            }
            function Page() {
                React.useEffect(() => () => { if (openSheets.get(key) === close) openSheets.delete(key); closed = true; }, []);
                return r.h(ActionSheet, { scrollable: options.scrollable ?? true, startHeight: options.height }, r.h(Boundary, null, r.h(Component, { ...props, close })));
            }
            openSheets.set(key, close);
            try { sheets.showSheet(key, Page); } catch (error) { close(); throw error; }
            return close;
        },
        copy(text: unknown) { if (!r.active) return; const clip = r.common.clipboard || r.find("setString"); if (!clip?.setString) throw new Error("Clipboard unavailable"); clip.setString(String(text)); r.toast("Copied"); },
    };
    onDispose(() => { for (const abort of requests) abort(); requests.clear(); r.changed(); listeners.clear(); });
    return r;
}

const MEDIA_TYPE = /^(image|video)\//i, MEDIA_FILE = /\.(png|jpe?g|gif|webp|mp4|mov|webm)$/i;

/** What `spoilerInput` lets a plugin change on its copy of the message before the row is built. */
export interface MessageDraft { id: string; content: Any; embeds: Any; attachments: Any[] }

/**
 * A copy of the row input whose image and video attachments are spoilers, so Discord draws its own
 * tap-to-reveal cover. The stored message is never written to, so nothing builds up between renders.
 * `edit` may change the copied content, embeds and attachments first. Undefined keeps the input.
 */
// shortcut: media in bot gallery components is not covered, add it when a channel needs it.
export function spoilerInput(input: Any, edit?: (draft: MessageDraft) => void): Any {
    const message = input?.message;
    if (typeof message?.set !== "function" || !input.options) return;
    const attachments: Any[] = Array.isArray(message.attachments) ? message.attachments : [];
    const draft: MessageDraft = {
        id: message.id, content: message.content, embeds: message.embeds,
        // Discord reads the spoiler from bit 8 of the attachment flags.
        attachments: attachments.map(item => MEDIA_TYPE.test(item?.content_type) || MEDIA_FILE.test(item?.filename) ? { ...item, spoiler: true, flags: item.flags | 8 } : item),
    };
    edit?.(draft);
    const changed = draft.attachments.length !== attachments.length || draft.attachments.some((item, index) => item !== attachments[index]);
    if (!changed && draft.content === message.content && draft.embeds === message.embeds) return;
    let next = changed ? message.set("attachments", draft.attachments) : message;
    if (draft.content !== message.content) next = next.set("content", draft.content);
    if (draft.embeds !== message.embeds) next = next.set("embeds", draft.embeds);
    return { ...input, message: next, options: { ...input.options, shouldObscureSpoiler: true } };
}

export function ui(r: Runtime) {
    const { h, RN, store } = r;
    const colors = { background: "#111214", surface: "#1E1F22", surfacePressed: "#26272B", border: "#2B2D31", text: "#F2F3F5", muted: "#B5BAC1", accent: "#5865F2", danger: "#F23F43" };
    const palette: Record<string, string> = { "text-danger": colors.danger, "text-warning": "#FEE75C", "text-muted": colors.muted, "text-normal": colors.text };
    function Text({ children, muted = false, heading = false, color, style, ...props }: Any) {
        const resolved = palette[color] || (muted ? colors.muted : colors.text);
        const base = heading
            ? { color: colors.muted, fontSize: 13, lineHeight: 18, fontWeight: "600", marginLeft: 4, marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 }
            : { color: resolved, fontSize: muted ? 13 : 16, lineHeight: muted ? 18 : 21, fontWeight: muted ? "400" : "600" };
        return h(RN.Text, { ...props, style: [base, style] }, children);
    }
    function Button({ text, onPress, disabled, variant = "primary", ...props }: Any) {
        const primary = variant !== "secondary";
        return h(RN.Pressable || RN.TouchableOpacity, {
            ...props,
            accessibilityRole: "button",
            accessibilityLabel: text,
            accessibilityState: { disabled: !!disabled },
            disabled: !!disabled,
            onPress,
            style: ({ pressed }: { pressed?: boolean } = {}) => ({
                minHeight: 48,
                borderRadius: 12,
                paddingHorizontal: 16,
                backgroundColor: primary ? (pressed ? "#4752C4" : colors.accent) : (pressed ? colors.surfacePressed : colors.surface),
                borderWidth: primary ? 0 : 1,
                borderColor: colors.border,
                alignItems: "center",
                justifyContent: "center",
                opacity: disabled ? 0.5 : 1,
            }),
        }, h(RN.Text, { style: { color: primary ? "#FFFFFF" : colors.muted, fontSize: 16, lineHeight: 20, fontWeight: "700" } }, text));
    }
    function Input({ value, onChange, label, secureTextEntry, style, ...props }: Any) {
        const field = h(RN.TextInput, {
            ...props,
            value: value == null ? "" : String(value),
            onChangeText: onChange,
            secureTextEntry: !!secureTextEntry,
            placeholderTextColor: "#6D6F78",
            autoCorrect: false,
            selectionColor: colors.accent,
            style: [{ minHeight: 50, color: colors.text, fontSize: 16, lineHeight: 21, backgroundColor: "#151619", borderRadius: 12, borderWidth: 1, borderColor: colors.border, paddingHorizontal: 14, paddingVertical: 12 }, style],
        });
        if (!label) return field;
        return h(RN.View, { style: { gap: 8 } },
            h(RN.Text, { style: { color: colors.muted, fontSize: 13, lineHeight: 18, fontWeight: "600", marginLeft: 4 } }, label),
            field);
    }
    function Toggle({ setting, label, subLabel }: { setting: string; label: string; subLabel?: string }) {
        r.useRefresh();
        return h(RN.View, { style: { minHeight: 72, flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingVertical: 12, gap: 12 } },
            h(RN.View, { style: { flex: 1 } },
                h(RN.Text, { style: { color: colors.text, fontSize: 16, lineHeight: 21, fontWeight: "600", marginBottom: subLabel ? 3 : 0 } }, label),
                subLabel ? h(RN.Text, { style: { color: colors.muted, fontSize: 14, lineHeight: 19 } }, subLabel) : null),
            h(RN.Switch, {
                accessibilityLabel: label,
                value: !!store[setting],
                onValueChange: (value: boolean) => r.set(setting, value),
                trackColor: { false: "#3F4147", true: colors.accent },
                thumbColor: "#FFFFFF",
                ios_backgroundColor: "#3F4147",
            }));
    }
    function Slider({ value, onValueChange, ...props }: Any) {
        return h(Input, {
            ...props,
            value: String(value),
            onChange: (text: string) => {
                const next = Number(text);
                onValueChange(Number.isFinite(next) ? next : 0);
            },
            keyboardType: "numeric",
        });
    }
    function card(rows: Any[]) {
        return h(RN.View, { style: { backgroundColor: colors.surface, borderRadius: 16, borderWidth: 1, borderColor: colors.border, overflow: "hidden" } }, ...rows);
    }
    function Page({ title, children, close }: { title?: string; children?: Any; close?: () => void }) {
        const items: Any[] = [];
        const walk = (value: Any) => {
            if (value == null || value === false) return;
            if (Array.isArray(value)) { value.forEach(walk); return; }
            items.push(value);
        };
        walk(children);
        const blocks: Any[] = [];
        let toggles: Any[] = [];
        const flush = () => {
            if (!toggles.length) return;
            const rows: Any[] = [];
            toggles.forEach((node, index) => {
                if (index) rows.push(h(RN.View, { key: "divider-" + index, style: { height: 1, backgroundColor: colors.border, marginLeft: 16 } }));
                rows.push(node);
            });
            blocks.push(card(rows));
            toggles = [];
        };
        for (const child of items) {
            if (child.type === Toggle) { toggles.push(child); continue; }
            flush();
            if (child.type === Input) {
                blocks.push(card([h(RN.View, { key: "field", style: { padding: 14 } }, child)]));
                continue;
            }
            blocks.push(child);
        }
        flush();
        const body: Any[] = [];
        if (title) body.push(h(RN.Text, { key: "title", accessibilityRole: "header", style: { color: colors.muted, fontSize: 13, lineHeight: 18, fontWeight: "600", marginLeft: 4, marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 } }, title));
        blocks.forEach((block, index) => {
            if (body.length && !(title && index === 0)) body.push(h(RN.View, { key: "gap-" + index, style: { height: 22 } }));
            body.push(block);
        });
        if (close) {
            if (body.length) body.push(h(RN.View, { key: "gap-close", style: { height: 22 } }));
            body.push(h(Button, { key: "close", text: "Close", variant: "secondary", onPress: close }));
        }
        return h(RN.ScrollView, {
            style: { flex: 1, backgroundColor: colors.background },
            contentContainerStyle: { paddingHorizontal: 16, paddingTop: 18, paddingBottom: 36 },
            keyboardShouldPersistTaps: "handled",
            showsVerticalScrollIndicator: false,
        }, ...body);
    }
    return { Text, Button, Page, Input, Toggle, Slider };
}

/** The plugin's default export: one runtime and one instance per start, cleaned up by Snow's scope. */
export function register(factory: PluginFactory) {
    const r = createRuntime(factory.defaults);
    const instance = factory(r);
    return definePlugin({
        async start() { try { await instance.start?.(); } catch (error) { r.error("Start failed", error); throw error; } },
        async stop() { await instance.stop?.(); },
        ...(instance.Settings ? { settings: instance.Settings } : {}),
    });
}
