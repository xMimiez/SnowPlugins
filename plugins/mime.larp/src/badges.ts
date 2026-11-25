import { findByFilePath, findByProps, findByStoreName } from "@snow/discord";

export type Badge = { id: string; name: string; url: string };

export const tierFamilies: Readonly<Record<string, string | undefined>> = {
    "1": "Nitro",
    "5": "HypeSquad House",
    "12": "Server Boost",
    "17": "Gifting",
    "18": "Account Age",
    "19": "Streaming",
    "20": "Game Time",
    "21": "Game Variety",
};

export function badgeKey(id: string): string {
    if (id === "6" || id === "7") return "5";
    return id.split(":")[0];
}

const web = (file: string) => `https://discord.com/assets/${file}`;
const icon = (file: string) => `https://cdn.discordapp.com/badge-icons/${file}`;
const content = (file: string) => `https://cdn.discordapp.com/assets/content/${file}`;
const lastMeadow = "https://raw.githubusercontent.com/mezotv/discord-badges/7175b749242ae7e593f70b3b0130b83e22a947e1/assets/last-meadow.png";

// Discord 354.0 badge IDs and public artwork, including legacy and tiered artwork absent from some accounts' directories.
// Artwork references: https://github.com/mezotv/discord-badges
const builtInBadges = [
    ["22", "Discord Staff", web("48d5bdcffe9e7848067c2e187f1ef951.svg")],
    ["2", "Partnered Server Owner", web("34306011e46e87f8ef25f3415d3b99ca.svg")],
    ["3", "Moderator Programs Alumni", web("c981e58b5ea4b7fedd3a643cf0c60564.svg")],
    ["4", "HypeSquad Events", web("e666a84a7a5ea2abbbfa73adf22e627b.svg")],
    ["5", "HypeSquad Bravery", web("efcc751513ec434ea4275ecda4f61136.svg")],
    ["6", "HypeSquad Brilliance", web("ec8e92568a7c8f19a052ef42f862ff18.svg")],
    ["7", "HypeSquad Balance", web("9f00b18e292e10fc0ae84ff5332e8b0b.svg")],
    ["8", "Discord Bug Hunter", web("8353d89b529e13365c415aef08d1d1f4.svg")],
    ["9", "Discord Bug Hunter (Gold)", web("f599063762165e0d23e8b11b684765a8.svg")],
    ["10", "Early Verified Bot Developer", web("4441e07fe0f46b3cb41b79366236fca6.svg")],
    ["11", "Early Supporter", web("b802e9af134ff492276d94220e36ec5c.svg")],
    ["1", "Discord Nitro", content("f61ddf640d11d9bdfaf9de265eb862edf28986b659e545f293b54adf229433af.svg")],
    ["13", "Originally Known As", icon("6de6d34650760ba5551a79732e98ed60.png")],
    ["14", "Completed a Quest", icon("7d9ae358c8c5e118768335dbe68b4fb8.png")],
    ["16", "Orbs Apprentice", content("615334270467aa3d5adc86cc67efee89f8380a87b945a96e89ec2eb37c27993d.png")],
    ["active_developer", "Active Developer", web("26c7a60fb1654315e0be26107bd47470.svg")],
    ["lootbox", "A Clown, for a Limited Time", web("971cfe4aa5c0582000ea.svg")],
    ["15", "Last Meadow Online", lastMeadow],
    ["17:1", "Gifting · Patron", icon("ac305d1b9481f312ce4419e7f8296558.png")],
    ["17:2", "Gifting · Champion", icon("8b7792c4f65953d3ff564f23429cb79e.png")],
    ["17:3", "Gifting · Luminary", icon("3119f5504b2cd09576a323908c7c3517.png")],
    ["17:4", "Gifting · Icon", icon("64f2413c9b9803661322aaad25826b62.png")],
    ["17:5", "Gifting · Hero", icon("77d65b1f210014a11eb1582ee06ab684.png")],
    ["17:6", "Gifting · Legend", icon("7fe346cfc5da1340087d8759a9e7a395.png")],
    ["18:1", "Account Age · Seed", content("dda73966211a0c16533f8fcd9f1f27c27a628ef562927270e79df9b9c5e6cb12.svg")],
    ["18:2", "Account Age · Sprout", content("74e1884f930b0d69986f92aeea77d3ff3d3d00c540f386b63e6ebb382d5e927d.svg")],
    ["18:3", "Account Age · Bud", content("217dab12dcb72d4c95f2863e9dddd5c42003345a001684ea55a736172f32eea1.svg")],
    ["18:4", "Account Age · Sapling", content("26b89419a4f562ab31a1a72eac04833aa1026af937f1d53c088ec258df3db84b.svg")],
    ["18:5", "Account Age · Blossom", content("1db184b6d10a61a37dc30efdc74d587560fac5291c8bb329977e93bb5a312602.svg")],
    ["18:6", "Account Age · Redwood", content("6b0f2ed5be272942eeabea3a0289027d164c7b1ce6a76166d1c928a57db762c5.svg")],
    ["18:7", "Account Age · Sequoia", content("c095e3e73591843a22dc979d1fcfe3d6cf6841d1f51387d208d19f8bed01deb7.svg")],
    ["18:8", "Account Age · Bristlecone", content("867feeff5acd481c80bae557c586718fb5390bbaaa1cbde55fae296a7884e799.svg")],
    ["18:9", "Account Age · Stromatolite", content("a6f4c487be2aa012f41f1fba40e664f914ede9251f4b967d890ab5c065a29fb7.svg")],
    ["18:10", "Account Age · Primordial", content("1d8caace0299b12bcc469c35ce927e838abd9c645a22fe7c556f4394e57fa79b.svg")],
    ["19:1", "Streaming · Newcomer", content("c56b451e3bf04181182c2529e9bd3659e569ea80f582858090007f0752401b38.svg")],
    ["19:2", "Streaming · Fledgling", content("2e25ba794f6f371ea0f52eb2d3c8fb2b04094a56f388515e13a9bd6d7949a018.svg")],
    ["19:3", "Streaming · Breakout", content("4e847b4dca20fbf1c56d3a47cac3c9204f02113c9d5a270ebebdf12909c75848.svg")],
    ["19:4", "Streaming · Standout", content("27d0e6939f13dcf113243fc9eac642b15e9764ad891e06c5ed78d45a17678582.svg")],
    ["19:5", "Streaming · Trendsetter", content("af681483be2035f14b0f2bfe2e25a8944c97149172938888ca1008edbe037aad.svg")],
    ["19:6", "Streaming · Headliner", content("e69a0c86a476c9782ea1d3e7b5ba308eec3d9d6a3eae6ab8af3180f67d16b468.svg")],
    ["19:7", "Streaming · Star", content("06b6206db966635cf626651bdb94eacce5a23ab05dc7f600f7d31aa482b2058c.svg")],
    ["19:8", "Streaming · Sensation", content("1a3b9120ecd64c342083c37980b225d29ebf4544da6ab546c9268f87904c9dfe.svg")],
    ["19:9", "Streaming · Visionary", content("85f714b90ed3ceb1e00e1f2069bf3ebd564962fa940c92540061537a045e54ab.svg")],
    ["19:10", "Streaming · Phenomenon", content("61331d04b7a9542b38bfa59583360c0b9b93c6496a04f99c0ab37fa1d83ec58a.svg")],
    ["20:1", "Game Time · Casual", content("b75fcc4dd1c65dfd4169a203e21023453fd6fe853c9b5c1fd839781fda98e80d.svg")],
    ["20:2", "Game Time · Recreational", content("f0f32cb2a0003475e443b76a7a2baf454356953ecb84195c7a08c3ce2fd95b70.svg")],
    ["20:3", "Game Time · Dedicated", content("e0c82f41bcad94a2a52713800fbef7687d0d2c6a6066b09d5e5876156d086e1a.svg")],
    ["20:4", "Game Time · Committed", content("16f2aeb7465c99efce4d67d9333e3ddcf7435d6e60d2f5f93dc0c07bc7c5a69b.svg")],
    ["20:5", "Game Time · Serious", content("ba26e83fa68189b41837184e38706f41c288dd29ffba266035d1a5ad9adbae22.svg")],
    ["20:6", "Game Time · Devoted", content("851b194288f1913ece6c8d99976519e48210580d6f42d994f21e37801611ad54.svg")],
    ["20:7", "Game Time · Seasoned", content("8b10f5c0c30abbd521be5afc2e0dd4ec6da18bfbc689f06d93a51d06577cd84a.svg")],
    ["20:8", "Game Time · Ironclad", content("d705628490898f2cc22d669cf8b415bc03fed1ddaf98a2a8cbd97442a509293c.svg")],
    ["20:9", "Game Time · Unshakeable", content("2bddcbc9f9959dab805eb7196c8112ce9dc68b09766c8193ab499b1870e44ac7.svg")],
    ["20:10", "Game Time · Eternal", content("457ce4e657f0ced23197891cc3d75b7de29cafa065cdb8cbb81060ac0e63b07f.svg")],
    ["21:1", "Game Variety · Sampler", content("ed18d5976c01a4ea19f5a13af08f0547582405cbe48b098b0822e352b8e0a822.svg")],
    ["21:2", "Game Variety · Dabbler", content("e450d5279537db06ee47a104af520b884adaa7ffc3ef2627157526bf1c58e840.svg")],
    ["21:3", "Game Variety · Enthusiast", content("158a9d91b8ca9e96d4afeee38cd640fc51483a8196edb9af0c26e44727acafae.svg")],
    ["21:4", "Game Variety · Ranger", content("9e491942070007f64011ae4fc478926b96433698c07621fc43bafdd5efe83912.svg")],
    ["21:5", "Game Variety · Explorer", content("e25fc55814262150e154ddb1a2b55fc5ed8ed5ba2ff1a22a33d4a41e651e370a.svg")],
    ["21:6", "Game Variety · Adventurer", content("542d5277e0001ea738d5eb57b247dcab9ce6e0c29493d5892203f6258fde55b9.svg")],
    ["21:7", "Game Variety · Voyager", content("082e693cb9ce98b81af618978d449409efc6522b061bc0eac6e88a949fd888c6.svg")],
    ["21:8", "Game Variety · Maverick", content("6fc242e9e8259c471a5e4599cd09af5476e622a572ff235883173913bf506103.svg")],
    ["21:9", "Game Variety · Polymath", content("be9a4d119b8e0d7fc1df7e5a12081332637cb9c978a90377cb9c930500b2fbe6.svg")],
    ["21:10", "Game Variety · Universalist", content("fcc34d343451505c642f3397cec2669a2de3a4a410fb968f794b3a1a0dcd1728.svg")],
    ["1:1", "Nitro · Bronze (1 Month)", icon("4f33c4a9c64ce221936bd256c356f91f.png")],
    ["1:2", "Nitro · Silver (3 Months)", icon("4514fab914bdbfb4ad2fa23df76121a6.png")],
    ["1:3", "Nitro · Gold (6 Months)", icon("2895086c18d5531d499862e41d1155a6.png")],
    ["1:4", "Nitro · Platinum (12 Months)", icon("0334688279c8359120922938dcb1d6f8.png")],
    ["1:5", "Nitro · Diamond (24 Months)", icon("0d61871f72bb9a33a7ae568c1fb4f20a.png")],
    ["1:6", "Nitro · Emerald (36 Months)", icon("11e2d339068b55d3a506cff34d3780f3.png")],
    ["1:7", "Nitro · Ruby (60 Months)", icon("cd5e2cfd9d7f27a8cdcd3e8a8d5dc9f4.png")],
    ["1:8", "Nitro · Opal (72+ Months)", icon("5b154df19c53dce2af92c9b61e6be5e2.png")],
    ["12:1", "Server Boost · 1 Month", web("ca18353be0e57a2b3b3132fa1c08d6b4.svg")],
    ["12:2", "Server Boost · 2 Months", web("22f99ed6e34eaca48950254c70f8fe8d.svg")],
    ["12:3", "Server Boost · 3 Months", web("4a2618502278029ce88adeea179ed435.svg")],
    ["12:4", "Server Boost · 6 Months", web("fbafa6adb7c49a6a2c3822521ff2af2f.svg")],
    ["12:5", "Server Boost · 9 Months", web("0599f90e32c15b532647163edd72f70a.svg")],
    ["12:6", "Server Boost · 1 Year", web("e07c08cdc72bcc78b69c76d2c7ceb344.svg")],
    ["12:7", "Server Boost · 1 Year & 3 Months", web("c7f26927db5e7806790f4e968038630a.svg")],
    ["12:8", "Server Boost · 1 Year & 6 Months", web("c6d88d1d12afe03bdc4ebb747f8d196b.svg")],
    ["12:9", "Server Boost · 2 Years", web("d96ed283b74de75692487b7499fb8d09.svg")],
].map(([id, name, url]) => ({ id, name, url }));

