import { logger } from "@snow/plugin";
import { register, ui, type Any, type Runtime } from "../../../shared/runtime";

interface Badge { mod: string; badge: string; tooltip: string; reason: string; key: string }
interface Toggles { showCustom?: boolean; showDonor?: boolean }

const EQUI_USERS = 'https://badges.equicord.org/users';
const EQUI_USER = 'https://badges.equicord.org';
const VAULT_USER = 'https://plugins.obamabot.me/BadgeVault/User';
const REFRESH = 1000 * 60 * 30;

const serviceMap: Record<string, string> = {
    badgevault: 'BadgeVault', nekocord: 'Nekocord', reviewdb: 'ReviewDB', aero: 'Aero',
    aliucord: 'Aliucord', raincord: 'Raincord', velocity: 'Velocity', enmity: 'Enmity',
    paicord: 'Paicord', bunny: 'Bunny', goosemod: 'GooseMod', replugged: 'Replugged',
    betterdiscord: 'BetterDiscord', vendroidenhanced: 'VendroidEnhanced', revenge: 'Revenge',
    record: 'ReCord', vencord: 'Vencord', equicord: 'Equicord', discord: 'Discord',
};

let byUser: Record<string, Badge[]> = {};
const badgeProps: Record<string, Any> = {};
const BADGE_PREFIX = 'gb-';
const isAddedId = (value: unknown) => typeof value === 'string' && value.startsWith(BADGE_PREFIX);
// Keyed by the badge itself, not its list position, so a refreshed or filtered list never points an old id at another badge.
export const badgeId = (userId: string, badge: Pick<Badge, 'mod' | 'badge'>) => `${BADGE_PREFIX}${userId}-${encodeURIComponent(badge.mod)}-${encodeURIComponent(badge.badge)}`;

function flattenEquiUser(entries: Any, showPrefix: boolean): Badge[] {
    if (!Array.isArray(entries)) return [];
    return entries.map((b: Any, idx: number) => {
        const url = b.badge || b.url;
        const mod = b.mod || 'custom';
        if (!url || !String(url).startsWith('https://')) return null;
        const modName = serviceMap[String(mod).toLowerCase()] || mod;
        const tip = b.tooltip || b.name || b.label || modName;
        const label = showPrefix ? `${modName} — ${tip}` : tip;
        return { mod, badge: url, tooltip: label, reason: tip, key: `${mod}-${idx}-${url}` };
    }).filter((badge: Badge | null): badge is Badge => !!badge);
}

function mergeUser(id: string, list: Badge[]) {
    const existing = byUser[id] || [];
    const urls = new Set(existing.map(b => b.badge));
    for (const badge of list) if (!urls.has(badge.badge)) { existing.push(badge); urls.add(badge.badge); }
    if (existing.length) byUser[id] = existing;
}

async function loadBadges(r: Runtime, showPrefix: boolean) {
    try {
        const data = (await r.request(EQUI_USERS, {}, 20000, 2 * 1024 * 1024)).json();
        const users = data?.users || data || {};
        const next: Record<string, Badge[]> = {};
        for (const [id, entries] of Object.entries(users)) {
            const list = flattenEquiUser(entries, showPrefix);
            if (list.length) next[id] = list;
        }
        byUser = next;
    } catch (error) {
        logger.warn('EquiBadges bulk load failed', error);
    }
}

async function loadUser(r: Runtime, id: string, showPrefix: boolean) {
    const results = await Promise.allSettled([
        r.request(`${EQUI_USER}/${id}?separated=true`, {}, 10000).then(d => d.json()),
        r.request(`${VAULT_USER}/${id}.json`, {}, 10000).then(d => d.json()),
    ]);
    if (results[0].status === 'fulfilled') {
        const body = results[0].value;
        const groups = body?.badges && typeof body.badges === 'object' && !Array.isArray(body.badges) ? body.badges : null;
        if (groups) {
            const list: Badge[] = [];
            for (const [mod, entries] of Object.entries<Any>(groups)) {
                for (const item of flattenEquiUser((entries || []).map((e: Any) => ({ ...e, mod })), showPrefix)) list.push(item);
            }
            mergeUser(id, list);
        } else if (Array.isArray(body)) mergeUser(id, flattenEquiUser(body, showPrefix));
    }
    if (results[1].status === 'fulfilled') {
        const vault = results[1].value;
        if (!vault?.blocked) {
            mergeUser(id, asVault(vault?.badges, showPrefix));
        }
    }
}

