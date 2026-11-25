import { findByFilePath, findByProps } from "@snow/discord";
import React from "react";
import { Animated, Image, Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions, type GestureResponderEvent, type NativeScrollEvent, type NativeSyntheticEvent } from "react-native";
import { badgeKey, defaultBadges, tierFamilies, type Badge } from "./badges";

export function BadgeArtwork({ badge, size, muted }: { badge: Badge; size: number; muted?: boolean }) {
    const NativeArt = findByFilePath("modules/badges/native/BadgeArtImage.tsx")?.default;
    const SvgUri = !NativeArt && badge.url.includes(".svg") ? findByProps("SvgXml", "SvgUri")?.SvgUri : null;
    return <View accessibilityLabel={badge.name} style={{ width: size, height: size, opacity: muted ? 0.35 : 1 }}>
        {NativeArt ? <NativeArt url={badge.url} height={size} /> : SvgUri ?
            <SvgUri uri={badge.url} width={size} height={size} /> :
            <Image source={{ uri: badge.url }} style={{ width: size, height: size }} resizeMode="contain" />}
    </View>;
}

const columns = 3;
const gap = 16;
const insets = 16;
const transitionMs = 160;
const edgeSize = 48;

type Props = {
    selected: Badge[];
    stages: Record<string, string>;
    close: () => void;
    onChange: (badges: Badge[], stages: Record<string, string>) => void;
    catalog: Badge[];
    colors: { page: string; card: string; text: string; hint: string; accent: string };
};

type MenuItem = { label: string; action: () => void; trailingIndicator?: React.ComponentType };

type MenuAnchor = {
    ref: React.Ref<View>;
    onLongPress?: () => void;
    accessibilityActions?: React.ComponentProps<typeof Pressable>["accessibilityActions"];
    onAccessibilityAction?: React.ComponentProps<typeof Pressable>["onAccessibilityAction"];
};

function familyName(badge: Badge) {
    const key = badgeKey(badge.id);
    return tierFamilies[key] ?? (key !== badge.id ? badge.name.split(" · ")[0] : undefined);
}

