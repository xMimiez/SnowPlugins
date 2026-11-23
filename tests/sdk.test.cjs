// Loads the built Snow SDK bundles (run `bun run build` first) with stand-in host modules.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const React = require('react');
const root = path.resolve(__dirname, '..');
const snapshot = JSON.parse(fs.readFileSync(path.join(root, 'types/snow/snapshot.json'), 'utf8'));

function load(id, { modules = [], saved = {} } = {}) {
    const dir = path.join(root, 'dist', id);
    assert(fs.existsSync(dir), `dist/${id} is missing; run bun run build`);
    const manifest = JSON.parse(fs.readFileSync(path.join(dir, 'manifest.json'), 'utf8'));
    const bytes = fs.readFileSync(path.join(dir, manifest.bundle.url));
    const cleanups = [], patches = [], hooks = new Map(), rows = new Map(), sections = new Map(), control = new AbortController();
    const own = fn => { cleanups.push(fn); return fn; };
    const patch = kind => (key, parent, callback) => {
        // Snow refuses accessor properties, which is what a bundled `import * as` namespace exposes.
        const descriptor = Object.getOwnPropertyDescriptor(parent, key);
        if (descriptor && !descriptor.configurable && (descriptor.get || !descriptor.writable)) throw new TypeError(`Cannot patch "${key}": it is fixed`);
        const original = parent[key];
        parent[key] = function (...args) {
            if (kind === 'before') { callback(args); return original.apply(this, args); }
            if (kind === 'instead') return callback(args, (...next) => original.apply(this, next));
            const result = original.apply(this, args);
            return callback(args, result) ?? result;
        };
        patches.push(key);
        return own(() => { parent[key] = original; });
    };
    let state = { ...saved };
    const RN = { View: 'View', Text: 'Text', Image: 'Image', ScrollView: 'ScrollView', TextInput: 'TextInput', Pressable: 'Pressable', Switch: 'Switch', Platform: { OS: 'ios' }, NativeModules: {}, Dimensions: { get: () => ({ height: 800 }) } };
    const host = {
        '@snow/plugin': { definePlugin: x => x, plugin: { id, name: manifest.name, version: manifest.version }, signal: control.signal, onDispose: own, logger: console, reportError() {} },
        react: React, 'react-native': RN, 'react/jsx-runtime': Object.freeze({ ...require('react/jsx-runtime') }),
        '@snow/api/patcher': { before: patch('before'), after: patch('after'), instead: patch('instead') },
        '@snow/api/commands': { registerCommand: () => () => {} },
        '@snow/api/flux': { subscribe: () => () => {} },
        '@snow/api/react/jsx': { onJsxCreate: (name, callback) => hooks.set(name, callback), deleteJsxCreate: name => hooks.delete(name) },
        '@snow/discord': {
            findByProps: (...props) => modules.find(m => props.every(p => p in m)), findByPropsAll: () => [],
            findByName: name => modules.find(m => m.name === name), findByDisplayName: name => modules.find(m => m.displayName === name),
            findByStoreName: name => modules.find(m => m.storeName === name),
        },
        '@snow/discord/common': {}, '@snow/discord/common/components': { ActionSheet: 'ActionSheet' }, '@snow/ui/components': {},
        '@snow/ui/sheets': { showSheet() {}, hideSheet() {} }, '@snow/ui/alerts': {}, '@snow/ui/toasts': { showToast() {} },
        '@snow/ui/settings': { registerSettingsRow: (key, row) => rows.set(key, row), registerSettingsSection: (key, section) => sections.set(key, section) },
        '@snow/core/storage': { createPluginStore(owner, defaults) {
            assert.equal(owner, id);
            state = { ...defaults, ...state };
            const useStore = () => state;
            useStore.getState = () => ({ ...state, updateSettings: async patch => { state = { ...state, ...patch }; } });
            return { useStore, settings: new Proxy({}, { get: (_, key) => state[key], set: (_, key, value) => { state[key] = value; return true; } }) };
        } },
    };
    const factory = vm.runInNewContext(bytes.toString(), { console, URL, AbortController, setTimeout, clearTimeout, setInterval, clearInterval, fetch: (...args) => globalThis.fetch(...args), Promise });
    return { manifest, bytes, factory, host, hooks, patches, rows, sections, state: () => state,
        create: () => factory.create(host),
        async stop(definition) { control.abort(); await definition.stop?.(); while (cleanups.length) cleanups.pop()(); } };
}

