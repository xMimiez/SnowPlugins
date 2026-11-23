import { register, spoilerInput, ui, type Any, type MessageDraft, type Runtime } from "../../../shared/runtime";

const SNOWFLAKE = /^\d{15,22}$/;
const IMAGE_EXT = /\.(png|jpe?g|gif|webp)(\?|#|$)/i;
const GIF_HOST = /(?:^|\.)(?:tenor\.com|tenor\.co|giphy\.com|gph\.is|imgur\.com|gfycat\.com|redgifs\.com)$/i;
const NEWEST = 50;

// A GIF picked from Tenor or Giphy is a gifv embed played as video. Embed media has no spoiler flag.
function isGifLink(url: unknown) {
    if (typeof url !== "string" || !/^https?:/i.test(url)) return false;
    const path = url.split("#")[0];
    const host = path.replace(/^https?:\/\//i, "").split(/[/?]/)[0].replace(/^www\./i, "");
    if (/\.gif(\?|$)/i.test(path)) return true;
    if (GIF_HOST.test(host)) return true;
    return /tenor\.com|giphy\.com|gph\.is|gfycat\.com|redgifs\.com/i.test(path) && /\.(gif|mp4|webm)(\?|$)/i.test(path);
}

function isGifEmbed(embed: Any) {
    if (!embed || typeof embed !== "object") return false;
    const type = String(embed.type || "").toLowerCase();
    if (type === "gifv" || type === "gif") return true;
    if (/tenor|giphy|imgur|gfycat|redgifs/i.test(embed.provider?.name || "")) return true;
    return [embed.url, embed.video?.url, embed.video?.proxy_url, embed.image?.url, embed.thumbnail?.url].some(isGifLink);
}

// The same message and link always give the same attachment id, so a redrawn row keeps its reveal state.
function spoilerId(seed: string) {
    let hash = 2166136261;
    for (let i = 0; i < seed.length; i++) {
        hash ^= seed.charCodeAt(i);
        hash = Math.imul(hash, 16777619);
    }
    const body = (hash >>> 0).toString().padStart(10, "0");
    return `8${body}${body}`.slice(0, 18);
}

// The native video cell already spoilers attachments. A linked GIF becomes one of those on the copy.
function promoteGifEmbeds(draft: MessageDraft) {
    if (!Array.isArray(draft.embeds) || !draft.embeds.length) return;
    const kept: Any[] = [];
    const additions: Any[] = [];
    for (const embed of draft.embeds) {
        const media = embed?.video || embed?.image || embed?.thumbnail || null;
        const proxy = media?.proxy_url || media?.proxyURL || media?.url || embed?.url;
        const source = media?.url || embed?.url || proxy;
        if (!isGifEmbed(embed) || typeof proxy !== "string" || !/^https?:/i.test(proxy)) {
            kept.push(embed);
            continue;
        }
        if (draft.attachments.some(item => item && (item.url === source || item.url === proxy || item.proxy_url === proxy || item.proxy_url === source))) continue;
        const video = !!embed.video;
        additions.push({
            id: spoilerId(`${draft.id || ""}:${source}`),
            filename: video ? "SPOILER_gif.mp4" : "SPOILER_gif.gif",
            size: Number(media?.size) || 0,
            url: source,
            proxy_url: proxy,
            width: Number(media?.width) || 0,
            height: Number(media?.height) || 0,
            content_type: media?.content_type || media?.contentType || (video ? "video/mp4" : "image/gif"),
            spoiler: true,
            flags: 8,
        });
    }
    if (kept.length !== draft.embeds.length) draft.embeds = kept;
    if (additions.length) draft.attachments = draft.attachments.concat(additions);
}

// Link embeds are spoiled when the URL sits inside spoiler bars. Bars already around a link stay a single pair.
function spoilImageLinks(content: unknown) {
    if (typeof content !== "string" || !content) return content;
    return content.replace(/\|*https?:\/\/[^\s<]+/gi, raw => {
        let start = 0;
        while (start < raw.length && raw[start] === "|") start += 1;
        let end = raw.length;
        while (end > start && raw[end - 1] === "|") end -= 1;
        let urlEnd = end;
        while (urlEnd > start && /[),.;!?]/.test(raw[urlEnd - 1])) urlEnd -= 1;
        const url = raw.slice(start, urlEnd);
        const punct = raw.slice(urlEnd, end);
        if (!url || !(IMAGE_EXT.test(url.split("#")[0]) || isGifLink(url))) return raw;
        const lead = start;
        const trail = raw.length - end;
        if (lead >= 2 || trail >= 2) return `||${url}||${punct}`;
        return `${"|".repeat(lead)}||${url}||${punct}${"|".repeat(trail)}`;
    });
}

/**
 * Decides which messages get covered: the newest 50 loaded in a listed channel, and of those only the
 * ones that arrived after the chat was last opened. `seen` and `remember` read and save that point per
 * channel, so a message is covered during one visit and never again, also after an app restart.
 */
function createCoverGate(listed: (channelId: string) => boolean, loaded: (channelId: string) => Any, seen: (channelId: string) => unknown, remember: (channelId: string, id: string) => void) {
    // Message ids are numbers too long for Number; a longer id, or a greater one of equal length, is newer.
    const newer = (a: string, b: string) => a.length > b.length || (a.length === b.length && a > b);
    let visit = new Map<string, string>();
    let cache = { list: null as Any, ids: new Set<string>(), top: "" };
    return {
        opened() { visit = new Map(); },
        covers(message: Any) {
            const id = String(message?.id || "");
            const channelId = String(message?.channel_id || "");
            if (!id || !listed(channelId)) return false;
            if (!visit.has(channelId)) visit.set(channelId, String(seen(channelId) || ""));
            const list = loaded(channelId);
            if (list !== cache.list) {
                const ids: string[] = (list?.toArray?.() || []).slice(-NEWEST).map((item: Any) => String(item.id));
                cache = { list, ids: new Set(ids), top: ids[ids.length - 1] || "" };
            }
            if (!cache.ids.has(id) || !newer(id, visit.get(channelId) || "")) return false;
            if (newer(cache.top, String(seen(channelId) || ""))) remember(channelId, cache.top);
            return true;
        },
    };
}

function ChannelSpoilers(r: Runtime) {
    const { h, React, RN } = r;
    const { Page, Text, Button, Input } = ui(r);
    const channels = (): string[] => Array.isArray(r.store.channels) ? r.store.channels.map(String) : [];

    function Settings() {
        r.useRefresh();
        const [draft, setDraft] = React.useState("");
        const list = channels();
        const add = () => {
            const id = draft.trim();
            if (!SNOWFLAKE.test(id) || list.includes(id)) return;
            r.set("channels", list.concat(id));
            setDraft("");
        };
        return h(Page, { title: "Channel Spoilers" },
            h(Input, { label: "Channel ID", value: draft, onChange: setDraft, placeholder: "Channel ID", keyboardType: "number-pad" }),
            h(Button, { text: "Add", onPress: add }),
            h(RN.View, null,
                list.length
                    ? list.map(id => h(RN.View, { key: id, style: { minHeight: 48, flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 12 } },
                        h(Text, null, id), h(Button, { text: "Remove " + id, variant: "secondary", onPress: () => r.set("channels", list.filter(item => item !== id)) })))
                    : h(Text, { muted: true }, "No channels yet.")),
            h(Text, { muted: true }, "Images, GIFs, and videos in the newest 50 messages of these channels are covered on this device until you tap them. Each message is covered once: reopening the chat does not cover it again. Other people still see the media normally."));
    }

    return {
        Settings,
        start() {
            const messages = r.byStore("MessageStore");
            const gate = createCoverGate(id => channels().includes(id), id => messages?.getMessages?.(id),
                id => r.store.seen?.[id], (id, top) => r.set("seen", { ...r.store.seen, [id]: top }));
            r.subscribe("CHANNEL_SELECT", gate.opened);
            if (!r.patchMessageInput(input => {
                if (!gate.covers(input?.message)) return;
                return spoilerInput(input, draft => {
                    draft.content = spoilImageLinks(draft.content);
                    promoteGifEmbeds(draft);
                });
            })) throw new Error("Discord's message content builder is unavailable");
        },
    };
}
ChannelSpoilers.defaults = { channels: [], seen: {} };

export default register(ChannelSpoilers);
