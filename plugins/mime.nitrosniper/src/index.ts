// NitroSniper — Snow SDK port of neoarz/NitroSniper (MIT).
// Claim cycle: queue gift link -> redeem (native ladder + REST fallback) ->
// auto-press the Accept/Confirm button of the gift sheet and hCaptcha's mobile
// human-verification interstitial -> toasts at every stage.
import { register, ui, type Any, type Runtime } from "../../../shared/runtime";
import { createCaptchaSolver, captchaErrorInfo } from "./captcha";
export function giftCodes(text: unknown): string[] {
    return [...new Set(Array.from(String(text || "").matchAll(/(?:https?:\/\/)?(?:www\.)?(?:discord\.gift\/|discord(?:app)?\.com\/gifts\/)([A-Za-z0-9]{16,24})(?![A-Za-z0-9])/g), (m) => m[1]))];
}
export function webhookUrl(value: Any): string | null {
    if (!String(value || "").trim()) return null;
    const u = new URL(String(value).trim());
    if (u.protocol !== "https:" || !["discord.com", "canary.discord.com", "ptb.discord.com"].includes(u.hostname) || !/^\/api(?:\/v\d+)?\/webhooks\/\d+\/[\w-]+\/?$/.test(u.pathname) || u.username || u.password) throw new Error("Use a Discord HTTPS webhook URL");
    return u.href;
}

