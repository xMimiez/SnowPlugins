// shortcut: ported from the untyped Bunny source; add types when this plugin is next reworked.
// @ts-nocheck
import { ui } from '../../../shared/runtime';
import { addUrlHandler, openExternal } from '../../../shared/url-hub';

export function steamTargets(value) {
    try {
        const u = new URL(value);
        const host = u.hostname.replace(/^www\./, '');
        if (!['http:', 'https:'].includes(u.protocol) || u.username || u.password) return [];
        if (!['store.steampowered.com', 'steamcommunity.com', 'help.steampowered.com'].includes(host)) return [];
        const path = u.pathname;
        const out = [];
        const app = path.match(/\/app\/(\d+)/);
        if (app) {
            out.push('steam://store/' + app[1]);
            out.push('steam://url/StoreAppPage/' + app[1]);
        }
        const bundle = path.match(/\/bundle\/(\d+)/);
        if (bundle) out.push('steam://url/StoreBundlePage/' + bundle[1]);
        const sub = path.match(/\/sub\/(\d+)/);
        if (sub) out.push('steam://url/StoreSubPage/' + sub[1]);
        const profile = path.match(/\/profiles\/(\d+)/);
        if (profile) out.push('steam://url/SteamIDPage/' + profile[1]);
        const file = path.includes('sharedfiles') && u.searchParams.get('id');
        if (file) out.push('steam://url/CommunityFilePage/' + file);
        out.push('steam://openurl/' + u.href);
        out.push('steam://openurl_external/' + u.href);
        return out;
    } catch { return []; }
}

export function appLink(value) {
    try {
        const u = new URL(value);
        if (!['http:', 'https:'].includes(u.protocol) || u.username || u.password) return null;
        const host = u.hostname.replace(/^www\./, '');
        const path = u.pathname.replace(/\/$/, '');
        const steam = steamTargets(value);
        if (steam.length) return steam[0];
        if (host === 'tidal.com' && /^\/browse\/(track|album|artist|playlist)\/[\w-]+$/.test(path)) return 'tidal://' + path.slice(8);
        if (host === 'music.apple.com') return 'musics://' + u.host + u.pathname + u.search;
        if (host === 't.me' || host === 'telegram.me') {
            const parts = path.slice(1).split('/');
            const domain = parts[0];
            if (domain && domain.startsWith('+')) return 'tg://join?invite=' + encodeURIComponent(domain.slice(1));
            if (domain && /^[A-Za-z][\w]{3,}$/.test(domain) && !parts[1]) return 'tg://resolve?domain=' + encodeURIComponent(domain);
            if (domain && parts[1]) return 'tg://resolve?domain=' + encodeURIComponent(domain) + '&post=' + encodeURIComponent(parts[1]);
        }
        if (host === 'instagram.com' || host === 'instagr.am') {
            const ig = path.slice(1).split('/');
            if (['p', 'reel', 'reels', 'tv'].includes(ig[0]) && ig[1]) return 'instagram://media?shortcode=' + encodeURIComponent(ig[1]);
            if (ig[0] && !['stories', 'explore', 'accounts'].includes(ig[0])) return 'instagram://user?username=' + encodeURIComponent(ig[0]);
        }
        if (host === 'tiktok.com' || host.endsWith('.tiktok.com')) {
            const user = path.match(/^\/@([^/]+)/);
            if (user) return 'tiktok://user?username=' + encodeURIComponent(user[1]);
            if (host === 'vm.tiktok.com' || path.startsWith('/t/')) return 'tiktok://' + path;
            return 'snssdk1233://' + path;
        }
        const parts = path.split('/').filter(Boolean);
        const q = (k) => u.searchParams.get(k);
        if (host === 'youtu.be' && parts[0]) return 'youtube://www.youtube.com/watch?v=' + encodeURIComponent(parts[0]);
        if (host === 'youtube.com' || host === 'm.youtube.com') return 'youtube://www.youtube.com' + u.pathname + u.search;
        if (host === 'music.youtube.com') return 'youtubemusic://music.youtube.com' + u.pathname + u.search;
        if (host === 'twitter.com' || host === 'x.com' || host === 'mobile.twitter.com') {
            if (parts[1] === 'status' && /^\d+$/.test(parts[2] || '')) return 'twitter://status?id=' + parts[2];
            if (parts.length === 1 && /^\w{1,15}$/.test(parts[0])) return 'twitter://user?screen_name=' + parts[0];
        }
        if ((host === 'reddit.com' || host === 'old.reddit.com' || host === 'new.reddit.com') && parts.length) return 'reddit://' + path;
        if (host === 'twitch.tv' && parts.length === 1 && /^\w{3,25}$/.test(parts[0])) return 'twitch://stream/' + parts[0];
        if (host === 'snapchat.com' && parts[0] === 'add' && parts[1]) return 'snapchat://add/' + encodeURIComponent(parts[1]);
        if (host === 'wa.me' && /^\d+$/.test(parts[0] || '')) return 'whatsapp://send?phone=' + parts[0] + (q('text') ? '&text=' + encodeURIComponent(q('text')) : '');
        if ((host === 'threads.net' || host === 'threads.com') && /^@[\w.]+$/.test(parts[0] || '')) return 'barcelona://user?username=' + encodeURIComponent(parts[0].slice(1));
        if (host === 'roblox.com' && parts[0] === 'games' && /^\d+$/.test(parts[1] || '')) return 'roblox://experiences/start?placeId=' + parts[1];
        if (host === 'pinterest.com' && parts[0] === 'pin' && /^\d+$/.test(parts[1] || '')) return 'pinterest://pin/' + parts[1];
        if (host === 'deezer.com' && /^(track|album|artist|playlist)$/.test(parts[parts.length - 2] || '')) return 'deezer://www.deezer.com/' + parts.slice(-2).join('/');
        if (host === 'netflix.com' && parts.includes('title')) return 'nflx://www.netflix.com' + u.pathname;
        if (host === 'soundcloud.com' && parts.length >= 1) return 'soundcloud://' + path.slice(1);
    } catch {}
    return null;
}

