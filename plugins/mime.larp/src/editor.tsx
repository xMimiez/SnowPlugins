import { findByFilePath } from "@snow/discord";
import React from "react";
import { Animated, Image, Keyboard, KeyboardAvoidingView, Modal, Platform, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View, useColorScheme } from "react-native";
import { BadgeArtwork, BadgeSheet } from "./badge-sheet";
import { badgeKey, defaultBadges, loadBadges, readBadges } from "./badges";
import { collectibleFields, collectibleLabels, emptyProfile, imageUrl, isSku, validateDraft, type CollectibleField, type Collectibles, type Draft, type SavedProfile } from "./profile";

const fields: { key: keyof typeof emptyProfile; label: string; placeholder?: string; multiline?: boolean; limit: number; sku?: boolean }[] = [
    { key: "name", label: "Display Name", limit: 200 },
    { key: "username", label: "Username", limit: 200 },
    { key: "avatar", label: "Avatar URL", placeholder: "https://…", limit: 2048 },
    { key: "banner", label: "Banner URL", placeholder: "https://…", limit: 2048 },
    { key: "pronouns", label: "Pronouns", limit: 200 },
    { key: "bio", label: "About Me", multiline: true, limit: 4000 },
    ...collectibleFields.map(key => ({ key, label: `${collectibleLabels[key]} SKU ID`, limit: 25, sku: true })),
];

export interface EditorProps {
    userId: string;
    theme?: string;
    initial?: SavedProfile;
    actual: Pick<Draft, "name" | "username" | "avatar" | "banner" | "bio" | "pronouns">;
    close: () => void;
    save: (draft: Draft) => Promise<void>;
    resolveCollectible: (field: CollectibleField, sku: string) => Promise<Collectibles>;
}

