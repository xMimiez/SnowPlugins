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
            if (kind === 'before') { const replaced = callback.call(this, args); return original.apply(this, Array.isArray(replaced) ? replaced : args); }
            if (kind === 'instead') return callback.call(this, args, (...next) => original.apply(this, next));
            const result = original.apply(this, args);
            return callback.call(this, args, result) ?? result;
        };
        patches.push(key);
        return own(() => { parent[key] = original; });
    };
    let state = { ...saved };
    const RN = { View: 'View', Text: 'Text', Image: 'Image', ScrollView: 'ScrollView', TextInput: 'TextInput', Pressable: 'Pressable', Switch: 'Switch', Platform: { OS: 'ios' }, NativeModules: {}, Dimensions: { get: () => ({ height: 800 }) } };
    class AnimatedValue {
        constructor(value) { this.value = value; }
        setValue(value) { this.value = value; }
        interpolate() { return this; }
        getTranslateTransform() { return [{ translateX: this.value.x }, { translateY: this.value.y }]; }
    }
    Object.assign(RN, {
        Keyboard: { dismiss() {} }, Modal: 'Modal', KeyboardAvoidingView: 'KeyboardAvoidingView', SafeAreaView: 'SafeAreaView',
        Animated: { View: 'AnimatedView', Value: AnimatedValue, ValueXY: AnimatedValue, timing: (value, options) => ({
            start: () => value.setValue(options.toValue), stop() {},
        }) }, useWindowDimensions: () => ({ width: 390, height: 800 }),
        StyleSheet: { create: styles => styles, absoluteFill: {}, hairlineWidth: 1 }, useColorScheme: () => 'dark',
    });
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
            findByFilePath: filePath => modules.find(m => m.filePath === filePath),
            waitForFilePath() {},
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

