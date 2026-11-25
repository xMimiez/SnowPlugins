import { findByFilePath, waitForFilePath } from "@snow/discord";
import { register, type Any, type Runtime } from "../../../shared/runtime";
import { Editor, type EditorProps } from "./editor";
import { BadgeArtwork } from "./badge-sheet";
import { readBadges } from "./badges";
import { collectibleFields, collectibleLabels, imageUrl, renderCopy, type CollectibleField, type Collectibles, type Draft, type SavedProfile } from "./profile";

const shortcutId = "mime-larp-profile-button";
const nightyId = "mime-nighty-profile-button";
const isShortcut = (id: string, child: Any) => child?.key === id || child?.props?.testID === id;

function addShortcut(bar: Any, shortcut: (sample: Any) => Any) {
    const children = bar.props?.children;
    if (!Array.isArray(children)) return;
    const identity = (child: Any) => [child?.key, child?.props?.testID, child?.props?.tab];
    if (children.some(child => isShortcut(shortcutId, child))) return;
    const settings = children.findIndex(child => {
        const props = child?.props;
        const icon = props?.IconComponent;
        return typeof props?.onPress === "function" &&
            [...identity(child), props.label, props.accessibilityLabel, icon?.name, icon?.displayName]
                .some(value => typeof value === "string" && /^(?:user[_ -]?)?settings(?:icon)?$|^(?:gear|cog)icon$/i.test(value));
    });
    if (settings < 0) return;
    const nighty = children.findIndex(child => isShortcut(nightyId, child));
    const next = children.slice();
    next.splice((nighty < 0 ? settings : nighty) + 1, 0, shortcut(children[settings]));
    return next;
}

