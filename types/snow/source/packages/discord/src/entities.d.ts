/** Null when the role has no colour. */
export declare function roleColorHex(role: {
    color?: number;
} | null | undefined): string | null;
/** The fields of Discord's user record that decide its avatar. */
export interface AvatarUser {
    id?: string;
    avatar?: string | null;
    discriminator?: string | null;
}
/**
 * Discord's default avatar for a user without one: legacy discriminators and bots pick by
 * discriminator, migrated usernames by the ID's timestamp bits. Null without a numeric ID.
 */
export declare function defaultAvatarUrl(id: string | null | undefined, discriminator?: string | null): string | null;
/**
 * The account avatar as a static PNG (the first frame of an animated one), else the default
 * avatar. Built from the record's fields because Discord's getter returns a bundled image ID,
 * not a URL, for users without an avatar.
 */
export declare function staticAvatarUrl(user: AvatarUser, size: number): string | null;
/** Falls back to the default avatar for `fallbackId`, which is the user's own ID unless told otherwise. */
export declare function avatarUrl(user: (AvatarUser & {
    getAvatarURL?: (guildId: undefined, size: number, canAnimate: boolean) => unknown;
}) | null | undefined, size: number, fallbackId?: string | null | undefined): string | null;