function asVault(badges: Any, showPrefix: boolean): Badge[] {
    if (!Array.isArray(badges)) return [];
    return badges.filter((b: Any) => b && !b.pending && String(b.badge || '').startsWith('https://')).map((b: Any, idx: number) => ({
        mod: 'badgevault',
        badge: b.badge,
        tooltip: showPrefix ? `BadgeVault — ${b.name}` : b.name,
        reason: b.name,
        key: `vault-${idx}-${b.badge}`,
    }));
}

// Discord's badge rarities are 1, 2, 3 and 5. Only this plugin draws this one.
export const ULTIMATE_RARITY = 99;
const ULTIMATE = { label: 'Ultimate', border: '#f23f43', fill: 'rgba(242, 63, 67, 0.24)', text: '#ff6b6e' };
// Discord's badge ids are positive numbers, so these never collide with one.
const DIRECTORY_ID = -9000;
export const isDirectoryId = (id: unknown) => typeof id === 'number' && id <= DIRECTORY_ID;

// Badge directory entries, shaped like Discord's own untiered badges.
// Donor badges are the ones named so. Custom ones are BadgeVault's and any image stored per user.
export function isShown(badge: Pick<Badge, 'mod' | 'badge' | 'reason'>, userId: string, store: Toggles) {
    const mod = String(badge.mod).toLowerCase();
    const vault = mod === 'badgevault' || mod === 'custom';
    if (!vault && /donor|donator/i.test(badge.reason || '')) return store.showDonor !== false;
    return !!store.showCustom || !(vault || String(badge.badge).includes(userId));
}

export function directoryBadges(extras: Badge[] | undefined, userId: string, store: Toggles) {
    const list: Any[] = [];
    (extras || []).forEach((badge, idx) => {
        if (!isShown(badge, userId, store)) return;
        const reason = badge.reason || badge.tooltip;
        list.push({
            badge_id: DIRECTORY_ID - idx,
            name: reason,
            description: `unlocked by ${reason}`,
            rarity: ULTIMATE_RARITY,
            simple_icon_raster_url: badge.badge,
            complex_icon_animated_url: badge.badge,
            is_earnable: false,
            owned: true,
            hidden: false,
        });
    });
    return list;
}