export function BadgeSheet({ selected, stages, close, onChange, catalog = defaultBadges, colors: c }: Props) {
    const [menu, setMenu] = React.useState<{ items: MenuItem[]; x: number; y: number } | null>(null);
    const [chooseStage, setChooseStage] = React.useState<Badge | null>(null);
    const stageFamily = chooseStage && badgeKey(chooseStage.id);
    const [target, setTarget] = React.useState(-1);
    const start = React.useRef<{ x: number; y: number; scroll: number; index: number; key: string; to: number; lastY: number } | null>(null);
    const positions = React.useRef(new Map<string, Animated.ValueXY>()).current;
    const scroll = React.useRef<ScrollView>(null);
    const scrollY = React.useRef(0);
    const viewport = React.useRef({ y: 0, height: 0 });
    const autoScroll = React.useRef<ReturnType<typeof setInterval> | undefined>(undefined);
    const sheetTouchY = React.useRef(0);
    const dragged = React.useRef(false);
    const { width, height } = useWindowDimensions();
    const size = Math.floor((Math.min(width, 540) - 2 * insets - (columns - 1) * gap) / columns);
    const step = size + gap;
    const slot = (index: number) => ({ x: (index % columns) * step, y: Math.floor(index / columns) * step });
    const shown = new Map(selected.map(badge => [badgeKey(badge.id), badge]));
    const tiles = new Map(shown);
    for (const entry of catalog) {
        const key = badgeKey(entry.id);
        if (!tiles.has(key)) tiles.set(key, catalog.find(badge => badge.id === stages[key]) ?? entry);
    }
    const entries = [...tiles.values()];
    const gridHeight = Math.max(0, Math.ceil(entries.length / columns) * step - gap);
    const EyeSlash = findByFilePath("design/components/Icon/native/redesign/generated/EyeSlashIcon.tsx")?.EyeSlashIcon ??
        findByProps("EyeSlashIcon")?.EyeSlashIcon;
    const Eye = findByFilePath("design/components/Icon/native/redesign/generated/EyeIcon.tsx")?.EyeIcon;
    const ContextMenu = findByFilePath("design/components/ContextMenu/native/ContextMenu.native.tsx")?.ContextMenu;
    const ContextMenuContainer = findByFilePath("design/components/ContextMenu/native/ContextMenuContainer.native.tsx")?.ContextMenuContainer;
    const nativeMenu = ContextMenu && ContextMenuContainer;
    const hideMenu = findByFilePath("design/components/ContextMenu/native/ContextMenuState.native.tsx")?.hideContextMenu;

    const reorder = (from: number, to: number) => {
        if (from === to || to < 0 || to >= selected.length) return;
        const next = [...selected];
        next.splice(to, 0, ...next.splice(from, 1));
        onChange(next, stages);
    };
    React.useEffect(() => {
        const from = start.current?.index ?? -1;
        entries.forEach((badge, index) => {
            if (target >= 0 && index === from) return;
            let destination = index;
            if (from < index && index <= target) destination--;
            if (target >= 0 && target <= index && index < from) destination++;
            const position = positions.get(badgeKey(badge.id));
            if (position) Animated.timing(position, { toValue: slot(destination), duration: transitionMs, useNativeDriver: true }).start();
        });
    }, [target, selected, catalog, size]);
    const stopScrolling = () => {
        clearInterval(autoScroll.current);
        autoScroll.current = undefined;
    };
    React.useEffect(() => stopScrolling, []);

    const trackDrag = (dx: number, dy: number) => {
        const origin = start.current;
        if (!origin) return;
        const { x, y } = slot(origin.index);
        const position = { x: x + dx, y: y + dy + scrollY.current - origin.scroll };
        positions.get(origin.key)?.setValue(position);
        const col = Math.max(0, Math.min(columns - 1, Math.round(position.x / step)));
        const row = Math.max(0, Math.round(position.y / step));
        const next = Math.min(selected.length - 1, row * columns + col);
        if (next !== origin.to) {
            origin.to = next;
            setTarget(next);
        }
    };
    const lastX = React.useRef(0);
    const drag = ({ nativeEvent }: GestureResponderEvent) => {
        const origin = start.current;
        if (!origin) return;
        const dx = nativeEvent.pageX - origin.x;
        const dy = nativeEvent.pageY - origin.y;
        if (!dragged.current) {
            if (Math.hypot(dx, dy) < 12) return;
            dragged.current = true;
            setMenu(null);
            hideMenu?.();
            scroll.current?.getNativeScrollRef()?.measure((_x, _y, _width, height, _pageX, pageY) => {
                viewport.current = { y: pageY, height };
            });
            stopScrolling();
            autoScroll.current = setInterval(() => {
                const touch = start.current;
                const { y, height } = viewport.current;
                if (!touch || !height) return;
                const top = touch.lastY - y;
                const bottom = y + height - touch.lastY;
                const velocity = top < edgeSize ? -Math.min(1, 1 - top / edgeSize) : Math.max(0, Math.min(1, 1 - bottom / edgeSize));
                if (velocity) scroll.current?.scrollTo({
                    y: Math.max(0, Math.min(gridHeight + 32 - height, scrollY.current + velocity * 8)),
                    animated: false,
                });
            }, 16);
        }
        lastX.current = nativeEvent.pageX;
        origin.lastY = nativeEvent.pageY;
        trackDrag(dx, dy);
    };
    const trackScroll = ({ nativeEvent }: NativeSyntheticEvent<NativeScrollEvent>) => {
        scrollY.current = nativeEvent.contentOffset.y;
        const origin = start.current;
        if (origin && dragged.current) trackDrag(lastX.current - origin.x, origin.lastY - origin.y);
    };
    const endDrag = (commit: boolean) => {
        const origin = start.current;
        stopScrolling();
        if (commit && origin && origin.to >= 0) reorder(origin.index, origin.to);
        start.current = null;
        setTarget(-1);
    };
    const selectStage = (stage: Badge) => {
        const key = badgeKey(stage.id);
        onChange(selected.map(badge => badgeKey(badge.id) === key ? stage : badge), { ...stages, [key]: stage.id });
        setChooseStage(null);
    };

    return <View style={styles.overlay} accessibilityViewIsModal
        onAccessibilityEscape={menu ? () => setMenu(null) : chooseStage ? () => setChooseStage(null) : close}>
        <Pressable style={StyleSheet.absoluteFill} onPress={close} accessibilityRole="button" accessibilityLabel="Close badges" />
        <View style={[styles.sheet, { backgroundColor: c.page }]}>
            <View
                style={styles.header}
                accessibilityElementsHidden={!!menu || !!chooseStage}
                importantForAccessibility={menu || chooseStage ? "no-hide-descendants" : "auto"}
                onTouchStart={({ nativeEvent }) => { sheetTouchY.current = nativeEvent.pageY; }}
                onTouchEnd={({ nativeEvent }) => { if (nativeEvent.pageY - sheetTouchY.current > 40) close(); }}
            >
                <View style={[styles.handle, { backgroundColor: c.hint }]} />
                <Text accessibilityRole="header" style={[styles.heading, { color: c.text }]}>Customize your badges</Text>
                <Text style={[styles.subtitle, { color: c.hint }]}>Drag to reorder. Long press to hide or unhide.</Text>
            </View>
            <ScrollView
                ref={scroll}
                testID="mime-larp-badge-grid"
                scrollEnabled={target < 0}
                onTouchMove={drag}
                onTouchEnd={() => endDrag(true)}
                onTouchCancel={() => endDrag(false)}
                onScroll={trackScroll}
                scrollEventThrottle={16}
                removeClippedSubviews={false}
                accessibilityElementsHidden={!!menu || !!chooseStage}
                importantForAccessibility={menu || chooseStage ? "no-hide-descendants" : "auto"}
                contentContainerStyle={styles.grid}
            >
            <View style={{ height: gridHeight }}>
                {entries.map((badge, index) => {
                    const key = badgeKey(badge.id);
                    let position = positions.get(key);
                    if (!position) {
                        position = new Animated.ValueXY(slot(index));
                        positions.set(key, position);
                    }
                    const lifted = target >= 0 && start.current?.key === key;
                    const family = familyName(badge);
                    const hidden = !shown.has(key);
                    const items: MenuItem[] = [
                        {
                            label: hidden ? "Unhide Badge" : "Hide Badge",
                            trailingIndicator: hidden ? Eye : EyeSlash,
                            action: () => onChange(
                                hidden ? [...selected, badge] : selected.filter(entry => badgeKey(entry.id) !== key),
                                !hidden && family ? { ...stages, [key]: badge.id } : stages,
                            ),
                        },
                        ...(family ? [{ label: key === "5" ? "Select House" : "Select Stage", action: () => setChooseStage(badge) }] : []),
                        ...(!hidden && index > 0 ? [{ label: "Move Earlier", action: () => reorder(index, index - 1) }] : []),
                        ...(!hidden && index < selected.length - 1 ? [{ label: "Move Later", action: () => reorder(index, index + 1) }] : []),
                    ];
                    const renderTile = (anchor?: MenuAnchor) => <Pressable
                        ref={anchor?.ref}
                        accessibilityRole="button"
                        accessibilityLabel={`${badge.name}, ${hidden ? "hidden" : "visible"}`}
                        accessibilityHint="Open badge options"
                        accessibilityActions={anchor?.accessibilityActions}
                        onAccessibilityAction={anchor?.onAccessibilityAction}
                        onLongPress={({ nativeEvent }) => {
                            if (dragged.current) return;
                            if (anchor) anchor.onLongPress?.();
                            else setMenu({ items, x: nativeEvent.pageX, y: nativeEvent.pageY });
                        }}
                        onPressIn={({ nativeEvent: event }) => {
                            dragged.current = false;
                            if (!hidden) start.current = {
                                x: event.pageX, y: event.pageY, scroll: scrollY.current, index, key, to: -1, lastY: event.pageY,
                            };
                        }}
                        pressRetentionOffset={size}
                        style={({ pressed }) => [styles.tile, { width: size, height: size, backgroundColor: c.card,
                            transform: [{ scale: lifted ? 1.06 : pressed ? 0.98 : 1 }],
                        }]}
                    >
                        <BadgeArtwork badge={badge} size={48} muted={hidden} />
                        <Text numberOfLines={1} style={[styles.label, { color: hidden ? c.hint : c.text }]}>{family ?? badge.name}</Text>
                        {hidden ? <View style={styles.indicator}>
                            {EyeSlash ? <EyeSlash size="sm" color={c.hint} /> : <Text style={{ color: c.hint }}>⊘</Text>}
                        </View> : null}
                    </Pressable>;
                    const align = items.length > 1 ? (index < columns * 2 ? "below" : "auto") :
                        index % columns === 0 ? "right" : index % columns === 2 ? "left" : "above";
                    return <Animated.View key={key} style={[styles.slot, { zIndex: lifted ? 10 : 0, transform: position.getTranslateTransform() }]}>
                        {nativeMenu ? <ContextMenu items={items} align={align}
                            disableGesture triggerOnLongPress>{renderTile}</ContextMenu> : renderTile()}
                    </Animated.View>;
                })}
            </View>
            </ScrollView>
            {chooseStage ? <View style={[styles.stages, { backgroundColor: c.page }]} accessibilityViewIsModal>
                <View style={styles.stageHeader}>
                    <Pressable accessibilityRole="button" onPress={() => setChooseStage(null)} style={styles.stageBack}>
                        <Text style={{ color: c.accent }}>Back</Text>
                    </Pressable>
                    <Text accessibilityRole="header" style={[styles.heading, { color: c.text }]}>
                        {familyName(chooseStage)}{stageFamily === "5" ? "" : " Stage"}
                    </Text>
                </View>
                <ScrollView contentContainerStyle={styles.stageList}>
                    {catalog.filter(badge => badgeKey(badge.id) === stageFamily).map(badge =>
                        <Pressable key={badge.id} accessibilityRole="radio" accessibilityState={{ checked: badge.id === chooseStage.id }}
                            onPress={() => selectStage(badge)} style={[styles.stageRow, { backgroundColor: c.card }]}>
                            <BadgeArtwork badge={badge} size={32} />
                            <Text style={[styles.stageLabel, { color: c.text }]}>
                                {badge.id === "1" ? "Standard Nitro" : stageFamily === "5" ?
                                    badge.name.replace(/^HypeSquad /, "") : badge.name.split(" · ").at(-1)}
                            </Text>
                            {badge.id === chooseStage.id ? <Text style={{ color: c.accent }}>✓</Text> : null}
                        </Pressable>)}
                </ScrollView>
            </View> : null}
        </View>
        {nativeMenu ? <ContextMenuContainer /> : null}
        {menu ? <View style={styles.menuOverlay} accessibilityViewIsModal>
            <Pressable style={StyleSheet.absoluteFill} onPress={() => setMenu(null)} accessible={false} />
            <View style={[styles.menu, { backgroundColor: c.card,
                left: Math.max(12, Math.min(menu.x - 92, width - 196)),
                top: Math.max(12, Math.min(menu.y + 12, height - 100 - menu.items.length * 44)),
            }]}>
                {menu.items.map(({ label, action }) => <Pressable key={label} accessibilityRole="button" onPress={() => { setMenu(null); action(); }} style={styles.menuAction}>
                    <Text style={{ color: c.text, fontSize: 16 }}>{label}</Text>
                </Pressable>)}
            </View>
        </View> : null}
    </View>;
}