export function Editor({ userId, theme, initial, actual, close, save, resolveCollectible }: EditorProps) {
    const [original] = React.useState<Draft>(() => ({
        ...emptyProfile,
        ...initial?.draft,
        badges: readBadges(initial?.draft.badges),
        badgeStages: Object.fromEntries(Object.entries(initial?.draft.badgeStages ?? {}).filter(([family, id]) =>
            typeof id === "string" && /^[1-9]\d*(?::[\w-]+)?$/.test(id) && badgeKey(id) === family)),
    }));
    const [draft, setDraft] = React.useState<Draft>(original);
    const [error, setError] = React.useState("");
    const [discard, setDiscard] = React.useState(false);
    const [saving, setSaving] = React.useState(false);
    const [showBadges, setShowBadges] = React.useState(false);
    const [catalog, setCatalog] = React.useState(defaultBadges);
    const [resolved, setResolved] = React.useState<Partial<Record<CollectibleField, { sku: string; result: Collectibles }>>>({});
    const [cardSize, setCardSize] = React.useState({ width: 0, height: 0 });
    const savingRef = React.useRef(false);
    const discardProgress = React.useRef<Animated.Value | null>(null);
    discardProgress.current ??= new Animated.Value(0);
    const systemTheme = useColorScheme();
    const dark = (theme ?? systemTheme) !== "light";
    const c = dark
        ? { page: "#111214", card: "#1e1f22", input: "#151619", stroke: "#35373c", text: "#f2f3f5", hint: "#b5bac1", accent: "#a2a9ff", danger: "#ff9297" }
        : { page: "#ffffff", card: "#f1f2f5", input: "#ffffff", stroke: "#ccd0d7", text: "#17181c", hint: "#525965", accent: "#4249ba", danger: "#a7202d" };
    const dirty = fields.some(({ key }) => draft[key] !== original[key]) ||
        draft.badges.length !== original.badges.length ||
        draft.badges.some((badge, i) => badge.id !== original.badges[i]?.id) ||
        Object.keys(draft.badgeStages).some(family => draft.badgeStages[family] !== original.badgeStages[family]);
    React.useEffect(() => {
        if (!showBadges) return;
        let open = true;
        void loadBadges(userId).then(badges => { if (open) setCatalog(badges); }, () => {});
        return () => { open = false; };
    }, [showBadges, userId]);
    React.useEffect(() => {
        const progress = discardProgress.current!;
        if (!discard) {
            progress.setValue(0);
            return;
        }
        const animation = Animated.timing(progress, { toValue: 1, duration: 160, useNativeDriver: true });
        animation.start();
        return () => animation.stop();
    }, [discard]);
    const skuValues = [draft.sku, draft.effectSku, draft.frameSku, draft.nameplateSku];
    React.useEffect(() => {
        let active = true;
        const timer = setTimeout(() => {
            for (const field of collectibleFields) {
                const sku = draft[field].trim();
                if (!isSku(sku) || sku === initial?.draft[field]) continue;
                void resolveCollectible(field, sku).then(result => {
                    if (active) setResolved(previous => ({ ...previous, [field]: { sku, result } }));
                }, () => { /* Save reports a SKU that fails validation. */ });
            }
        }, 500);
        return () => { active = false; clearTimeout(timer); };
    }, [...skuValues, resolveCollectible, initial]);
    const leave = () => {
        if (savingRef.current) return;
        if (showBadges) setShowBadges(false);
        else if (discard) setDiscard(false);
        else if (dirty) {
            Keyboard.dismiss();
            setDiscard(true);
        } else close();
    };
    const saveDraft = async () => {
        if (!dirty || savingRef.current) return;
        const invalid = validateDraft(draft);
        if (invalid) { setError(invalid); return; }
        savingRef.current = true;
        setSaving(true);
        setError("");
        try {
            await save(draft);
            close();
        } catch (cause) {
            setError(cause instanceof Error ? cause.message : "Larp couldn't save. Try again.");
        } finally {
            savingRef.current = false;
            setSaving(false);
        }
    };
    const avatar = imageUrl(draft.avatar) ?? actual.avatar;
    const banner = imageUrl(draft.banner) ?? actual.banner;
    const bio = draft.bio || actual.bio;
    const pronouns = draft.pronouns || actual.pronouns;
    const preview = (field: CollectibleField) => {
        const sku = draft[field].trim();
        const result = resolved[field];
        if (!sku) return;
        if (sku === initial?.draft[field]) return initial;
        if (result?.sku === sku) return result.result;
    };
    const decoration = preview("sku")?.decoration;
    const effect = preview("effectSku")?.effect;
    const frame = preview("frameSku")?.frame;
    const nameplate = preview("nameplateSku")?.nameplate;
    const ProfileEffect = effect && findByFilePath("modules/collectibles/profile_effects/native/ProfileEffect.tsx")?.default;
    const ProfileFrame = frame && findByFilePath("modules/collectibles/profile_frames/native/ProfileFrame.tsx")?.default;
    const Nameplate = nameplate && findByFilePath("modules/collectibles/nameplates/native/Nameplate.tsx")?.default;
    const nameplateData = nameplate && findByFilePath("modules/collectibles/nameplates/utils.tsx")?.getNameplateData?.(nameplate);
    const Backdrop = discard && findByFilePath("design/components/Backdrop/native/Backdrop.native.tsx")?.Backdrop;
    return <Modal animationType="slide" presentationStyle="fullScreen" onRequestClose={leave}>
        <SafeAreaView style={[styles.page, { backgroundColor: c.page }]}>
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.page}>
            <View style={[styles.header, { borderColor: c.stroke }]} accessibilityElementsHidden={discard || showBadges} importantForAccessibility={discard || showBadges ? "no-hide-descendants" : "auto"}>
                <Pressable accessibilityRole="button" accessibilityLabel="Close" onPress={leave} style={styles.headerButton}>
                    <Text style={[styles.close, { color: c.text }]}>×</Text>
                </Pressable>
                <Text accessibilityRole="header" style={[styles.heading, { color: c.text }]}>Profile</Text>
                <Pressable accessibilityRole="button" accessibilityState={{ disabled: !dirty || saving }} disabled={!dirty || saving} onPress={saveDraft} style={styles.headerButton}>
                    <Text style={{ color: c.accent, fontWeight: "600", opacity: dirty ? 1 : 0.45 }}>{saving ? "Saving…" : "Save"}</Text>
                </Pressable>
            </View>
            {error ? <Text accessibilityRole="alert" style={[styles.error, { color: c.danger }]}>{error}</Text> : null}
            <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.content} accessibilityElementsHidden={discard || showBadges} importantForAccessibility={discard || showBadges ? "no-hide-descendants" : "auto"}>
                <Text style={[styles.helper, { color: c.hint }]}>Larp · Only visible on this device</Text>
                <View style={[styles.card, { backgroundColor: c.card }]} onLayout={({ nativeEvent: { layout } }) => {
                    setCardSize(previous => previous.width === layout.width && previous.height === layout.height
                        ? previous : { width: layout.width, height: layout.height });
                }}>
                    <View style={[styles.banner, { backgroundColor: c.stroke }]}>
                        {banner ? <Image source={{ uri: banner }} style={StyleSheet.absoluteFill} resizeMode="cover" /> : null}
                    </View>
                    <View style={styles.preview}>
                        <View style={[styles.avatar, { backgroundColor: c.input, borderColor: c.card }]}>
                            {avatar ? <Image source={{ uri: avatar }} style={styles.avatarImage} resizeMode="cover" /> : null}
                            {decoration ? <Image source={{ uri: `https://cdn.discordapp.com/avatar-decoration-presets/${decoration.asset}.png?size=128` }} style={styles.decoration} /> : null}
                        </View>
                        <View style={styles.name}>
                            {Nameplate && nameplateData ? <Nameplate nameplate={nameplateData} fullOpacity animate style={StyleSheet.absoluteFill} /> : null}
                            <Text style={[styles.displayName, { color: c.text }]}>{draft.name || actual.name}</Text>
                        </View>
                        <Text style={{ color: c.hint }}>{draft.username || actual.username}{pronouns ? ` · ${pronouns}` : ""}</Text>
                        {bio ? <Text style={[styles.bio, { color: c.text }]}>{bio}</Text> : null}
                        {draft.badges.length ? <View style={styles.badges}>
                            {draft.badges.map(badge => <BadgeArtwork key={badge.id} badge={badge} size={22} />)}
                        </View> : null}
                    </View>
                    {ProfileEffect && effect ? <View pointerEvents="none" style={StyleSheet.absoluteFill}>
                        <ProfileEffect key={effect.skuId} skuId={effect.skuId} bannerAdjustment={0} />
                    </View> : null}
                    {ProfileFrame && cardSize.width ? <View pointerEvents="none" style={StyleSheet.absoluteFill}>
                        <ProfileFrame frame={frame} frameOrder="back" containerWidth={cardSize.width} containerHeight={cardSize.height} />
                        <ProfileFrame frame={frame} frameOrder="front" containerWidth={cardSize.width} containerHeight={cardSize.height} />
                    </View> : null}
                </View>
                <Text style={[styles.helper, { color: c.hint }]}>Leave a field blank to show your real profile information.</Text>
                <Pressable accessibilityRole="button" accessibilityLabel="Badges" onPress={() => {
                    Keyboard.dismiss();
                    setShowBadges(true);
                }} disabled={saving} style={[styles.input, styles.badgesButton, { backgroundColor: c.input, borderColor: c.stroke }]}>
                    <Text style={[styles.label, { color: c.text }]}>Badges</Text>
                    <Text style={{ color: c.hint }}>{draft.badges.length} visible　›</Text>
                </Pressable>
                {fields.map(({ key, label, placeholder, multiline, limit, sku }) => <View key={key} style={styles.field}>
                    <Text style={[styles.label, { color: c.text }]}>{label}</Text>
                    <TextInput accessibilityLabel={label} value={draft[key]} onChangeText={value => {
                        setError("");
                        setDraft(current => ({ ...current, [key]: value }));
                    }} editable={!saving} placeholder={placeholder} placeholderTextColor={c.hint} maxLength={limit} multiline={multiline}
                        keyboardType={sku ? "number-pad" : key === "avatar" || key === "banner" ? "url" : "default"}
                        autoCapitalize={key === "username" || key === "avatar" || key === "banner" ? "none" : "sentences"}
                        style={[styles.input, multiline && styles.multiline, { backgroundColor: c.input, color: c.text, borderColor: c.stroke }]} />
                </View>)}
            </ScrollView>
            {showBadges ? <BadgeSheet selected={draft.badges} stages={draft.badgeStages} catalog={catalog} colors={c}
                close={() => setShowBadges(false)}
                onChange={(badges, badgeStages) => setDraft(current => ({ ...current, badges, badgeStages }))} /> : null}
            {discard ? <Animated.View style={[styles.overlay, { opacity: discardProgress.current }]} accessibilityViewIsModal>
                {Backdrop ? <Backdrop blur="strong" style={StyleSheet.absoluteFill} /> :
                    <View style={[StyleSheet.absoluteFill, { backgroundColor: "#000b" }]} />}
                <Animated.View style={[styles.dialog, { backgroundColor: dark ? "#0d0d0f" : c.page, borderColor: c.stroke,
                    transform: [{ scale: discardProgress.current.interpolate({ inputRange: [0, 1], outputRange: [0.96, 1] }) }],
                }]}>
                    <Text style={[styles.heading, { color: c.text, textAlign: "center" }]}>Discard unsaved changes?</Text>
                    <Text style={{ color: c.hint, textAlign: "center" }}>You have unsaved changes, are you sure you want to discard them?</Text>
                    <View style={styles.dialogActions}>
                        <Pressable accessibilityRole="button" onPress={close} style={[styles.dialogButton, { backgroundColor: "#5865f2", borderColor: "#5865f2" }]}><Text style={{ color: "#fff", fontWeight: "600" }}>Discard</Text></Pressable>
                        <Pressable accessibilityRole="button" onPress={() => setDiscard(false)} style={[styles.dialogButton, { backgroundColor: c.card, borderColor: c.stroke }]}><Text style={{ color: c.text, fontWeight: "600" }}>Keep Editing</Text></Pressable>
                    </View>
                </Animated.View>
            </Animated.View> : null}
        </KeyboardAvoidingView>
        </SafeAreaView>
    </Modal>;
}