function officialArtwork(value: unknown): string | undefined {
    if (typeof value !== "string") return;
    if (value === lastMeadow) return value;
    try {
        const url = new URL(value);
        if (url.protocol === "https:" && !url.username && !url.password && !url.port &&
            ["cdn.discordapp.com", "media.discordapp.net", "discord.com"].includes(url.hostname) &&
            /^\/(?:assets\/|badge-icons\/)/.test(url.pathname)) return url.href;
    } catch { /* Skip malformed artwork URLs. */ }
}

type BadgeArt = {
    name?: unknown;
    simple_icon_url?: unknown;
    simple_icon_raster_url?: unknown;
};
type DirectoryBadge = BadgeArt & { badge_id?: unknown; tiers?: (BadgeArt & { key: unknown })[] };

export function readBadges(value: unknown): Badge[] {
    if (!Array.isArray(value)) return [];
    const seen = new Set<string>();
    return value.filter((badge): badge is Badge => {
        if (!badge || typeof badge.id !== "string" || typeof badge.name !== "string" ||
            !badge.name || !officialArtwork(badge.url)) return false;
        const key = badgeKey(badge.id);
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
    }).map(badge => {
        // Larp 1.0.0 saved Nitro artwork URLs alongside the selections.
        const tier = badgeKey(badge.id) === "1" ? builtInBadges.find(entry => entry.id === badge.id) : undefined;
        return tier && tier.url !== badge.url ? { ...badge, url: tier.url } : badge;
    });
}

