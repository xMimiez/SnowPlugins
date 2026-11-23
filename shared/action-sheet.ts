// Mobile menu surface identified from Rain viewraw (MPL-2.0).
// SPDX-License-Identifier: MPL-2.0
import type { Any, Runtime } from "./runtime";

export function mapTree(React: Any, node: Any, transform: (node: Any) => Any): Any {
    const replacement = transform(node);
    if (replacement !== undefined) return replacement;
    if (Array.isArray(node)) return node.map((child: Any) => mapTree(React, child, transform));
    if (!React.isValidElement(node) || node.props.children == null) return node;
    return React.cloneElement(node, {}, mapTree(React, node.props.children, transform));
}

// Borrows the icon of a row already in the sheet: looking the icon component up in Metro initialises thousands of modules.
function iconNamed(React: Any, tree: Any, name: string) {
    let found: Any;
    mapTree(React, tree, node => { if (!found && node?.props?.icon?.props?.IconComponent?.name === name) found = node.props.icon; });
    return found;
}

export function appendAction(r: Runtime, tree: Any, item: Any) {
    let inserted = false;
    const name = (node: Any) => node?.type?.displayName || node?.type?.name || node?.type?.type?.name;
    const result = mapTree(r.React, tree, node => {
        if (inserted || !Array.isArray(node)) return;
        const sample = node.find((n: Any) => name(n) === 'ButtonRow' || name(n) === 'ActionSheetRow');
        if (!sample || node.some((n: Any) => n?.key === item.key)) return;
        inserted = true;
        const icon = item.icon || (item.iconName && iconNamed(r.React, tree, item.iconName));
        const Row = name(sample) === 'ButtonRow' ? (r.D.Forms?.FormRow || r.C.Forms?.FormRow || sample.type) : sample.type;
        return [...node, r.h(Row, { key: item.key, label: item.label, onPress: item.onPress, ...(icon ? { icon, leading: icon } : {}) })];
    });
    return inserted ? result : tree;
}

export function patchLazySheet(r: Runtime, getItem: (key: string, props: Any) => Any) {
    const sheets = r.find('openLazy', 'hideActionSheet');
    if (!sheets) return false;
    // Wrap this opening's component promise, never patch a shared module with a stale message.
    return r.patch('before', sheets, 'openLazy', (args: Any[]) => {
        const [pending, key, props] = args;
        const item = getItem(key, props);
        if (!item || !pending?.then) return;
        args[0] = pending.then((module: Any) => {
            if (!r.active || typeof module?.default !== 'function' || module.default.prototype?.isReactComponent) return module;
            const Original = module.default;
            function WithAction(screenProps: Any) {
                const tree = Original(screenProps);
                const current = r.active ? getItem(key, screenProps?.message || screenProps?.channel ? screenProps : props) : null;
                if (!current) return tree;
                return appendAction(r, tree, { ...current, onPress: () => {
                    if (!r.active) return;
                    sheets.hideActionSheet();
                    Promise.resolve().then(() => current.onPress()).catch((error: unknown) => { if (r.active) r.error(current.label, error); });
                } });
            }
            return { ...module, default: WithAction };
        });
    });
}
