// Pin DMs mobile port, based on Equicord PinDMs by Vendicated and Aria.
// SPDX-License-Identifier: GPL-3.0-or-later
import type { Runtime } from "../../../shared/runtime";

export interface Category { id: string; name: string; color: number; collapsed: boolean; channels: string[] }
export type PinData = ReturnType<typeof createPinData>;
export const DEFAULT_COLOR = 10070709;
export const SWATCHES = [1752220,3066993,3447003,10181046,15277667,15844367,15105570,15158332,9807270,6323595,1146986,2067276,2123412,7419530,11342935,12745742,11027200,10038562,9936031,5533306];
export function move<T>(items: T[], index: number, direction: number): T[] {
    const next = index + direction;
    if (![-1, 1].includes(direction) || index < 0 || next < 0 || next >= items.length) return items;
    const result = [...items];
    [result[index], result[next]] = [result[next], result[index]];
    return result;
}
export function categoryChannels(category: Category, order: number, recentIds: string[]) {
    if (order === 1) return [...category.channels];
    const positions = new Map(recentIds.map((id, index) => [id, index]));
    return [...category.channels].sort((a, b) => (positions.get(a) ?? Infinity) - (positions.get(b) ?? Infinity));
}
export interface Section extends Partial<Category> { id: string; name: string; collapsed: boolean; data: string[] }
export function sectionsFor(categories: Category[], settings: { pinOrder: number; dmSectionCollapsed?: boolean }, recentIds: string[], selectedId: string | null, exists: (id: string) => boolean = () => true): Section[] {
    const pinned = new Set(categories.flatMap(c => c.channels));
    return [
        ...categories.map(category => ({ ...category, data: categoryChannels(category, settings.pinOrder, recentIds)
            .filter(id => exists(id) && (!category.collapsed || id === selectedId)) })),
        { id: 'uncategorized', name: 'Direct Messages', collapsed: !!settings.dmSectionCollapsed,
            data: settings.dmSectionCollapsed ? [] : recentIds.filter(id => !pinned.has(id) && exists(id)) },
    ];
}
export function createPinData(r: Runtime) {
    const userId = (): string | undefined => r.byStore('UserStore')?.getCurrentUser?.()?.id;
    const categories = (): Category[] => r.store.userBasedCategoryList?.[userId() ?? ''] || [];
    function update(fn: (list: Category[]) => Category[]) {
        const id = userId();
        if (!id) throw new Error('Sign in to manage pinned DMs.');
        r.set('userBasedCategoryList', { ...r.store.userBasedCategoryList, [id]: fn(categories()) });
    }
    let serial = 0;
    return {
        userId, categories,
        save(categoryId: string | undefined, name: string, color: number, initialChannelId?: string) {
            if (!name.trim()) throw new Error('Enter a category name.');
            if (!Number.isInteger(color) || color < 0 || color > 0xffffff) throw new Error('Enter a valid color.');
            if (categoryId && !categories().some(c => c.id === categoryId)) throw new Error('Category no longer exists.');
            const id = categoryId || `pin-${Date.now().toString(36)}-${++serial}`;
            update(list => categoryId
                ? list.map(c => c.id === id ? { ...c, name: name.trim(), color } : c)
                : [...list.map(c => ({ ...c, channels: c.channels.filter(ch => ch !== initialChannelId) })),
                    { id, name: name.trim(), color, collapsed: false, channels: initialChannelId ? [initialChannelId] : [] }]);
            return id;
        },
        remove(id: string) { update(list => list.filter(c => c.id !== id)); },
        collapse(id: string) { update(list => list.map(c => c.id === id ? { ...c, collapsed: !c.collapsed } : c)); },
        pin(channelId: string, categoryId: string) {
            if (!categories().some(c => c.id === categoryId)) return;
            update(list => list.map(c => ({ ...c, channels: [...c.channels.filter(id => id !== channelId), ...(c.id === categoryId ? [channelId] : [])] })));
        },
        unpin(channelId: string) { update(list => list.map(c => ({ ...c, channels: c.channels.filter(id => id !== channelId) }))); },
        moveCategory(id: string, direction: number) { update(list => move(list, list.findIndex(c => c.id === id), direction)); },
        moveChannel(id: string, direction: number) {
            update(list => list.map(c => c.channels.includes(id) ? { ...c, channels: move(c.channels, c.channels.indexOf(id), direction) } : c));
        },
    };
}