const styles = StyleSheet.create({
    page: { flex: 1 },
    header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", minHeight: 52, borderBottomWidth: StyleSheet.hairlineWidth },
    headerButton: { minHeight: 44, paddingHorizontal: 16, justifyContent: "center" },
    heading: { fontSize: 18, fontWeight: "700" },
    close: { fontSize: 28 },
    content: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 48, gap: 14 },
    helper: { fontSize: 13, lineHeight: 18 },
    card: { borderRadius: 16, overflow: "hidden" },
    banner: { height: 105 },
    preview: { paddingHorizontal: 14, paddingBottom: 16 },
    avatar: { width: 78, height: 78, borderWidth: 5, borderRadius: 39, marginTop: -39, marginBottom: 8 },
    avatarImage: { width: "100%", height: "100%", borderRadius: 34 },
    decoration: { width: 90, height: 90, position: "absolute", left: -11, top: -11 },
    displayName: { fontSize: 23, fontWeight: "700" },
    name: { justifyContent: "center", minHeight: 30 },
    bio: { marginTop: 12, fontSize: 15 },
    badges: { flexDirection: "row", flexWrap: "wrap", gap: 6, marginTop: 6 },
    badgesButton: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
    field: { gap: 6 },
    label: { fontSize: 14, fontWeight: "600" },
    input: { borderRadius: 9, borderWidth: 1, minHeight: 44, paddingHorizontal: 12, paddingVertical: 10, fontSize: 16 },
    error: { paddingHorizontal: 16, paddingTop: 8 },
    multiline: { minHeight: 88, textAlignVertical: "top" },
    overlay: { ...StyleSheet.absoluteFill, alignItems: "center", justifyContent: "center", padding: 24 },
    dialog: { width: "100%", maxWidth: 400, padding: 24, gap: 8, borderRadius: 24, borderWidth: StyleSheet.hairlineWidth },
    dialogActions: { gap: 10, marginTop: 16 },
    dialogButton: { minHeight: 42, alignItems: "center", justifyContent: "center", borderRadius: 8, borderWidth: StyleSheet.hairlineWidth },
});