const styles = StyleSheet.create({
    overlay: { ...StyleSheet.absoluteFill, backgroundColor: "#0009", justifyContent: "flex-end", alignItems: "center" },
    sheet: { height: "93%", width: "100%", maxWidth: 540, borderTopLeftRadius: 24, borderTopRightRadius: 24 },
    header: { paddingHorizontal: 16, alignItems: "center", gap: 4, paddingBottom: 22 },
    handle: { marginTop: 8, width: 32, height: 4, borderRadius: 2, opacity: 0.5 },
    heading: { fontSize: 16, fontWeight: "600", marginTop: 10, textAlign: "center" },
    subtitle: { fontSize: 12, lineHeight: 16, textAlign: "center" },
    grid: { paddingHorizontal: insets, paddingBottom: 32 },
    slot: { position: "absolute", left: 0, top: 0 },
    tile: { borderRadius: 16, alignItems: "center", justifyContent: "center", gap: 4 },
    label: { maxWidth: "100%", paddingHorizontal: 5, fontSize: 12, fontWeight: "500" },
    indicator: { position: "absolute", top: 6, right: 6 },
    menuOverlay: { ...StyleSheet.absoluteFill, backgroundColor: "#0006" },
    menu: { position: "absolute", width: 184, borderRadius: 12 },
    menuAction: { minHeight: 44, justifyContent: "center", paddingHorizontal: 12 },
    stages: { ...StyleSheet.absoluteFill, borderTopLeftRadius: 24, borderTopRightRadius: 24 },
    stageHeader: { alignItems: "center", justifyContent: "center", minHeight: 60 },
    stageBack: { position: "absolute", left: 16, minHeight: 44, justifyContent: "center" },
    stageList: { gap: 8, paddingHorizontal: 16, paddingBottom: 32 },
    stageRow: { flexDirection: "row", alignItems: "center", minHeight: 54, padding: 12, gap: 12, borderRadius: 12 },
    stageLabel: { flex: 1, fontSize: 15 },
});