test('every SDK bundle matches its manifest and imports only modules Snow exposes', () => {
    const ids = fs.readdirSync(path.join(root, 'plugins')).filter(id => fs.existsSync(path.join(root, 'plugins', id, 'snow.plugin.json')));
    assert(ids.length >= 3);
    for (const id of ids) {
        const { manifest, bytes, factory, create } = load(id);
        assert.equal(manifest.id, id);
        assert.equal(manifest.schemaVersion, 3);
        assert.equal(manifest.bundle.bytes, bytes.length);
        assert.equal(manifest.bundle.sha256, crypto.createHash('sha256').update(bytes).digest('hex'));
        for (const name of Object.keys(factory.imports)) assert(snapshot.modules.includes(name), `${id} imports ${name}`);
        assert.equal(typeof create().start, 'function', id);
    }
});

test('GlobalBadges lists a fetched badge in the badge directory and removes its patches on stop', async () => {
    const directory = { storeName: 'BadgeDirectoryStore', getBadges: () => [{ badge_id: 1 }], getBadgeById: () => undefined };
    const useBadges = { name: 'useBadges', default: () => [] };
    const plugin = load('mime.globalbadges', { modules: [directory, useBadges] });
    const realFetch = globalThis.fetch;
    globalThis.fetch = async () => new Response(JSON.stringify({ 42: [{ badge: 'https://example.com/a.png', tooltip: 'Equicord Donor', mod: 'equicord' }] }));
    const definition = plugin.create();
    try {
        await definition.start();
        const [, added] = directory.getBadges('42');
        assert.deepEqual([added.name, added.description, added.rarity, added.owned], ['Equicord Donor', 'unlocked by Equicord Donor', 99, true]);
        assert.equal(directory.getBadgeById(added.badge_id, '42').name, 'Equicord Donor');
        assert.deepEqual(useBadges.default({ userId: '42' }).map(b => b.description), ['Equicord — Equicord Donor']);
        assert(plugin.hooks.has('BadgeRarityPill'));
        await plugin.stop(definition);
        assert.equal(directory.getBadges('42').length, 1);
    } finally { globalThis.fetch = realFetch; await plugin.stop(definition); }
});

test('Pin DMs saves categories per account through the settings store and hooks the DM list', async () => {
    const LegendList = () => null;
    const users = { storeName: 'UserStore', getCurrentUser: () => ({ id: '7' }) };
    const plugin = load('mime.pindms', { modules: [users, { AnimatedLegendList: LegendList }], saved: { userBasedCategoryList: { 7: [{ id: 'a', name: 'Work', color: 1, collapsed: false, channels: ['100'] }] } } });
    const definition = plugin.create();
    await definition.start();
    assert(plugin.hooks.has(LegendList));
    assert.equal(typeof definition.settings, 'function');
    // Saved data from before the start is kept, and the defaults fill in the rest.
    assert.equal(plugin.state().userBasedCategoryList[7][0].name, 'Work');
    assert.equal(plugin.state().nativeList, true);
    await plugin.stop(definition);
});

test('Nighty Tab registers its settings entry with Snow and hooks the profile bar', async () => {
    const plugin = load('mime.nightytab');
    const definition = plugin.create();
    await definition.start();
    assert.equal(plugin.rows.get('NIGHTY').kind, 'page');
    assert.equal(typeof plugin.rows.get('NIGHTY').page, 'function');
    assert.equal(plugin.rows.get('NIGHTY').title(), 'Nighty');
    assert.equal(plugin.sections.get('NIGHTY_SECTION').rows.join(), 'NIGHTY');
    assert(plugin.hooks.has('YouScreenNavIconMeasurer'));
    await plugin.stop(definition);
});
