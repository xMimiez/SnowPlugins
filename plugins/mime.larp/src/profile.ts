import type { Badge } from "./badges";

export const emptyProfile = {
    name: "", username: "", avatar: "", banner: "", bio: "", pronouns: "", sku: "",
    effectSku: "", frameSku: "", nameplateSku: "",
};

export const collectibleLabels = {
    sku: "Avatar Decoration", effectSku: "Profile Effect", frameSku: "Profile Border", nameplateSku: "Nameplate",
} as const;
export type CollectibleField = keyof typeof collectibleLabels;
export const collectibleFields = Object.keys(collectibleLabels) as CollectibleField[];
export const isSku = (value: string) => /^\d{5,25}$/.test(value);

export type Draft = typeof emptyProfile & { badges: Badge[]; badgeStages: Record<string, string> };
export type Decoration = { skuId: string; asset: string };
export type Nameplate = Decoration & { label: string; palette: string };
export type ProfileFrame = { skuId: string; layers: unknown[] };
export type Collectibles = {
    decoration?: Decoration;
    effect?: { skuId: string };
    frame?: ProfileFrame;
    nameplate?: Nameplate;
};
export type SavedProfile = { draft: Draft } & Collectibles;

export function imageUrl(value: string): string | undefined {
    try {
        const url = new URL(value.trim());
        if (url.protocol === "https:" && !url.username && !url.password) return url.href;
    } catch { /* An incomplete input has no preview yet. */ }
}

export function validateDraft(draft: Draft): string | undefined {
    if (draft.avatar.trim() && !imageUrl(draft.avatar)) return "Enter an HTTPS image URL for the avatar.";
    if (draft.banner.trim() && !imageUrl(draft.banner)) return "Enter an HTTPS image URL for the banner.";
    for (const field of collectibleFields) {
        const value = draft[field]?.trim();
        if (value && !isSku(value)) return `Enter a numeric ${collectibleLabels[field].toLowerCase()} SKU ID.`;
    }
}

// Preserve Discord's record prototype while overriding a copy used only by a renderer.
export function renderCopy<T extends object>(record: T, overrides: Record<string, unknown>): T {
    const descriptors = Object.getOwnPropertyDescriptors(record) as Record<string, PropertyDescriptor>;
    for (const [key, value] of Object.entries(overrides)) {
        descriptors[key] = { value, enumerable: true, configurable: true, writable: true };
    }
    return Object.create(Object.getPrototypeOf(record), descriptors) as T;
}