function GlobalBadges(r: Runtime) {
    const { h, React, RN } = r, { Page, Text, Toggle } = ui(r);
    function UltimatePill() {
        return h(RN.View, { style: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 6, minHeight: 20, borderRadius: 999, borderWidth: 1, backgroundColor: ULTIMATE.fill, borderColor: ULTIMATE.border } },
            h(RN.Text, { style: { color: ULTIMATE.text, fontSize: 12, lineHeight: 16, fontWeight: '600', textTransform: 'uppercase' } }, ULTIMATE.label));
    }
    function applyBadgeProps(element: Any) {
        const id = element?.props?.id;
        if (typeof id !== 'string' || !id.startsWith(BADGE_PREFIX)) return;
        const cached = badgeProps[id];
        if (!cached) return;
        return React.cloneElement(element, { source: cached.source, label: cached.label, id: cached.id });
    }
    // Discord saves badge order/visibility and fetches badge details by id; synthetic ids must never reach either.
    function guardPendingBadges() {
        const withoutAdded = (value: Any) => Array.isArray(value)
            ? value.filter((item: Any) => !isAddedId(item) && !isAddedId(item?.id))
            : value && typeof value === 'object' && Object.getPrototypeOf(value) === Object.prototype
                ? Object.fromEntries(Object.entries(value).filter(([key]) => !isAddedId(key)))
                : value;
        const pending = r.find('setPendingBadgeDisplayOrder');
        for (const key of ['setPendingBadgeDisplayOrder', 'setPendingBadgeVisibility', 'setPendingBadgeHiddenBadges']) {
            if (typeof pending?.[key] === 'function') r.patch('instead', pending, key, (args: Any[], original: Any) => args.some(isAddedId) ? undefined : original(...args.map(withoutAdded)));
        }
        const fetcher = r.find('fetchBadge', 'fetchBadgeSummary');
        for (const key of ['fetchBadge', 'fetchBadgeSummary']) {
            if (typeof fetcher?.[key] === 'function') r.patch('instead', fetcher, key, (args: Any[], original: Any) => args.some(isAddedId) ? Promise.resolve(undefined) : original(...args));
        }
    }
    return {
        async start() {
            await loadBadges(r, r.store.showPrefix);
            const refreshTimer = setInterval(() => { void loadBadges(r, r.store.showPrefix); }, REFRESH);
            r.own(() => clearInterval(refreshTimer));
            guardPendingBadges();
            r.hook(['ProfileBadge', 'RenderBadge'], applyBadgeProps);
            r.hook(['BadgeRarityPill'], (element: Any) => element?.props?.rarity === ULTIMATE_RARITY ? h(UltimatePill) : undefined);
            const directory = r.byStore('BadgeDirectoryStore');
            if (directory) {
                r.patch('after', directory, 'getBadges', (args: Any[], result: Any) => {
                    const userId = args?.[0];
                    if (!userId || !Array.isArray(result)) return;
                    const extra = directoryBadges(byUser[userId], userId, r.store);
                    return extra.length ? result.concat(extra) : undefined;
                });
                r.patch('after', directory, 'getBadgeById', (args: Any[], result: Any) => {
                    if (result || !isDirectoryId(args?.[0])) return;
                    const userId = args[1] || r.byStore('UserStore')?.getCurrentUser?.()?.id;
                    return directoryBadges(byUser[userId], userId, r.store).find(badge => badge.badge_id === args[0]);
                });
            }
            const badgeModule = r.byName('useBadges', true);
            if (!badgeModule || typeof badgeModule.default !== 'function') {
                logger.warn('useBadges was not found');
                return;
            }
            r.patch('after', badgeModule, 'default', (args: Any[], result: Any) => {
                const userId = args?.[0]?.userId || args?.[0]?.id || args?.[0]?.user?.id;
                if (!userId || !Array.isArray(result)) return result;
                if (!byUser[userId]) loadUser(r, userId, r.store.showPrefix).catch(() => {});
                const extras = byUser[userId];
                if (!extras?.length) return result;
                const seen = new Set(result.map((b: Any) => b?.id).filter(Boolean));
                const next = result.slice();
                extras.forEach((badge) => {
                    if (!isShown(badge, userId, r.store)) return;
                    const id = badgeId(userId, badge);
                    if (seen.has(id)) return;
                    badgeProps[id] = { id, source: { uri: badge.badge }, label: badge.tooltip, userId };
                    const item = { id, description: badge.tooltip, icon: ' _' };
                    if (r.store.placeLeft) next.unshift(item);
                    else next.push(item);
                    seen.add(id);
                });
                return next;
            });
        },
        Settings() {
            r.useRefresh();
            return h(Page, { title: 'GlobalBadges' },
                h(Toggle, { setting: 'showPrefix', label: 'Prefix', subLabel: 'Show the client mod name in the badge label' }),
                h(Toggle, { setting: 'placeLeft', label: 'Place on the left', subLabel: 'Insert badges at the start of the Discord badge bar' }),
                h(Toggle, { setting: 'showCustom', label: 'Custom / BadgeVault', subLabel: 'Include ObaWorkshop BadgeVault and personal custom badges' }),
                h(Toggle, { setting: 'showDonor', label: 'Donor badges', subLabel: 'Include donor badges such as Equicord Donor' }),
                h(Text, { muted: true }, 'Data from badges.equicord.org and plugins.obamabot.me/BadgeVault.'));
        },
    };
}
GlobalBadges.defaults = { showPrefix: true, showCustom: true, showDonor: true, placeLeft: false };

export default register(GlobalBadges);
