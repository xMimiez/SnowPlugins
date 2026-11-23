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
    const cleanups = [], patches = [], hooks = new Map(), events = new Map(), rows = new Map(), sections = new Map(), control = new AbortController();
    const own = fn => { cleanups.push(fn); return fn; };
    const patch = kind => (key, parent, callback) => {
        // Snow refuses accessor properties, which is what a bundled `import * as` namespace exposes.
        const descriptor = Object.getOwnPropertyDescriptor(parent, key);
        if (descriptor && !descriptor.configurable && (descriptor.get || !descriptor.writable)) throw new TypeError(`Cannot patch "${key}": it is fixed`);
        const original = parent[key];
        parent[key] = function (...args) {
            // Like Snow: an array returned from a before patch replaces the arguments.
            if (kind === 'before') { const replaced = callback(args); return original.apply(this, Array.isArray(replaced) ? replaced : args); }
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
        '@snow/api/flux': { subscribe: (type, callback) => { events.set(type, callback); return () => events.delete(type); } },
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
    return { manifest, bytes, factory, host, hooks, events, patches, rows, sections, state: () => state,
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

// Discord's message record: `set` returns a changed copy.
const record = fields => ({ ...fields, set(key, value) { return record({ ...this, [key]: value }); } });
const rowOptions = { shouldObscureSpoiler: false, inlineEmbedMedia: true };

test('Channel Spoilers covers the newest 50 messages once and never changes the stored message', async () => {
    const channel = '123456789012345678', other = '223456789012345678';
    const built = [];
    const builder = { name: 'createMessageContent', default(input) { built.push(input); } };
    const chat = { name: 'ChatManager', prototype: { determineChangeType(input) { return input.forceRender; } } };
    const stored = Array.from({ length: 60 }, (_, i) => record({ id: String(1000 + i), channel_id: channel, content: '', embeds: [], attachments: [{ id: 'a' + i, filename: 'a.png', content_type: 'image/png', flags: 0 }] }));
    let list = { toArray: () => stored };
    const messages = { storeName: 'MessageStore', getMessages: id => id === channel ? list : undefined };
    const draw = message => { builder.default({ message, options: rowOptions }); return built.pop(); };
    const covered = message => draw(message).message.attachments.some(a => a.spoiler === true);
    const plugin = load('mime.channelspoilers', { modules: [builder, chat, messages], saved: { channels: [channel] } });
    const definition = plugin.create();
    await definition.start();

    assert.deepEqual(stored.filter(covered).map(m => m.id), stored.slice(-50).map(m => m.id));
    assert.equal(covered(stored[59]), true, 'still covered when the row is drawn again in the same visit');
    assert.equal(stored[59].attachments[0].spoiler, undefined, 'the stored message is untouched');
    assert.equal(plugin.state().seen[channel], '1059');
    const elsewhere = record({ id: '2000', channel_id: other, attachments: [{ filename: 'a.png' }] });
    assert.equal(draw(elsewhere).message, elsewhere);

    plugin.events.get('CHANNEL_SELECT')({});
    assert.equal(stored.some(covered), false, 'reopening the chat covers nothing again');
    stored.push(record({ id: '1060', channel_id: channel, content: 'look https://tenor.com/view/cat',
        attachments: [{ id: 'p', filename: 'a.png', flags: 0 }, { id: 't', filename: 'd.txt' }],
        embeds: [{ type: 'gifv', url: 'https://tenor.com/view/cat', video: { url: 'https://media.tenor.com/cat.mp4', width: 120, height: 80 } }, { type: 'rich', title: 'kept' }] }));
    list = { toArray: () => stored };
    const before = JSON.stringify(stored[60]);
    const first = draw(stored[60]);
    assert.equal(first.options.shouldObscureSpoiler, true);
    assert.equal(first.message.content, 'look ||https://tenor.com/view/cat||');
    assert.deepEqual(first.message.attachments.map(a => [a.filename, a.spoiler, a.flags]), [['a.png', true, 8], ['d.txt', undefined, undefined], ['SPOILER_gif.mp4', true, 8]]);
    // The bundle runs in its own realm, so its arrays are copied before comparing.
    assert.deepEqual(Array.from(first.message.embeds, e => e.type), ['rich']);
    assert.equal(JSON.stringify(draw(stored[60]).message), JSON.stringify(first.message), 'drawing the row again gives the same row, not a second layer');
    assert.equal(JSON.stringify(stored[60]), before);
    assert.equal(covered(stored[59]), false);
    assert.equal(chat.prototype.determineChangeType({ message: { id: '1060' } }), true, 'a row drawn before the plugin started is redrawn once');
    assert.equal(chat.prototype.determineChangeType({ message: { id: '1060' } }), undefined);

    await plugin.stop(definition);
    assert.equal(draw(stored[60]).message, stored[60]);
    // The saved mark keeps old messages uncovered after a restart.
    const again = load('mime.channelspoilers', { modules: [builder, chat, messages], saved: plugin.state() });
    const restarted = again.create();
    await restarted.start();
    assert.equal(stored.some(covered), false);
    await again.stop(restarted);
});

test('BlurNSFW covers media in age-restricted channels and their threads', async () => {
    const built = [];
    const builder = { name: 'createMessageContent', default(input) { built.push(input); } };
    const channels = { storeName: 'ChannelStore', getChannel: id => ({ nsfw: { isNSFW: () => true }, thread: { isNSFW: () => false, parent_id: 'nsfw' }, safe: { isNSFW: () => false } })[id] };
    const draw = message => { builder.default({ message, options: rowOptions }); return built.pop(); };
    const image = channel => record({ id: '1', channel_id: channel, content: '', embeds: [], attachments: [{ filename: 'a.png', content_type: 'image/png', flags: 0 }, { filename: 'notes.txt' }] });
    const plugin = load('mime.blurnsfw', { modules: [builder, channels] });
    const definition = plugin.create();
    await definition.start();
    for (const channel of ['nsfw', 'thread']) {
        const input = draw(image(channel));
        assert.deepEqual(input.message.attachments.map(a => a.spoiler), [true, undefined], channel);
        assert.equal(input.options.shouldObscureSpoiler, true);
        assert.equal(input.options.inlineEmbedMedia, false);
    }
    const safe = image('safe');
    assert.equal(draw(safe).message, safe);
    assert.equal(draw(record({ id: '2', channel_id: 'nsfw', attachments: [], embeds: [{ type: 'image' }] })).options.inlineEmbedMedia, false);
    plugin.state().blurAllChannels = true;
    assert.equal(draw(safe).message.attachments[0].flags, 8);
    await plugin.stop(definition);
    assert.equal(draw(image('nsfw')).message.attachments[0].spoiler, undefined);
    const missing = load('mime.blurnsfw', { modules: [channels] });
    await assert.rejects(async () => missing.create().start(), /content builder/);
});