test('Larp saves its own render overrides and leaves native records and other accounts alone', async () => {
    const self = Object.freeze({ id: '123456789012345678', username: 'real-name', getAvatarURL: () => 'real-avatar' });
    const other = { id: '123456789012345679', username: 'friend' };
    let current = self;
    const users = { storeName: 'UserStore', getCurrentUser: () => current };
    const names = { filePath: 'utils/UserUtils.tsx', getName: user => user.username, getUserTag: user => user.username };
    const avatars = {
        filePath: 'utils/AvatarUtils.tsx',
        getUserAvatarURL: user => user.id + '/avatar',
        getUserAvatarSource: user => ({ uri: user.id + '/avatar' }),
        default: { getUserAvatarURL: user => user.id + '/avatar' },
    };
    const sku = '123456789012345680';
    const effectSku = '123456789012345681';
    const frameSku = '123456789012345682';
    const nameplateSku = '123456789012345683';
    const layer = { order: 'front', assetUrl: 'https://cdn.discordapp.com/test.png' };
    const products = {
        [sku]: { type: 0, skuId: sku, asset: 'a_test' },
        [effectSku]: { type: 1, skuId: effectSku, effects: [] },
        [frameSku]: { type: 3, skuId: frameSku, layers: [layer] },
        [nameplateSku]: { type: 2, skuId: nameplateSku, asset: 'test/', label: 'Nameplate', palette: 'blue' },
    };
    const lookup = [];
    const actions = {
        async fetchCollectiblesProduct(id) { lookup.push(id); return { items: products[id] ? [products[id]] : [] }; },
        maybeFetchCollectiblesProduct() {},
    };
    const actualDisplay = Object.freeze({ profileEffect: null, profileFrame: null });
    const displayHook = {
        filePath: 'modules/user_profile/hooks/useDisplayProfile.tsx',
        default: () => actualDisplay,
        useDisplayProfileWithFetchEffect: () => actualDisplay,
        getDisplayProfile: () => actualDisplay,
    };
    const nameplateHook = {
        filePath: 'modules/collectibles/nameplates/hooks/useNameplate.tsx',
        useNameplate: ({ user }) => user.collectibles?.nameplate,
    };
    const decorations = {
        filePath: 'modules/collectibles/avatar_decorations/useAvatarDecoration.tsx',
        getAvatarDecoration: () => null,
    };
    const messageContent = {
        filePath: 'modules/messages/native/renderer/createMessageContent.tsx',
        default: ({ message }) => message.author,
    };
    function ProfileBadgeRows() {}
    function UserProfileBanner() {}
    function HeaderAvatar() {}
    class DisplayProfile {
        constructor(userId) { this.userId = userId; }
        getBannerURL() { return 'real-banner'; }
    }
    const info = { filePath: 'modules/user_profile/native/UserProfilePrimaryInfo.tsx', ProfileBadgeRows };
    const banner = { filePath: 'modules/user_profile/native/UserProfileBanner.tsx', default: UserProfileBanner };
    const avatar = { filePath: 'modules/profile_customization/native/HeaderAvatar.tsx', default: HeaderAvatar };
    const nativeAvatar = { filePath: 'design/void/Avatar/native/Avatar.tsx', default: { type: props => props } };
    const youName = { filePath: 'modules/main_tabs_v2/native/you_bar/YouBarName.tsx', default: { type: props => props } };
    const displayProfile = { filePath: 'modules/user_profile/DisplayProfile.tsx', default: DisplayProfile };
    const badgeRead = [];
    const badgeDirectory = {
        storeName: 'BadgeDirectoryStore',
        getBadges: () => [
            { badge_id: 1, name: 'Nitro', simple_icon_url: 'https://discord.com/assets/f3521e2861ff44a0384d.svg' },
            { badge_id: 30, name: 'New Discord Badge', simple_icon_url: 'https://cdn.discordapp.com/badge-icons/test.png' },
            { badge_id: 32, name: 'The Void', tiers: [
                { key: 1, name: 'Tier One', simple_icon_url: 'https://cdn.discordapp.com/badge-icons/void1.png' },
                { key: 2, name: 'Tier Two', simple_icon_url: 'https://cdn.discordapp.com/badge-icons/void2.png' },
                { key: 3, name: 'Untrusted artwork', simple_icon_url: 'https://example.test/void3.png' },
            ] },
            { badge_id: 12, name: 'Server Booster', simple_icon_url: 'https://cdn.discordapp.com/badge-icons/boost.png' },
            { badge_id: -8000, name: 'Snow Developer', simple_icon_url: 'https://cdn.discordapp.com/badge-icons/snow.png' },
            { badge_id: 31, name: 'Untrusted artwork', simple_icon_url: 'https://example.test/badge.png' },
        ],
    };
    const badgeActions = {
        filePath: 'modules/badges/BadgeDirectoryActionCreators.tsx',
        async fetchBadgeDirectory(id) { badgeRead.push(id); },
        updateBadgeSettings() { assert.fail('Larp never updates Discord’s badge settings'); },
    };
    const modules = [users, names, avatars, actions, decorations, info, banner, avatar, nativeAvatar, youName, displayProfile, displayHook, nameplateHook, messageContent, badgeDirectory, badgeActions];
    const larp = load('mime.larp', { modules });
    // Run the editor callbacks synchronously between renders without needing a native UI.
    let slots = [], cursor = 0, effects = [];
    larp.host.react = { ...React, useEffect(effect) { effects.push(effect); }, useState(initial) {
        const state = slots;
        const index = cursor++;
        if (!(index in state)) state[index] = typeof initial === 'function' ? initial() : initial;
        return [state[index], value => { state[index] = typeof value === 'function' ? value(state[index]) : value; }];
    }, useRef(value) {
        const index = cursor++;
        return slots[index] ??= { current: value };
    } };
    const definition = larp.create();
    await definition.start();

    const native = (id, label) => React.createElement('Shortcut', { key: id, label, onPress() {} });
    function YouScreenNavIconMeasurer() {}
    const insert = children => larp.hooks.get('YouScreenNavIconMeasurer')(null, React.createElement(YouScreenNavIconMeasurer, { children }));
    const stock = [native('quests', 'Quests'), native('shop', 'Shop'), native('nitro', 'Nitro'), native('settings', 'Settings')];
    const solo = insert(stock);
    const larpId = 'mime-larp-profile-button';
    assert.deepEqual(Array.from(solo.props.children, child => child.key), ['quests', 'shop', 'nitro', 'settings', larpId]);
    const nighty = native('mime-nighty-profile-button', 'Nighty');
    const layout = bar => bar.type(bar.props).props.children;
    assert.equal(layout(solo), solo.props.children, 'Larp on its own uses the native row spacing');
    for (const both of [insert([...stock, nighty]), React.cloneElement(solo, {}, [...stock, nighty, solo.props.children.at(-1)])]) {
        const row = layout(both);
        assert.deepEqual(Array.from(row.slice(0, -1), child => child.key), stock.map(child => child.key));
        assert.equal(row.at(-1).key, nighty.key, 'Nighty recognizes the pair as an existing shortcut');
        assert.deepEqual(Array.from(row.at(-1).props.children, child => child.key), [nighty.key, larpId]);
        assert.equal(row.at(-1).props.style.gap, 2);
    }
    assert.equal(insert(solo.props.children), undefined);

    const componentSlots = [];
    const render = (element, state) => { slots = state; cursor = 0; effects = []; return element.type(element.props); };
    const find = (node, predicate) => {
        if (!React.isValidElement(node)) return;
        if (predicate(node)) return node;
        return React.Children.toArray(node.props.children).map(child => find(child, predicate)).find(Boolean);
    };
    const shortcut = solo.props.children.at(-1);
    render(shortcut, componentSlots).props.children[0].props.onPress();
    const editor = render(shortcut, componentSlots).props.children[1];
    const editorSlots = [];
    const draw = () => render(editor, editorSlots);
    const fields = {
        'Display Name': 'Local name', Username: 'local_username',
        'Avatar URL': 'https://example.test/avatar.png', 'Banner URL': 'https://example.test/banner.png',
        Pronouns: 'they/them', 'About Me': 'Local bio',
        'Avatar Decoration SKU ID': sku,
        'Profile Effect SKU ID': effectSku,
        'Profile Border SKU ID': frameSku,
        'Nameplate SKU ID': nameplateSku,
    };
    const input = label => find(draw(), node => node.type === 'TextInput' && node.props.accessibilityLabel === label);
    const buttonIn = (tree, label) => find(tree, node => node.type === 'Pressable' && node.props.children?.props?.children === label);
    const button = label => buttonIn(draw(), label);
    find(draw(), node => node.props.accessibilityLabel === 'Badges').props.onPress();
    const picker = () => find(draw(), node => typeof node.type === 'function' && node.props.catalog);
    assert.equal(picker().props.selected.length, 0);
    effects[0]();
    await new Promise(resolve => setImmediate(resolve));
    assert.deepEqual(badgeRead, [self.id]);
    const pickerSlots = [];
    const drawPicker = () => render(picker(), pickerSlots);
    const nitroIcons = picker().props.catalog.filter(badge => badge.id === '1' || badge.id.startsWith('1:'));
    const starterIcon = 'https://cdn.discordapp.com/assets/content/f61ddf640d11d9bdfaf9de265eb862edf28986b659e545f293b54adf229433af.svg';
    assert.equal(nitroIcons.length, 9);
    assert.equal(nitroIcons[0].url, starterIcon);
    assert(nitroIcons.slice(1).every(badge => /^https:\/\/cdn\.discordapp\.com\/badge-icons\/[a-f0-9]{32}\.png$/.test(badge.url)));
    const gridProps = () => find(drawPicker(), node => node.props.testID === 'mime-larp-badge-grid').props;
    const grid = () => gridProps().children.props.children;
    const position = slot => slot.props.style[1].transform;
    assert.deepEqual(Array.from(grid().slice(0, 4), slot => position(slot)[1].translateY), [0, 0, 0, 124]);
    assert.equal(grid().length, 24);
    assert(!grid().some(slot => /Snow Developer|Untrusted artwork/.test(slot.props.children.props.accessibilityLabel)));
    const slot = id => grid().find(node => node.key === id);
    const tile = id => slot(id).props.children;
    const touch = { nativeEvent: { pageX: 200, pageY: 50 } };
    const hold = id => {
        const { props } = tile(id);
        props.onPressIn(touch);
        props.onLongPress(touch);
    };
    const selectStage = (family, label, options) => {
        hold(family);
        buttonIn(drawPicker(), family === '5' ? 'Select House' : 'Select Stage').props.onPress();
        const stageList = find(drawPicker(), node => node.type === 'ScrollView' && !node.props.testID);
        assert.equal(stageList.props.children.length, options);
        find(stageList, node => node.props.accessibilityRole === 'radio' && node.props.children[1].props.children === label).props.onPress();
    };
    assert.equal(tile('22').props.accessibilityLabel, 'Discord Staff, hidden');
    hold('22');
    buttonIn(drawPicker(), 'Unhide Badge').props.onPress();
    assert.equal(tile('22').props.accessibilityLabel, 'Discord Staff, visible');
    hold('30');
    buttonIn(drawPicker(), 'Unhide Badge').props.onPress();
    const second = tile('30');
    second.props.onPressIn({ nativeEvent: { pageX: 200, pageY: 50 } });
    gridProps().onTouchMove({ nativeEvent: { pageX: 175, pageY: 52 } });
    assert.equal(position(slot('30'))[0].translateX, 99);
    gridProps().onTouchMove({ nativeEvent: { pageX: 85, pageY: 50 } });
    assert.equal(slot('30').props.style[1].zIndex, 10);
    assert.equal(position(slot('30'))[0].translateX, 9, 'the held badge follows the pointer');
    drawPicker();
    effects[0]();
    assert.equal(position(slot('22'))[0].translateX, 124, 'the neighbor shifts before release');
    gridProps().onTouchEnd();
    assert.deepEqual(Array.from(picker().props.selected, badge => badge.id), ['30', '22']);
    hold('22');
    buttonIn(drawPicker(), 'Hide Badge').props.onPress();
    assert.equal(tile('22').props.accessibilityLabel, 'Discord Staff, hidden');
    hold('22');
    buttonIn(drawPicker(), 'Unhide Badge').props.onPress();
    selectStage('1', 'Opal (72+ Months)', 9);
    selectStage('5', 'Balance', 3);
    selectStage('12', '2 Years', 9);
    selectStage('17', 'Legend', 6);
    selectStage('18', 'Primordial', 10);
    selectStage('19', 'Phenomenon', 10);
    selectStage('20', 'Eternal', 10);
    selectStage('21', 'Universalist', 10);
    selectStage('32', 'Tier Two', 2);
    assert.deepEqual(Array.from(picker().props.selected, badge => badge.id), ['30', '22']);
    assert.equal(tile('1').props.accessibilityLabel, 'Nitro · Opal (72+ Months), hidden');
    assert.equal(tile('17').props.accessibilityLabel, 'Gifting · Legend, hidden');
    assert.equal(tile('12').props.accessibilityLabel, 'Server Boost · 2 Years, hidden');
    assert.equal(tile('5').props.accessibilityLabel, 'HypeSquad Balance, hidden');
    assert.equal(tile('4').props.accessibilityLabel, 'HypeSquad Events, hidden');
    assert.equal(tile('32').props.accessibilityLabel, 'The Void · Tier Two, hidden');
    hold('1');
    buttonIn(drawPicker(), 'Unhide Badge').props.onPress();
    selectStage('1', 'Ruby (60 Months)', 9);
    assert.deepEqual(Array.from(picker().props.selected, badge => badge.id), ['30', '22', '1:7']);
    const rubyIcon = 'https://cdn.discordapp.com/badge-icons/cd5e2cfd9d7f27a8cdcd3e8a8d5dc9f4.png';
    assert.equal(picker().props.selected.at(-1).url, rubyIcon);
    find(drawPicker(), node => node.props.accessibilityLabel === 'Close badges').props.onPress();
    assert.equal(find(draw(), node => node.props.badge?.id === '1:7').props.badge.url, rubyIcon);
    draw().props.onRequestClose();
    assert(find(draw(), node => node.props.children === 'Discard unsaved changes?'), 'badge-only edits are dirty');
    button('Keep Editing').props.onPress();
    input('Avatar URL').props.onChangeText('http://example.test/avatar.png');
    await button('Save').props.onPress();
    assert(find(draw(), node => node.props.accessibilityRole === 'alert'));
    assert.deepEqual(Object.keys(larp.state().profiles), []);
    for (const [label, value] of Object.entries(fields)) {
        input(label).props.onChangeText(value);
    }
    input('Nameplate SKU ID').props.onChangeText('invalid');
    await button('Save').props.onPress();
    assert.equal(lookup.length, 0);
    input('Nameplate SKU ID').props.onChangeText(effectSku);
    await button('Save').props.onPress();
    assert.equal(find(draw(), node => node.props.accessibilityRole === 'alert').props.children, "This SKU ID didn't resolve to a nameplate.");
    assert.deepEqual(Object.keys(larp.state().profiles), []);
    input('Nameplate SKU ID').props.onChangeText(nameplateSku);
    draw().props.onRequestClose();
    assert(find(draw(), node => node.props.children === 'Discard unsaved changes?'));
    assert.deepEqual(Object.keys(larp.state().profiles), []);
    button('Keep Editing').props.onPress();
    await button('Save').props.onPress();
    assert.deepEqual(lookup, [sku, effectSku, frameSku, effectSku, nameplateSku], 'reads only collectible metadata and reuses successful lookups');
    assert.equal(render(shortcut, componentSlots).props.children[1], null);
    assert.equal(larp.state().profiles[self.id].draft.bio, 'Local bio');
    assert.deepEqual(Array.from(larp.state().profiles[self.id].draft.badges, badge => badge.id), ['30', '22', '1:7']);
    assert.equal(larp.state().profiles[self.id].draft.badgeStages['18'], '18:10');
    assert.equal(larp.state().profiles[self.id].draft.badgeStages['17'], '17:6');
    assert.equal(larp.state().profiles[self.id].draft.badgeStages['32'], '32:2');
    assert.equal(names.getName(self), 'Local name');
    assert.equal(names.getUserTag(self), 'local_username');
    assert.equal(avatars.getUserAvatarSource(self).uri, fields['Avatar URL']);
    assert.equal(avatars.default.getUserAvatarURL(self), fields['Avatar URL']);
    assert.equal(decorations.getAvatarDecoration(self).asset, 'a_test');
    assert.equal(displayHook.default(self.id).profileEffect.skuId, effectSku);
    assert.equal(displayHook.useDisplayProfileWithFetchEffect(self.id).profileFrame.layers[0], layer);
    assert.equal(displayHook.getDisplayProfile(other.id), actualDisplay);
    assert.equal(actualDisplay.profileEffect, null);
    assert.equal(nameplateHook.useNameplate({ user: self }).skuId, nameplateSku);
    assert.equal(nameplateHook.useNameplate({ user: other }), undefined);
    assert.equal(self.collectibles, undefined);
    function UserProfilePrimaryInfo() {}
    function UserProfileAboutMeCard() {}
    const display = (component, props, key = component.name) => {
        const element = React.createElement(component, props);
        return larp.hooks.get(key)(null, element);
    };
    const primary = render(display(UserProfilePrimaryInfo, { user: self }), []).props;
    assert.equal(primary.pronouns, 'they/them');
    assert.equal(primary.user.username, 'local_username');
    const bannerProps = render(display(UserProfileBanner, { user: self, displayProfile: {} }, UserProfileBanner), []).props;
    assert.equal(bannerProps.displayProfile.getBannerURL(), fields['Banner URL']);
    assert.equal(bannerProps.pendingBanner.imageUri, fields['Banner URL']);
    assert.equal(new DisplayProfile(self.id).getBannerURL(), fields['Banner URL']);
    assert.equal(new DisplayProfile(other.id).getBannerURL(), 'real-banner');
    const avatarProps = render(display(HeaderAvatar, { user: self }, HeaderAvatar), []).props;
    assert.equal(avatarProps.pendingAvatarSrc, fields['Avatar URL']);
    assert.equal(avatarProps.pendingAvatarDecoration.skuId, sku);
    assert.equal(display(HeaderAvatar, { user: other }, HeaderAvatar), undefined);
    const youAvatar = nativeAvatar.default.type({ user: self });
    assert.equal(youAvatar.source.uri, fields['Avatar URL']);
    assert.equal(youAvatar.avatarDecoration.skuId, sku);
    assert.equal(nativeAvatar.default.type({ user: other }).source, undefined);
    assert.equal(youName.default.type({ userId: self.id }).username, 'Local name');
    assert.equal(youName.default.type({ userId: other.id, username: 'friend' }).username, 'friend');
    assert.equal(render(display(UserProfileAboutMeCard, { userId: self.id }), []).props.pendingBio, 'Local bio');
    assert.deepEqual(Array.from(render(display(ProfileBadgeRows, { userId: self.id }, ProfileBadgeRows), []).props.children,
        node => node.props.badge.name), ['New Discord Badge', 'Discord Staff', 'Nitro · Ruby (60 Months)']);
    assert.equal(display(ProfileBadgeRows, { userId: other.id }, ProfileBadgeRows), undefined);
    assert.equal(display(UserProfilePrimaryInfo, { user: other }), undefined);
    assert.equal(self.username, 'real-name');
    assert.equal(names.getName(other), 'friend');
    assert.equal(decorations.getAvatarDecoration(other), null);
    const message = Object.freeze({ author: self });
    const renderedAuthor = messageContent.default({ message });
    assert.equal(renderedAuthor.username, 'local_username');
    assert.equal(renderedAuthor.globalName, 'Local name');
    assert.equal(renderedAuthor.getAvatarURL(), fields['Avatar URL']);
    assert.equal(message.author, self);
    assert.equal(messageContent.default({ message: { author: other } }), other);
    current = other;
    assert.equal(names.getName(self), 'real-name');
    assert.equal(displayHook.default(self.id), actualDisplay);
    assert.equal(nameplateHook.useNameplate({ user: self }), undefined);
    current = self;
    await larp.stop(definition);
    assert.equal(names.getName(self), 'real-name');
    const saved = JSON.parse(JSON.stringify(larp.state()));
    const savedRuby = saved.profiles[self.id].draft.badges.at(-1);
    savedRuby.url = 'https://discord.com/assets/ecf86e18838013c9d95a.svg';
    const restarted = load('mime.larp', { modules, saved });
    restarted.host.react = larp.host.react;
    const next = restarted.create();
    await next.start();
    const row = restarted.hooks.get(ProfileBadgeRows)(null, React.createElement(ProfileBadgeRows, { userId: self.id }));
    assert.equal(render(row, []).props.children.at(-1).props.badge.url, rubyIcon);
    Object.assign(savedRuby, { id: '1', name: 'Discord Nitro' });
    assert.equal(render(row, []).props.children.at(-1).props.badge.url, starterIcon);
    assert.equal(names.getName(self), 'Local name');
    assert.equal(displayHook.default(self.id).profileEffect.skuId, effectSku);
    assert.equal(nameplateHook.useNameplate({ user: self }).skuId, nameplateSku);
    await restarted.stop(next);
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