function NitroSniper(r: Runtime) {    const { h, React } = r, { Page, Text, Button, Input, Toggle } = ui(r);
    const solver = createCaptchaSolver(r, React);
    const seen = new Map<string, number>(), queue: Any[] = [];
    let running = false, stopped = false, started = Date.now(), waitTimer: Any, releaseWait: Any;

    // --- Native Accept/Confirm-button automation -------------------------------
    // Matches the gift sheet's Accept button AND hCaptcha's mobile TouchUI
    // interstitial: "Wait! Are you human?" / "Please confirm you're not a robot."
    // with a blue Confirm BaseButton. Armed for the whole claim window so a
    // verification sheet that mounts mid-redeem still gets pressed.
    // React Native 0.8x builds elements through the JSX runtime (jsx/jsxs), not
    // React.createElement, so both are hooked. Each arm window allows several
    // presses: the gift sheet's Accept and the captcha sheet's Confirm both count.
    const ACCEPT_BUTTON_RE = /^(accept|redeem(?: now)?|claim|get nitro|confirm|i'?m not a robot|verify)\b/i;
    // Always-on watch: the human-verification prompt can appear at any time (after a redeem
    // attempt, on app events), not only mid-claim, so the hook stays armed for the whole
    // plugin lifetime with a short cooldown instead of a one-shot per claim.
    const autoPress = { nextAllowed: 0, mountedSweep: 0 };
    function armAutoPress() { autoPress.nextAllowed = 0; autoPress.mountedSweep = 0; }
    const pressDelayMs = 50; // as fast as possible while the pressable settles
    const pressCooldownMs = 1500; // one press per 1.5s max
    const sweepIntervalMs = 700; // walk mounted fibers this often while a sheet may be up
    function doPress(label: string, press: Any) {
        autoPress.nextAllowed = Date.now() + pressCooldownMs;
        r.toast(`Pressing "${label.slice(0, 40)}"…`, "ShieldIcon");
        setTimeout(() => { if (r.active && !stopped) { try { press({}); } catch { /* sheet may have closed */ } } }, pressDelayMs);
    }
    function tryAutoPress(props: Any): boolean {
        if (!r.active || stopped) return false;
        if (Date.now() < autoPress.nextAllowed) return false;
        const label = String(props?.accessibilityLabel ?? props?.label ?? props?.text ?? "");
        if (typeof props?.onPress !== "function" || !ACCEPT_BUTTON_RE.test(label)) return false;
        doPress(label, props.onPress);
        return true;
    }
    // Backstop for a sheet that mounted before the hooks registered (or never re-renders):
    // walk the live fiber tree from React's DevTools hook and press the matching
    // button's own onPress directly. Runs every sweepIntervalMs in the background.
    function labelOf(props: Any): string {
        if (!props) return "";
        const direct = String(props.accessibilityLabel ?? props.label ?? props.text ?? "");
        if (direct) return direct;
        // Discord buttons often put the text only in children elements.
        try {
            const kids = props.children;
            if (typeof kids === "string") return kids;
            if (Array.isArray(kids)) {
                for (const k of kids) {
                    if (typeof k === "string" && k.trim()) return k;
                    const t = k?.props?.children;
                    if (typeof t === "string" && t.trim()) return t;
                }
            }
            const one = props.children?.props?.children;
            if (typeof one === "string") return one;
        } catch { /* keep "" */ }
        return "";
    }
    function sweepMounted(): boolean {
        if (!r.active || stopped) return false;
        const now = Date.now();
        if (now < autoPress.nextAllowed || now < autoPress.mountedSweep) return false;
        autoPress.mountedSweep = now + sweepIntervalMs;
        try {
            const g = globalThis as Any;
            const hook = g.__REACT_DEVTOOLS__?.hook ?? g.__REACT_DEVTOOLS_GLOBAL_HOOK__;
            if (!hook || typeof hook.getFiberRoots !== "function") return false;
            let pressed = false;
            const queue: Any[] = [];
            const seen = new Set<Any>();
            const visit = (fiber: Any, budget: { n: number }) => {
                while (fiber && budget.n > 0 && !pressed) {
                    if (seen.has(fiber)) return;
                    seen.add(fiber);
                    budget.n--;
                    try {
                        const props = fiber.memoizedProps;
                        const label = labelOf(props);
                        if (typeof props?.onPress === "function" && label && ACCEPT_BUTTON_RE.test(label)) {
                            doPress(label, props.onPress);
                            pressed = true;
                            return;
                        }
                    } catch { /* walk on */ }
                    if (fiber.child) queue.push(fiber.child);
                    if (fiber.sibling) queue.push(fiber.sibling);
                    fiber = null as Any;
                }
            };
            for (const entry of hook.renderers ?? []) {
                const rendererId = entry?.[0];
                const roots = hook.getFiberRoots(rendererId);
                if (!(roots instanceof Set)) continue;
                for (const root of roots) {
                    const fiber = root?.current ?? root;
                    if (fiber) queue.push(fiber);
                }
            }
            const budget = { n: 60000 };
            while (queue.length && !pressed && budget.n > 0) {
                const f = queue.shift();
                if (f && f.child) queue.push(f.child);
                if (f && f.sibling) queue.push(f.sibling);
                if (f && f.memoizedProps) visit(f, budget);
            }
            return pressed;
        } catch { /* DevTools hook unavailable */ }
        return false;
    }
    const sweepTimer = setInterval(() => { void sweepMounted(); }, sweepIntervalMs + 300);
    r.patch("after", React, "createElement", (args: Any[], result: Any) => {
        if (tryAutoPress(args && args[1])) return result;
        if (!result?.props) return result;
        tryAutoPress(result.props); // class components put props on the element
        return result;
    });
    const jsxModule = r.find("jsx", "jsxs");
    for (const candidate of jsxModule ? [jsxModule] : []) {
        for (const key of ["jsx", "jsxs"] as const) {
            if (typeof candidate?.[key] !== "function") continue;
            r.patch("after", candidate, key, (args: Any[], result: Any) => {
                if (!result?.props || result.props === (args && args[1])) return result;
                tryAutoPress(result.props);
                return result;
            });
        }
    }

    function redeemViaActions(actions: Any, code: string): Promise<null | void> {
        // Calls the same module the native Accept button uses. Returns null when
        // the module is unavailable (REST ladder takes over); rejects on real
        // outcomes so callers can distinguish claimed from failed.
        if (typeof actions?.redeemGiftCode !== "function") return Promise.resolve(null);
        return new Promise((resolve, reject) => {
            let settled = false;
            const timer = setTimeout(() => { if (!settled) { settled = true; reject(new Error("native redeem timed out")); } }, 20000);
            const done = (ok: boolean) => (value: Any) => {
                if (settled) return;
                settled = true; clearTimeout(timer);
                if (ok) resolve();
                else {
                    const e = value instanceof Error ? value : new Error(value?.message || "native redeem failed");
                    if (value && typeof value === "object") (e as Any).body = (value as Any).body || value;
                    reject(e);
                }
            };
            try { actions.redeemGiftCode({ code, onRedeemed: done(true), onError: done(false) }); }
            catch (e) {
                const err = e instanceof Error ? e : new Error(String(e));
                if (/not a function|undefined|null/.test(err.message)) resolve(null);
                else { settled = true; clearTimeout(timer); reject(err); }
            }
        });
    }

    const stats = { queued: 0, claimed: 0, failed: 0, lastResult: "Waiting for new gift links" };
    function wait(ms: number) { return new Promise<void>(resolve => { releaseWait = resolve; waitTimer = setTimeout(resolve, ms); }); }
    async function webhook(payload: Any) {
        const url = webhookUrl(r.store.webhookUrl);
        if (url) await r.request(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ username: "NitroSniper", allowed_mentions: { parse: [] }, ...payload }) });
    }
    async function drain() {
        if (running) return;
        running = true;
        try {
            while (queue.length && r.active && !stopped) {
                const item = queue.shift();
                let success = false, result = "", giftType;
                r.toast("Claiming gift…", "GiftIcon");
                armAutoPress();
                try {
                    // Native path first: exactly what pressing the bottom Accept button
                    // does (GiftActions.redeemGiftCode, captcha and all).
                    let nativeCap = null;
                    const nativeActions = r.find("redeemGiftCode");
                    if (typeof nativeActions?.redeemGiftCode === "function") {
                        try {
                            const native = await redeemViaActions(nativeActions, item.code);
                            if (native !== null) { success = true; result = "Gift claimed (native)"; }
                        } catch (nativeError: Any) {
                            // Captcha and rate-limit responses fall through to the REST
                            // ladder; hard failures (invalid/already-redeemed) abort here.
                            nativeCap = captchaErrorInfo(nativeError);
                            if (!nativeCap && nativeError?.status !== 429 && !/timed out/.test(nativeError?.message || "")) throw nativeError;
                        }
                    }
                    if (!success) {
                    let captchaKey, captchaRqtoken;
                    armAutoPress(); // the verification sheet can mount mid-REST-redeem too
                    for (let attempt = 0; ; attempt++) {
                        try {
                            const payload: Any = { channel_id: item.channelId || null };
                            if (captchaKey) {
                                payload.captcha_key = captchaKey;
                                if (captchaRqtoken) payload.captcha_rqtoken = captchaRqtoken;
                            }
                            await r.discord(`/entitlements/gift-codes/${item.code}/redeem`, { method: "POST", body: JSON.stringify(payload) }); break;
                        }
                        catch (e: Any) {
                            const cap = !captchaKey && (captchaErrorInfo(e) || nativeCap);
                            if (cap && cap.sitekey && cap.service === "hcaptcha") {
                                r.toast("Solving captcha…", "ShieldIcon");
                                stats.lastResult = "Solving hCaptcha…"; r.changed();
                                const token = await solver.solve(cap.sitekey, cap.rqtoken);
                                captchaKey = token;
                                captchaRqtoken = cap.rqtoken;
                                armAutoPress(); // verification sheet may follow the captcha
                                attempt--; // don't consume attempts on the captcha round-trip
                                continue;
                            }
                            if (e.status !== 429 || attempt >= 2 || e.retryAfter <= 0 || e.retryAfter > 120) throw e;
                            stats.lastResult = `Rate limited; retrying in ${Math.ceil(e.retryAfter)}s`; r.changed();
                            await wait(e.retryAfter * 1000 + 100);
                            armAutoPress();
                            if (stopped || !r.active) return;
                        }
                    }
                    success = true; result = "Gift claimed";
                    }
                } catch (e: Any) { result = `Claim failed: ${e.message}`; }
                if (stopped || !r.active) return;
                stats[success ? "claimed" : "failed"]++; stats.lastResult = result; r.changed();
                r.toast(result, success ? "NitroWheelIcon" : "CircleXIcon");
                if (r.store.webhookUrl) {
                    try {
                        try { const resolved = (await r.discord(`/entitlements/gift-codes/${item.code}?with_application=false&with_subscription_plan=true`)).json(); giftType = resolved?.subscription_plan?.name || resolved?.store_listing?.sku?.name; } catch { /* Optional enrichment; claim result remains visible. */ }
                        if (!r.active || stopped) return;
                        const fields = [];
                        if (giftType) fields.push({ name: "Gift type", value: String(giftType).slice(0, 1024) });
                        if (item.authorId) fields.push({ name: "Sent by", value: `[${String(item.authorName || item.authorId).replace(/[\[\]\\]/g, "")}](https://discord.com/users/${item.authorId})` });
                        if (item.channelId && item.messageId) fields.push({ name: "Message", value: `https://discord.com/channels/${item.guildId || "@me"}/${item.channelId}/${item.messageId}` });
                        await webhook({ embeds: [{ title: result.slice(0, 256), color: success ? 0x43b581 : 0xf04747, fields, timestamp: new Date().toISOString() }] });
                    } catch (e) { if (r.active) r.error("Webhook delivery failed", e); }
                }
            }
        } finally { running = false; }
    }
    function receive(event: Any) {
        const m = event?.message;
        if (!m || stopped || event.optimistic || event.isPushNotification) return;
        const timestamp = m.timestamp ? new Date(m.timestamp).getTime() : Number(BigInt(m.id || "0") >> 22n) + 1420070400000;
        if (!Number.isFinite(timestamp) || timestamp < started) return;
        const self = r.byStore("UserStore")?.getCurrentUser?.()?.id;
        if (r.store.ignoreOwnGiftLinks && m.author?.id === self) return;
        for (const code of giftCodes(m.content)) {
            if (seen.has(code)) continue;
            seen.set(code, Date.now());
            if (seen.size > 4096) seen.delete(seen.keys().next().value ?? "");
            if (queue.length >= 100) { stats.lastResult = "Queue full; skipped gift"; r.changed(); continue; }
            queue.push({ code, channelId: m.channel_id || m.channelId, guildId: m.guild_id || m.guildId, messageId: m.id, authorId: m.author?.id, authorName: m.author?.globalName || m.author?.global_name || m.author?.username }); stats.queued++;
        }
        r.changed(); void drain().catch(e => r.active && r.error("Gift queue", e));
    }
    function Settings() {
        r.useRefresh(); const [url, setUrl] = React.useState(r.store.webhookUrl || "");
        return h(Page, { title: "NitroSniper" }, h(Toggle, { setting: "ignoreOwnGiftLinks", label: "Ignore my gift links" }),
            h(Text, null, `Queued ${stats.queued} · Claimed ${stats.claimed} · Failed ${stats.failed}`), h(Text, null, stats.lastResult),
            h(Input, { label: "Optional result webhook", value: url, onChange: setUrl, secureTextEntry: true, autoCapitalize: "none" }),
            h(Button, { text: "Save webhook", onPress: async () => { try { webhookUrl(url); r.set("webhookUrl", url.trim()); await r.api.storage.flush(); r.toast("Saved"); } catch (e) { r.error("Webhook", e); } } }),
            h(Button, { text: "Send test webhook", variant: "secondary", onPress: () => webhook({ content: "NitroSniper Snow webhook test" }).then(() => r.toast(r.store.webhookUrl ? "Test sent" : "Set a webhook first")).catch(e => r.error("Webhook test", e)) }),
            h(Text, { muted: true }, "Claim cycle: claim link, auto-press the Accept and human-verification Confirm buttons, solve hCaptcha, and toast each result. Only new live messages are processed."));
    }
    return { start() {
        started = Date.now();
        // Pre-warm the toast icon pipeline: resolving an icon name lazily initializes
        // every Discord module once (a long stall). Pay it here at start, not mid-claim.
        setTimeout(() => { try { r.toast("NitroSniper ready", "ShieldIcon"); } catch { /* warm-up best effort */ } }, 1500);
        r.subscribe("MESSAGE_CREATE", e => { try { receive(e); } catch (err) { r.error("Message handler", err); } });
    }, stop() { stopped = true; clearInterval(sweepTimer); solver.dispose(); queue.length = 0; clearTimeout(waitTimer); releaseWait?.(); }, Settings, receive, stats };
}
NitroSniper.defaults = { ignoreOwnGiftLinks: false, webhookUrl: "" };

export default register(NitroSniper);