async function openSteam(r, href) {
    const app = String(href).match(/\/app\/(\d+)/);
    const id = app && app[1];
    const targets = [];
    if (id) {
        targets.push('steam://store/' + id);
        targets.push('steam://run/' + id);
        targets.push('steam://url/StoreAppPage/' + id);
        targets.push('steam://advertise/' + id);
        targets.push('steam://url/StoreAppPage/' + id + '/' + encodeURIComponent('Counter-Strike 2'));
    }
    for (const extra of steamTargets(href)) if (extra.indexOf('steam://') === 0) targets.push(extra);
    let opened = false;
    for (const url of targets) {
        try { await r.RN.Linking.openURL(url); opened = true; break; } catch {}
    }
    if (!opened) r.toast('Steam app did not open. Install Steam or allow steam:// links.');
}

export default function OpenInApp(r) {
    const { h } = r, { Page, Text, Toggle } = ui(r);
    return {
        start() {
            addUrlHandler(r, 10, (url, fallback) => {
                if (!r.store.enabled) return false;
                const steam = steamTargets(url);
                if (steam.length) {
                    openSteam(r, url);
                    return true;
                }
                const app = appLink(url);
                if (!app) return false;
                openExternal(r, app).catch(() => r.active && fallback());
                return true;
            });
        },
        Settings() {
            r.useRefresh();
            return h(Page, { title: 'OpenInApp' },
                h(Toggle, { setting: 'enabled', label: 'Open supported links in their app' }),
                h(Text, null, 'Steam store pages use steam://store/<id> and StoreAppPage, then steam://openurl. Also opens Tidal, Apple Music, Telegram, Instagram, TikTok, YouTube, YouTube Music, X, Reddit, Twitch, Snapchat, WhatsApp, Threads, Roblox, Pinterest, Deezer, Netflix and SoundCloud links in their apps. SpotifyPreview still takes priority for Spotify URLs.'));
        },
    };
}
OpenInApp.defaults = { enabled: true };
