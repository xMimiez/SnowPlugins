import { register, spoilerInput, ui, type Any, type Runtime } from "../../../shared/runtime";

function BlurNsfw(r: Runtime) {
    const { h } = r, { Page, Text, Toggle } = ui(r);
    return {
        start() {
            const channels = r.byStore("ChannelStore");
            const nsfw = (channel: Any) => !!(channel?.isNSFW?.() || channel?.nsfw || channel?.nsfw_);
            if (!r.patchMessageInput(input => {
                const channel = channels?.getChannel?.(input?.message?.channel_id);
                // A thread follows its parent channel, which may be the one marked NSFW.
                if (!(r.store.blurAllChannels || nsfw(channel) || nsfw(channels?.getChannel?.(channel?.parent_id)))) return;
                const covered = spoilerInput(input) || (input.message.embeds?.length && input.options ? input : null);
                // Link previews have no spoiler cover, so their images and videos are left out.
                return covered && { ...covered, options: { ...covered.options, inlineEmbedMedia: false } };
            })) throw new Error("Discord's message content builder is unavailable");
        },
        Settings() {
            r.useRefresh();
            return h(Page, { title: "BlurNSFW" },
                h(Toggle, { setting: "blurAllChannels", label: "Hide media in every channel" }),
                h(Text, { muted: true }, "Shows images and videos in age-restricted channels as spoilers until you tap them, and leaves media out of link previews there. Reopen the chat after changing this."));
        },
    };
}
BlurNsfw.defaults = { blurAllChannels: false };

export default register(BlurNsfw);