function Larp(r: Runtime) {
    const { React, RN, h } = r;
    const users = () => r.byStore("UserStore");
    const currentId = () => users()?.getCurrentUser?.()?.id;
    const profiles = () => r.store.profiles as Record<string, SavedProfile>;
    let readingRealProfile = false;
    const local = (id: unknown) => r.active && !readingRealProfile && typeof id === "string" && id === currentId() ? profiles()[id] : undefined;
    const withModule = (path: string, callback: (module: Any) => void) => {
        const loaded = findByFilePath(path);
        if (loaded) callback(loaded);
        else waitForFilePath(path, callback);
    };

    function ShortcutLayout({ bar, children }: { bar: Any; children: Any[] }) {
        // Render after both plugins have inserted their buttons, regardless of load order.
        const nighty = children.findIndex(child => isShortcut(nightyId, child));
        if (nighty < 0 || !isShortcut(shortcutId, children[nighty + 1]))
            return React.cloneElement(bar, {}, children);
        const grouped = children.slice();
        grouped.splice(nighty, 2, h(RN.View, {
            // Nighty also checks the rendered row for its key before inserting a fallback button.
            key: nightyId,
            style: { flexDirection: "row", alignItems: "center", flexShrink: 1, gap: 2 },
        }, children[nighty], children[nighty + 1]));
        return React.cloneElement(bar, {}, grouped);
    }

    const collectibleKeys = { sku: "decoration", effectSku: "effect", frameSku: "frame", nameplateSku: "nameplate" } as const;
    const itemTypes = { sku: 0, effectSku: 1, nameplateSku: 2, frameSku: 3 } as const;

    async function resolveCollectible(field: CollectibleField, skuId: string): Promise<Collectibles> {
        const catalog = r.byStore("CollectiblesCategoryStore");
        const actions = r.find("fetchCollectiblesProduct", "maybeFetchCollectiblesProduct");
        const label = collectibleLabels[field].toLowerCase();
        let product: Any;
        try {
            product = catalog?.getProduct?.(skuId);
            if (!product) {
                const fetched = await actions?.fetchCollectiblesProduct?.(skuId);
                product = catalog?.getProduct?.(skuId) ?? fetched;
            }
        } catch {
            throw new Error(`Couldn't load the ${label} SKU ID from Discord's catalog.`);
        }
        const item = Array.isArray(product?.items)
            ? product.items.find((entry: Any) => entry?.type === itemTypes[field])
            : undefined;
        if (field === "sku") {
            const assets = r.find("getAssetForAvatarDecorationProduct");
            const asset = item?.asset ?? (product && assets?.getAssetForAvatarDecorationProduct?.(product));
            if (typeof asset === "string" && /^[a-zA-Z0-9_]+$/.test(asset)) return { decoration: { skuId: item?.skuId ?? skuId, asset } };
        } else if (field === "effectSku" && item) {
            return { effect: { skuId: item.skuId ?? skuId } };
        } else if (field === "frameSku" && Array.isArray(item?.layers) && item.layers.length) {
            return { frame: { ...item, skuId: item.skuId ?? skuId } };
        } else if (field === "nameplateSku" && typeof item?.asset === "string" && item.asset) {
            return { nameplate: { skuId: item.skuId ?? skuId, asset: item.asset, label: item.label, palette: item.palette } };
        }
        throw new Error(`This SKU ID didn't resolve to a ${label}.`);
    }

    async function save(id: string, draft: Draft, resolve: EditorProps["resolveCollectible"]) {
        const old = profiles()[id];
        const collectibles = await Promise.all(collectibleFields.map(async field => {
            const skuId = draft[field].trim();
            const key = collectibleKeys[field];
            if (!skuId) return {};
            if (skuId === old?.draft[field] && old[key]) return { [key]: old[key] };
            return resolve(field, skuId);
        }));
        if (!r.active || id !== currentId()) throw new Error("Your Discord account changed. Reopen Larp to edit this profile.");
        const previous = profiles();
        const cleanDraft = { ...draft, avatar: imageUrl(draft.avatar) ?? "", banner: imageUrl(draft.banner) ?? "" };
        for (const field of collectibleFields) cleanDraft[field] = draft[field].trim();
        const updated = { draft: cleanDraft, ...Object.assign({}, ...collectibles) };
        r.store.profiles = { ...previous, [id]: updated };
        try {
            await r.api.storage.flush();
        } catch {
            if (r.active) r.store.profiles = previous;
            throw new Error("Couldn't save this profile to local storage. Try again.");
        }
        r.changed();
    }

    function Icon() {
        const color = r.byStore("ThemeStore")?.theme === "light" ? "#303239" : "#f2f3f5";
        return h(RN.View, { style: { width: 24, height: 24, alignItems: "center", justifyContent: "center" } },
            h(RN.View, { style: { width: 20, height: 17, borderWidth: 2, borderColor: color, borderRadius: 4, alignItems: "center", justifyContent: "center", gap: 1 } },
                h(RN.View, { style: { width: 4, height: 4, borderRadius: 2, backgroundColor: color } }),
                h(RN.View, { style: { width: 9, height: 4, borderTopLeftRadius: 4, borderTopRightRadius: 4, backgroundColor: color } })));
    }

    function Shortcut({ sample }: { sample: Any }) {
        r.useRefresh();
        const [editor, setEditor] = React.useState(null as EditorProps | null);
        if (!r.active) return null;
        const open = () => {
            const user = users()?.getCurrentUser?.();
            if (!user?.id || editor) return;
            const id = user.id;
            const images = findByFilePath("utils/AvatarUtils.tsx", true) ?? findByFilePath("utils/AvatarUtils.tsx");
            const realProfile = r.byStore("UserProfileStore")?.getUserProfile?.(id);
            let avatar = "", banner = "";
            readingRealProfile = true;
            try {
                avatar = user.getAvatarURL?.() || images?.getUserAvatarURL?.(user) || "";
                const hash = realProfile?.banner ?? user.banner;
                if (hash) banner = images?.getUserBannerURL?.({ id, banner: hash, size: 512 }) || "";
            } finally {
                readingRealProfile = false;
            }
            const pending = new Map<string, Promise<Collectibles>>();
            const resolve = (field: CollectibleField, sku: string) => {
                const key = `${field}:${sku}`;
                let request = pending.get(key);
                if (!request) {
                    request = resolveCollectible(field, sku).catch(error => {
                        pending.delete(key);
                        throw error;
                    });
                    pending.set(key, request);
                }
                return request;
            };
            setEditor({
                userId: id,
                theme: r.byStore("ThemeStore")?.theme,
                initial: local(id),
                actual: {
                    name: user.globalName || user.username,
                    username: user.username,
                    avatar,
                    banner,
                    bio: realProfile?.bio ?? "",
                    pronouns: realProfile?.pronouns ?? "",
                },
                close: () => setEditor(null),
                resolveCollectible: resolve,
                save: (draft: Draft) => save(id, draft, resolve),
            });
        };
        const button = React.cloneElement(sample, {
            key: shortcutId, testID: shortcutId, tab: shortcutId,
            label: "Larp", accessibilityLabel: "Larp", accessibilityHint: "Open Larp",
            IconComponent: Icon, icon: undefined, onPress: open, onPressOut: undefined,
            onLongPress: undefined, onLayout: undefined, ref: undefined, showRedDot: false,
            selected: false,
        });
        return h(React.Fragment, null, button, editor ? h(Editor, editor) : null);
    }

    function scopedRenderer(element: Any, readId: (props: Any) => unknown, transform: (props: Any, profile: SavedProfile, Base: Any) => Any) {
        const Base = element.type;
        let ScopedRender = wrappers.get(Base)?.get(transform);
        if (!ScopedRender) {
            ScopedRender = function LarpProfileView(props: Any) {
                r.useRefresh();
                const profile = local(readId(props));
                return profile ? transform(props, profile, Base) : h(Base, props);
            };
            if (!wrappers.has(Base)) wrappers.set(Base, new Map());
            wrappers.get(Base)!.set(transform, ScopedRender);
        }
        return h(ScopedRender, { ...element.props, key: element.key });
    }
    const wrappers = new WeakMap<object, Map<Any, Any>>();

    function patchProfileViews() {
        const nativePath = "modules/user_profile/native/";
        const userId = (props: Any) => props.user?.id ?? props.userId ?? props.displayProfile?.userId;
        const view = (component: Any, transform: (props: Any, profile: SavedProfile, Base: Any) => Any) => {
            r.api.jsx.onJsxCreate(component, (_: Any, element: Any) => {
                const id = userId(element.props);
                if (typeof id !== "string" || id !== currentId()) return;
                return scopedRenderer(element, userId, transform);
            });
        };

        view("UserProfilePrimaryInfo", (props, { draft }, Base) => h(Base, {
            ...props,
            user: props.user && draft.username ? renderCopy(props.user, { username: draft.username }) : props.user,
            displayName: draft.name || props.displayName,
            pronouns: draft.pronouns || props.pronouns,
        }));

        view("UserProfileContent", (props, { draft }, Base) => h(Base, {
            ...props,
            displayProfile: props.displayProfile && draft.bio && !props.isPreviewingChanges
                ? renderCopy(props.displayProfile, { bio: draft.bio, getPreviewBio: () => draft.bio })
                : props.displayProfile,
        }));

        view("UserProfileAboutMeCard", (props, { draft }, Base) => h(Base, { ...props, pendingBio: props.pendingBio ?? (draft.bio || undefined) }));

        withModule("modules/main_tabs_v2/native/you_bar/YouBarName.tsx", ({ default: YouName }) => {
            r.patch("before", YouName, "type", ([props, ...rest]) => {
                const draft = local(props?.userId)?.draft;
                const username = draft?.name || draft?.username;
                if (username) return [{ ...props, username }, ...rest];
            });
        });

        withModule("design/void/Avatar/native/Avatar.tsx", ({ default: Avatar }) => {
            r.patch("before", Avatar, "type", ([props, ...rest]) => {
                const profile = local(props?.user?.id);
                if (!profile || (!profile.draft.avatar && !profile.decoration)) return;
                return [{
                    ...props,
                    source: props.source ?? (profile.draft.avatar ? { uri: profile.draft.avatar } : undefined),
                    avatarDecoration: profile.decoration ?? props.avatarDecoration,
                }, ...rest];
            });
        });

        // The You screen builds its banner directly from DisplayProfile.
        view("UnconnectedYouScreen", (props, _profile, Base) => h(Base, props));
        withModule("modules/user_profile/hooks/useDisplayProfile.tsx", module => {
            const apply = ([id]: Any[], display: Any) => {
                const profile = local(id);
                if (!display || !profile || (!profile.effect && !profile.frame)) return;
                return renderCopy(display, {
                    ...(profile.effect ? { profileEffect: profile.effect } : {}),
                    ...(profile.frame ? { profileFrame: profile.frame } : {}),
                });
            };
            // Keep overrides at read time so Discord's underlying profile store stays untouched.
            for (const key of ["default", "useDisplayProfileWithFetchEffect", "getDisplayProfile"])
                r.patch("after", module, key, apply);
        });
        withModule("modules/collectibles/nameplates/hooks/useNameplate.tsx", module => {
            r.patch("before", module, "useNameplate", ([props, ...rest]) => {
                const nameplate = local(props?.user?.id)?.nameplate;
                if (nameplate) return [{
                    ...props, user: renderCopy(props.user, { collectibles: { ...props.user.collectibles, nameplate } }),
                }, ...rest];
            });
        });
        withModule("modules/user_profile/DisplayProfile.tsx", ({ default: DisplayProfile }) => {
            r.patch("after", DisplayProfile?.prototype, "getBannerURL", function (this: Any) {
                return local(this?.userId)?.draft.banner || undefined;
            });
        });

        withModule(nativePath + "UserProfileBanner.tsx", ({ default: Banner }) => {
            if (!Banner) return;
            view(Banner, (props, { draft }, Base) => {
                if (!draft.banner || props.pendingBanner !== undefined) return h(Base, props);
                const banner = () => draft.banner;
                const displayProfile = props.displayProfile
                    ? renderCopy(props.displayProfile, { getBannerURL: banner, getPreviewBanner: banner })
                    : { getBannerURL: banner, getPreviewBanner: banner };
                return h(Base, { ...props, displayProfile, pendingBanner: { imageUri: draft.banner } });
            });
        });

        withModule("modules/profile_customization/native/HeaderAvatar.tsx", ({ default: Avatar }) => {
            if (!Avatar) return;
            view(Avatar, (props, { draft, decoration }, Base) => h(Base, {
                ...props,
                pendingAvatarSrc: props.pendingAvatarSrc ?? (draft.avatar || undefined),
                pendingAvatarDecoration: props.pendingAvatarDecoration ?? decoration,
            }));
        });

        withModule(nativePath + "UserProfilePrimaryInfo.tsx", ({ ProfileBadgeRows: Rows }) => {
            if (!Rows) return;
            const badges = (props: Any, profile: SavedProfile) => {
                const entries = readBadges(profile.draft.badges);
                if (!entries.length) return null;
                return h(RN.View, {
                    style: [props.style, { flexDirection: "row", flexWrap: "wrap", gap: 4 }],
                }, ...entries.map(badge => h(BadgeArtwork, { key: badge.id, badge, size: props.badgeSize ?? 22 })));
            };
            // Leave Discord's badge stores and real editor draft alone.
            view(Rows, badges);
        });
    }

    function patchNamesAndMedia() {
        const byUser = (user: Any) => local(typeof user === "string" ? user : user?.id ?? user?.userId);
        const patchImages = (image: Any) => {
            for (const key of ["getUserAvatarURL", "getGuildMemberAvatarURL", "getGuildMemberAvatarURLSimple"]) {
                r.patch("after", image, key, ([user]) => byUser(user)?.draft.avatar || undefined);
            }
            for (const key of ["getUserAvatarSource", "getGuildMemberAvatarSource"]) {
                r.patch("after", image, key, ([user]) => {
                    const uri = byUser(user)?.draft.avatar;
                    if (uri) return { uri };
                });
            }
            for (const key of ["getUserBannerURL", "getGuildMemberBannerURL"]) {
                r.patch("after", image, key, ([user]) => byUser(user)?.draft.banner || undefined);
            }
        };
        withModule("utils/AvatarUtils.tsx", image => {
            patchImages(image);
            if (image.default && image.default !== image) patchImages(image.default);
        });

        const patchNames = (userUtils: Any) => {
            for (const key of ["getName", "nameFromUser", "useName", "getGlobalName", "getFormattedName"]) {
                r.patch("after", userUtils, key, ([user]) => {
                    const draft = byUser(user)?.draft;
                    return draft?.name || (!user?.globalName && draft?.username) || undefined;
                });
            }
            const replaceUsername = ([user, ...rest]: Any[]) => {
                const username = byUser(user)?.draft.username;
                if (username && user && typeof user === "object") return [renderCopy(user, { username }), ...rest];
            };
            r.patch("before", userUtils, "getUserTag", replaceUsername);
            r.patch("before", userUtils, "useUserTag", replaceUsername);
        };
        withModule("utils/UserUtils.tsx", userUtils => {
            patchNames(userUtils);
            if (userUtils.default && userUtils.default !== userUtils) patchNames(userUtils.default);
        });

        withModule("utils/NicknameUtils.tsx", nickname => {
            for (const key of ["getName", "getNickname", "useName"]) {
                r.patch("after", nickname, key, (args) => byUser(args[2])?.draft.name || undefined);
            }
        });

        withModule("modules/collectibles/avatar_decorations/useAvatarDecoration.tsx", decoration => {
            for (const key of ["getAvatarDecoration", "useAvatarDecoration"]) {
                r.patch("after", decoration, key, ([user]) => byUser(user)?.decoration);
            }
        });

        withModule("modules/messages/native/renderer/createMessageContent.tsx", messageContent => {
            r.patch("before", messageContent, "default", (args) => {
                const input = args[0];
                const user = input?.message?.author;
                const draft = byUser(user)?.draft;
                if (!draft?.name && !draft?.username && !draft?.avatar) return;
                const author = renderCopy(user, {
                    username: draft.username || user.username,
                    globalName: draft.name || user.globalName,
                    ...(draft.avatar ? { getAvatarURL: () => draft.avatar } : {}),
                });
                return [{ ...input, message: renderCopy(input.message, { author }) }, ...args.slice(1)];
            });
        });
    }

    return {
        start() {
            r.hook(["YouScreenNavIconMeasurer"], bar => {
                const children = addShortcut(bar, sample => h(Shortcut, { key: shortcutId, sample }));
                if (children) return h(ShortcutLayout, { key: bar.key, bar }, children);
            });
            patchNamesAndMedia();
            patchProfileViews();
        },
    };
}

Larp.defaults = { profiles: {} };
export default register(Larp);