export const defaultBadges = builtInBadges;

export async function loadBadges(userId: string): Promise<Badge[]> {
    const directory = findByStoreName("BadgeDirectoryStore");
    const actions = findByFilePath("modules/badges/BadgeDirectoryActionCreators.tsx") ??
        findByProps("fetchBadgeDirectory", "fetchBadge");
    if (directory && (!directory.hasCatalogFor?.(userId) || directory.isCatalogStaleFor?.(userId))) {
        try {
            await actions?.fetchBadgeDirectory?.(userId);
        } catch { /* The bundled directory still works when Discord's catalog is unavailable. */ }
    }
    const fromDiscord: unknown = directory?.getBadges?.(userId);
    const badges = new Map(builtInBadges.map(badge => [badge.id, badge]));
    if (!Array.isArray(fromDiscord)) return [...badges.values()];
    const add = (id: string, art: BadgeArt, family?: string) => {
        const url = officialArtwork(art.simple_icon_raster_url) ?? officialArtwork(art.simple_icon_url);
        if (!url || typeof art.name !== "string" || !art.name) return;
        badges.set(id, { id, name: family ? `${family} · ${art.name}` : art.name, url });
    };
    for (const entry of fromDiscord as DirectoryBadge[]) {
        const id = String(entry?.badge_id);
        if (!/^[1-9]\d*$/.test(id) || id === "1") continue;
        const bundledTiers = builtInBadges.some(badge => badge.id.startsWith(`${id}:`));
        if (badges.has(id) || (!bundledTiers && !entry.tiers?.length)) add(id, entry);
        if (bundledTiers || !Array.isArray(entry.tiers)) continue;
        for (const tier of entry.tiers) {
            if (!/^[\w-]+$/.test(String(tier?.key ?? ""))) continue;
            add(`${id}:${tier.key}`, tier, typeof entry.name === "string" && entry.name ? entry.name : "Badge");
        }
    }
    return [...badges.values()];
}
