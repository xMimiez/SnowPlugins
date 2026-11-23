// Nighty Tab. SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
import * as jsxRuntimeModule from "react/jsx-runtime";
import { findByProps, findByPropsAll } from "@snow/discord";
import { registerSettingsRow, registerSettingsSection } from "@snow/ui/settings";
import { register, ui, type Any, type Runtime } from "../../../shared/runtime";
import { patchLazySheet } from "../../../shared/action-sheet";
import { nightyBlueAsset } from "./icon";

const httpCookies = Object.create(null);
const pageBridge = { ref: null as Any };
function pageUrl(value: Any) {
  try {
    const url = new URL(String(value).trim());
    return ["http:", "https:"].includes(url.protocol) && !url.username && !url.password ? url.href : null;
  } catch {
    return null;
  }
}
const IMPORT_RE = /(^|[^\w$])(?:import\s*(?:[^'"();\n]{0,240}?\bfrom\s*)?|import\s*\(\s*|export\s*[^'"();\n]{0,240}?\bfrom\s*)(['"])([^'"]+)\2/g;
const CSS_IMPORT_RE = /@import\s+(?:url\(\s*)?(['"])([^'"]+)\1/g;

function isHttpPage(value: Any) {
    try {
        const url = new URL(String(value));
        return url.protocol === 'http:' && !url.username && !url.password;
    } catch {
        return false;
    }
}

function resolveAgainst(base: Any, spec: Any) {
    const raw = String(spec || '').trim();
    if (!raw || /^(?:data|blob|javascript|mailto):/i.test(raw)) return '';
    try {
        return new URL(raw, base).href;
    } catch {
        return '';
    }
}

function sameOrigin(page: Any, asset: Any) {
    try {
        return new URL(page).origin === new URL(asset).origin;
    } catch {
        return false;
    }
}

function parseSetCookie(raw: Any): Any[] {
    if (!raw) return [];
    const parts = Array.isArray(raw) ? raw : String(raw).split(/,(?=\s*[^;,=\s]+=)/);
    return parts.map(line => {
        const pair = String(line).split(';', 1)[0].trim();
        const eq = pair.indexOf('=');
        if (eq <= 0) return null;
        return { name: pair.slice(0, eq).trim(), value: pair.slice(eq + 1).trim() };
    }).filter(Boolean);
}

function cookieHeader(cookies: Any) {
    return Object.entries(cookies || {}).filter(([, value]) => value != null && value !== '').map(([name, value]) => `${name}=${value}`).join('; ');
}

function attr(attrs: Any, name: Any) {
    const match = new RegExp(`\\b${name}\\s*=\\s*(['"])(.*?)\\1`, 'i').exec(attrs || '');
    return match ? match[2] : '';
}

function importedSpecifiers(code: Any) {
    const specs = [];
    IMPORT_RE.lastIndex = 0;
    let match;
    while ((match = IMPORT_RE.exec(String(code)))) specs.push(match[3]);
    return specs;
}

function rewriteSpecifiers(code: Any, fileUrl: Any) {
    return String(code).replace(IMPORT_RE, (full, _lead, quote, spec) => {
        if (!spec || (!spec.startsWith('.') && !spec.startsWith('/'))) return full;
        const abs = resolveAgainst(fileUrl, spec);
        if (!abs) return full;
        const quoted = quote + spec + quote;
        const at = full.lastIndexOf(quoted);
        return at < 0 ? full : full.slice(0, at) + quote + abs + quote;
    });
}

function addUrl(list: Any, page: Any, spec: Any, base: Any) {
    const abs = resolveAgainst(base || page, spec);
    if (!abs || !sameOrigin(page, abs) || abs === page || list.includes(abs)) return;
    list.push(abs);
}

function stylesheetUrls(html: Any, page: Any) {
    const urls = new Set();
    for (const match of String(html || '').matchAll(/<link\b([^>]*)\/?>/gi)) {
        const rel = attr(match[1], 'rel').toLowerCase();
        const href = attr(match[1], 'href');
        if (!rel.includes('stylesheet') || !href) continue;
        const abs = resolveAgainst(page, href);
        if (abs) urls.add(abs);
    }
    return urls;
}

function isStylesheet(url: Any, html: Any, page: Any) {
    return stylesheetUrls(html, page).has(url) || /\.css(?:$|\?)/i.test(url);
}

function discoverUrls(html: Any, page: Any, files: Any) {
    const urls: Any[] = [];
    const source = String(html || '');
    for (const match of source.matchAll(/<script\b([^>]*)>/gi)) {
        const src = attr(match[1], 'src');
        if (src) addUrl(urls, page, src, page);
    }
    for (const match of source.matchAll(/<link\b([^>]*)\/?>/gi)) {
        const rel = attr(match[1], 'rel').toLowerCase();
        const href = attr(match[1], 'href');
        if (!href) continue;
        if (rel.includes('stylesheet') || rel.includes('modulepreload')) addUrl(urls, page, href, page);
    }
    for (const [url, text] of files || []) {
        const specs = isStylesheet(url, html, page)
            ? [...String(text).matchAll(CSS_IMPORT_RE)].map(item => item[2])
            : importedSpecifiers(text);
        for (const spec of specs) addUrl(urls, page, spec, url);
    }
    return urls;
}

function escapeAttr(value: Any) {
    return String(value).replace(/&/g, '&amp;').replace(/"/g, '&quot;');
}

function escapeScript(code: Any) {
    return String(code).replace(/<\/script/gi, '<\\/script>');
}

function escapeStyle(code: Any) {
    return String(code).replace(/<\/style/gi, '<\\/style>');
}

function bridgeScript(page: Any) {
    const href = JSON.stringify(new URL(page).href);
    const origin = JSON.stringify(new URL(page).origin);
    return `(() => { try {
if (window.__mimeNightyHttp) return;
window.__mimeNightyHttp = true;
var PAGE = ${href};
var ORIGIN = ${origin};
var pending = Object.create(null);
var seq = 0;
window.__mimeNightyHttpResult = function (msg) {
  var item = pending[msg && msg.id];
  if (!item) return;
  delete pending[msg.id];
  if (msg.error) item.reject(new Error(msg.error));
  else item.resolve(msg);
};
function headersOf(input) {
  var out: Record<string, Any> = {};
  if (!input) return out;
  try {
    if (typeof input.forEach === 'function') input.forEach(function (value, key) { out[String(key)] = String(value); });
    else Object.keys(input).forEach(function (key) { out[key] = String(input[key]); });
  } catch (e: Any) {}
  return out;
}
function call(url, method, headers, body) {
  return new Promise(function (resolve, reject) {
    if (!window.ReactNativeWebView) { reject(new Error('Nighty bridge unavailable')); return; }
    var id = ++seq;
    pending[id] = { resolve: resolve, reject: reject };
    var payload = body;
    if (payload != null && typeof payload !== 'string') { try { payload = JSON.stringify(payload); } catch (e: Any) { payload = String(payload); } }
    window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'NIGHTY_HTTP', id: id, url: url, method: method || 'GET', headers: headers || {}, body: payload || '' }));
    setTimeout(function () { if (pending[id]) { delete pending[id]; reject(new Error('Timed out')); } }, 20000);
  });
}
function note(url, body) {
  if (String(url).indexOf('/api/login') === -1 || !window.ReactNativeWebView) return;
  try {
    var data = JSON.parse(body);
    if (data && typeof data.access_token === 'string') window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'NIGHTY_TOKEN', token: data.access_token }));
  } catch (e: Any) {}
}
function absUrl(raw) {
  try {
    var next = new URL(raw || '', PAGE);
    if (next.hostname === 'localhost' || next.hostname === '127.0.0.1') return new URL(next.pathname + next.search + next.hash, PAGE).href;
    return next.href;
  } catch (e: Any) { return String(raw || ''); }
}
function localHttp(url) {
  try { return new URL(absUrl(url)).origin === ORIGIN; } catch (e: Any) { return false; }
}
var origFetch = window.fetch;
window.fetch = function (input, init) {
  var raw = typeof input === 'string' ? input : (input && input.url) || '';
  var abs = absUrl(raw);
  if (!localHttp(abs)) return origFetch ? origFetch.apply(this, arguments) : Promise.reject(new Error('fetch unavailable'));
  var method = (init && init.method) || (input && input.method) || 'GET';
  var headers = headersOf((init && init.headers) || (input && input.headers));
  return call(abs, method, headers, init && init.body).then(function (msg) {
    note(abs, msg.body || '');
    return new Response(msg.body || '', { status: msg.status || 200, headers: msg.headers || { 'content-type': 'text/plain' } });
  });
};
var XHR = window.XMLHttpRequest;
if (XHR && XHR.prototype) {
  var open = XHR.prototype.open;
  var send = XHR.prototype.send;
  XHR.prototype.open = function (method, url) { this.__mimeHttp = { method: method, url: url }; return open.apply(this, arguments); };
  XHR.prototype.send = function (body) {
    var info = this.__mimeHttp || {};
    var abs = absUrl(info.url || '');
    if (!localHttp(abs)) return send.apply(this, arguments);
    var xhr = this;
    call(abs, info.method, {}, body).then(function (msg) {
      note(abs, msg.body || '');
      try { Object.defineProperty(xhr, 'readyState', { configurable: true, get: function () { return 4; } }); } catch (e: Any) {}
      try { Object.defineProperty(xhr, 'status', { configurable: true, get: function () { return msg.status || 200; } }); } catch (e: Any) {}
      try { Object.defineProperty(xhr, 'responseText', { configurable: true, get: function () { return msg.body || ''; } }); } catch (e: Any) {}
      try { Object.defineProperty(xhr, 'response', { configurable: true, get: function () { return msg.body || ''; } }); } catch (e: Any) {}
      if (typeof xhr.onreadystatechange === 'function') xhr.onreadystatechange();
      if (xhr.dispatchEvent) xhr.dispatchEvent(new Event('load'));
    }).catch(function () { if (typeof xhr.onerror === 'function') xhr.onerror(); });
  };
}
} catch (e: Any) {} })();`;
}

function buildCleartextDocument(html: Any, page: Any, files: Any) {
    const assets = files instanceof Map ? files : new Map(Object.entries(files || {}));
    let body = String(html || '').replace(/<base\b[^>]*>/gi, '');
    const classic: Any[] = [];
    const modules: Any[] = [];
    body = body.replace(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi, (full, attrs, code) => {
        const src = attr(attrs, 'src');
        const module = /type\s*=\s*(['"])module\1/i.test(attrs) || /\btype\s*=\s*module\b/i.test(attrs);
        if (src) {
            const abs = resolveAgainst(page, src);
            if (!abs || !sameOrigin(page, abs) || !assets.has(abs)) return full;
            if (module) modules.push(rewriteSpecifiers(assets.get(abs), abs));
            else classic.push(assets.get(abs));
            return '';
        }
        if (module) {
            modules.push(rewriteSpecifiers(code, page));
            return '';
        }
        return full;
    });
    const styles: Any[] = [];
    body = body.replace(/<link\b([^>]*)\/?>/gi, (full, attrs) => {
        const rel = attr(attrs, 'rel').toLowerCase();
        const href = attr(attrs, 'href');
        if (!href || (!rel.includes('stylesheet') && !rel.includes('modulepreload'))) return full;
        const abs = resolveAgainst(page, href);
        if (!abs || !assets.has(abs)) return full;
        if (rel.includes('stylesheet')) styles.push(assets.get(abs));
        return '';
    });
    const moduleTags = modules.map(code => `<script type="module">${escapeScript(code)}</script>`).join('');
    const classicTags = classic.map(code => `<script>${escapeScript(code)}</script>`).join('');
    const styleTags = styles.map(code => `<style>${escapeStyle(code)}</style>`).join('');
    const head = `<base href="${escapeAttr(page)}"><script>${escapeScript(bridgeScript(page))}</script>${styleTags}${classicTags}`;
    if (/<head[^>]*>/i.test(body)) body = body.replace(/<head[^>]*>/i, match => match + head);
    else body = head + body;
    if (moduleTags) {
        if (/<\/body>/i.test(body)) return body.replace(/<\/body>/i, moduleTags + '</body>');
        return body + moduleTags;
    }
    return body;
}

async function loadCleartextPage(pageHref: Any, fetchText: Any, options: Any = {}) {
    const maxAssets = options.maxAssets ?? 40;
    const maxChars = options.maxChars ?? 6000000;
    const page = new URL(String(pageHref)).href;
    if (!isHttpPage(page)) throw new Error('Only an http:// address uses this loader.');
    const files = new Map();
    const html = await fetchText(page);
    let chars = String(html || '').length;
    if (chars > maxChars) throw new Error('This HTTP page is too large to open on iOS.');
    for (;;) {
        const next = discoverUrls(html, page, files).find(url => !files.has(url));
        if (!next) break;
        if (files.size >= maxAssets) throw new Error('This HTTP page has too many files to open on iOS.');
        const text = await fetchText(next);
        chars += String(text || '').length;
        if (chars > maxChars) throw new Error('This HTTP page is too large to open on iOS.');
        files.set(next, String(text || ''));
    }
    return { html: buildCleartextDocument(html, page, files), files: files.size, chars };
}

function canDownload(settings: Any, message: Any) {
  return !!settings.scriptUtils && typeof settings.nightyPrefix === "string" && Array.from(settings.nightyPrefix).length === 1 && !!settings.nightyPrefix.trim() && !!message?.id && !!messageChannelId(message) && !!message.attachments?.length;
}
function messageChannelId(message: Any) {
  return message?.getChannelId?.() || message?.channel_id || message?.channelId;
}
function iconHint(node: Any) {
  const props = node?.props || {};
  const bits = [props.name, typeof props.icon === "string" ? props.icon : ""];
  const kids = Array.isArray(props.children) ? props.children : props.children ? [props.children] : [];
  for (const child of kids) {
    if (typeof child?.props?.name === "string") bits.push(child.props.name);
    const type = child?.type;
    if (typeof type === "function") bits.push(type.displayName || type.name || "");
  }
  return bits.filter(Boolean).join(" ");
}
var ACTION_KEYS = ["actions", "buttons", "items", "headerActions", "trailingActions", "toolbarItems"];
var SETTINGS_MESSAGE_KEYS = ["SETTINGS", "USER_SETTINGS", "SETTINGS_TITLE", "OPEN_SETTINGS", "USER_SETTINGS_BUTTON"];
var OTHER_MESSAGE_KEYS = ["QUESTS", "SHOP", "NITRO", "COLLECTIBLES", "COLLECTIBLES_SHOP", "QUEST_HOME"];
function textOf(value: Any, depth = 0): Any {
  if (value == null || depth > 2) return "";
  if (typeof value === "string" || typeof value === "number") return String(value);
  if (typeof value === "function") return value.displayName || value.name || "";
  if (typeof value === "object") return ["message", "defaultMessage", "id", "displayName", "name"].map((key) => textOf(value[key], depth + 1)).filter(Boolean).join(" ");
  return "";
}
function recordText(record: Any) {
  if (!record || typeof record !== "object") return "";
  return ["label", "accessibilityLabel", "accessibilityHint", "aria-label", "testID", "nativeID", "id", "key", "name", "route", "screen", "icon", "Icon", "IconComponent"].map((key) => textOf(record[key])).filter(Boolean).join(" ");
}
var settingsNeedles: Any[] = [];
var otherNeedles: Any[] = [];
function rememberMessages(messages: Any) {
  if (!messages || typeof messages !== "object") return;
  const take = (keys: Any, bucket: Any) => {
    for (const key of keys) {
      const value = messages[key];
      if (typeof value === "string" && value.length >= 2 && value.length <= 32 && !bucket.includes(value)) bucket.push(value);
    }
  };
  take(SETTINGS_MESSAGE_KEYS, settingsNeedles);
  take(OTHER_MESSAGE_KEYS, otherNeedles);
}
function isSettingsText(text: Any) {
  if (!text || /notification/i.test(text)) return false;
  if (/settings?|SettingsIcon|GearIcon|CogIcon|USER_SETTINGS|\b(gear|cog)\b/i.test(text)) return true;
  return settingsNeedles.some((word) => text.includes(word));
}
function isOtherText(text: Any) {
  if (!text) return false;
  if (/quest|shop|collectible|nitro|QuestIcon|ShopIcon|NitroIcon|CollectiblesIcon/i.test(text)) return true;
  return otherNeedles.some((word) => text.includes(word));
}
function pressProps(record: Any) {
  if (!record || typeof record !== "object" || record.subLabel || record.trailing) return false;
  if (typeof record.label === "string" && record.label.length > 40) return false;
  return typeof record.onPress === "function" || typeof record.onPressOut === "function";
}
function nodeText(node: Any) {
  const props = node?.props;
  if (!props) return "";
  return ["accessibilityLabel", "accessibilityHint", "aria-label", "testID", "nativeID", "label", "name", "route", "screen", "id"].map((key) => textOf(props[key])).concat(iconHint(node)).filter(Boolean).join(" ");
}
function isIconControl(node: Any) {
  return pressProps(node?.props);
}
function isSettingsControl(node: Any) {
  return isIconControl(node) && isSettingsText(nodeText(node));
}
function isQuestOrShopControl(node: Any) {
  return isIconControl(node) && isOtherText(nodeText(node));
}
function plainKind(item: Any) {
  if (!pressProps(item) || item.props) return "";
  const text = recordText(item);
  if (isSettingsText(text)) return "settings";
  if (isOtherText(text)) return "other";
  return "";
}
function controlKind(node: Any) {
  if (isSettingsControl(node)) return "settings";
  if (isQuestOrShopControl(node)) return "other";
  const inner = node?.props?.children;
  const list = Array.isArray(inner) ? inner.filter(Boolean) : inner ? [inner] : [];
  if (list.length !== 1) return "";
  if (isSettingsControl(list[0])) return "settings-wrap";
  if (isQuestOrShopControl(list[0])) return "other-wrap";
  return "";
}
function insertPlainAction(list: Any, makeButton: Any) {
  if (!Array.isArray(list) || list.length < 2 || list.length > 8) return list;
  if (list.some((item) => item?.key === "mime-nighty-profile-button" || item?.id === "mime-nighty-profile-button" || item?.props?.testID === "mime-nighty-profile-button")) return list;
  const kinds = list.map(plainKind);
  const index = kinds.indexOf("settings");
  if (index < 0 || !kinds.includes("other")) return list;
  const next = list.slice();
  next.splice(index + 1, 0, makeButton(list[index]));
  return next;
}
function insertNightySlot(React: Any, element: Any, makeButton: Any) {
  const children = element?.props?.children;
  const list = Array.isArray(children) ? children.filter(Boolean) : null;
  if (!list || list.length < 2 || list.length > 8) return element;
  if (list.some((node2) => node2?.key === "mime-nighty-profile-button" || node2?.props?.key === "mime-nighty-profile-button" || node2?.props?.testID === "mime-nighty-profile-button" || node2?.props?.id === "mime-nighty-profile-button")) return element;
  const kinds = list.map(controlKind);
  const index = kinds.findIndex((kind) => kind === "settings" || kind === "settings-wrap");
  if (index < 0 || !kinds.some((kind) => kind === "other" || kind === "other-wrap")) return element;
  const node = list[index];
  const sample = kinds[index] === "settings" ? node : Array.isArray(node.props.children) ? node.props.children.filter(Boolean)[0] : node.props.children;
  const added = makeButton(sample);
  if (!added) return element;
  const next = list.slice();
  next.splice(index + 1, 0, added);
  return React.cloneElement(element, {}, ...next);
}
function NightyTab(r: Runtime) {
  const { h, React, RN, store } = r;
  const { Page, Text, Button, Input, Toggle } = ui(r);
  const iconUrl = () => store.iconType === "custom" ? pageUrl(store.customIconUrl) : nightyBlueAsset;
  const iconTint = () => store.iconType === "white" || store.iconType === "grayscale" ? "#F2F3F5" : void 0;
  const selectedIconSize = 28;
  const colors = { background: "#111214", surface: "#1E1F22", surfacePressed: "#26272B", border: "#2B2D31", text: "#F2F3F5", muted: "#B5BAC1", accent: "#5865F2", danger: "#F23F43" };
  function Icon() {
    r.useRefresh();
    const uri = iconUrl();
    return uri ? h(
      RN.View,
      { style: { width: selectedIconSize, height: selectedIconSize, alignItems: "center", justifyContent: "center" } },
      h(RN.Image, { source: { uri }, resizeMode: "contain", style: { width: selectedIconSize, height: selectedIconSize, ...iconTint() ? { tintColor: iconTint() } : {} }, accessibilityIgnoresInvertColors: true })
    ) : null;
  }
  const sending = new Set();
  async function download(message: Any) {
    if (!r.active || !canDownload(store, message) || sending.has(message.id)) return;
    sending.add(message.id);
    try {
      const module = r.find("HTTP", "get", "post", "put", "patch", "del") || r.find("get", "post", "put", "del");
      const rest = module?.HTTP || module;
      if (typeof rest?.post !== "function") throw new Error("Discord message API unavailable");
      const channelId = messageChannelId(message);
      await rest.post({ url: `/channels/${channelId}/messages`, body: {
        content: `${store.nightyPrefix}dls`,
        message_reference: { message_id: message.id, channel_id: channelId, ...message.guild_id ? { guild_id: message.guild_id } : {} },
        allowed_mentions: { parse: [], replied_user: false }
      } });
    } finally {
      sending.delete(message.id);
    }
  }
  function pageHost() {
    const src = pageUrl(store.url);
    if (!src) return "";
    try {
      return new URL(src).host;
    } catch {
      return "";
    }
  }
  function cleanToken(value: Any) {
    if (typeof value !== "string") return "";
    const token = value.trim();
    if (token.length < 8 || token.length > 4096 || !/^[\w.~+/-]+=*$/.test(token)) return "";
    return token;
  }
  function sessionToken() {
    const host = pageHost();
    if (!host) return "";
    const active = cleanToken(store.sessionToken);
    if (store.sessionHost === host && active) return active;
    const legacy = cleanToken(store.sessions?.[host]);
    return legacy || "";
  }
  function sessionScript(token: Any) {
    const saved = JSON.stringify(cleanToken(token) || "");
    return `(() => { try { var saved = ${saved}; var persist = function (value) { if (typeof value !== 'string' || !value) return; var secure = location.protocol === 'https:' ? '; Secure' : ''; document.cookie = 'access_token=' + value + '; Path=/; Max-Age=2592000; SameSite=Lax' + secure; try { localStorage.setItem('access_token', value); } catch (e: Any) {} }; if (saved) persist(saved); if (window.__mimeNightySession) return true; window.__mimeNightySession = true; var lastSent = ''; var send = function (value) { if (typeof value !== 'string' || !value || value === lastSent || !window.ReactNativeWebView) return; lastSent = value; window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'NIGHTY_TOKEN', token: value })); }; var readCookie = function () { try { var parts = document.cookie.split(';'); for (var i = 0; i < parts.length; i++) { var part = parts[i].trim(); if (part.indexOf('access_token=') === 0) return decodeURIComponent(part.slice(13)); } } catch (e: Any) {} return ''; }; var publish = function () { var value = readCookie(); if (!value) { try { value = localStorage.getItem('access_token') || ''; } catch (e: Any) {} } if (value && value !== lastSent) { persist(value); send(value); } }; publish(); var orig = window.fetch; if (typeof orig === 'function') { window.fetch = function () { var args = arguments; return Promise.resolve(orig.apply(this, args)).then(function (res) { try { var first = args[0]; var url = typeof first === 'string' ? first : (first && first.url) || ''; if (String(url).indexOf('/api/login') !== -1 && res && res.clone) res.clone().json().then(function (data) { if (data && typeof data.access_token === 'string') { persist(data.access_token); send(data.access_token); } }).catch(function () {}); } catch (e: Any) {} return res; }); }; } document.addEventListener('visibilitychange', publish); window.addEventListener('pageshow', publish); window.addEventListener('focus', publish); window.setInterval(publish, 1000); } catch (e: Any) {} return true; })();`;
  }
  function pageScript(token: Any) {
    const saved = JSON.stringify(cleanToken(token) || "");
    return `${sessionScript(token)}(() => { try { var saved = ${saved}; var apply = function () { var meta = document.querySelector('meta[name="viewport"]'); if (!meta) { meta = document.createElement('meta'); meta.name = 'viewport'; document.head.appendChild(meta); } meta.content = 'width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover'; var style = document.getElementById('mime-nighty-mobile-fit'); if (!style) { style = document.createElement('style'); style.id = 'mime-nighty-mobile-fit'; style.textContent = 'html,body,#root,#app{width:100%!important;max-width:100vw!important;margin-left:0!important;margin-right:0!important;overflow-x:hidden!important}*,*:before,*:after{box-sizing:border-box}'; document.head.appendChild(style); } document.documentElement.style.touchAction = 'pan-y'; if (document.body) { document.body.style.touchAction = 'pan-y'; document.body.style.marginBottom = '0'; } }; var restore = function () { if (!saved) return; var key = 'mime-nighty-restored'; var login = document.querySelector('input[type="password"]'); try { if (!login) { if (document.readyState !== 'loading') sessionStorage.removeItem(key); return; } var marker = saved.slice(-24); if (sessionStorage.getItem(key) === marker) return; sessionStorage.setItem(key, marker); if(!window.__mimeNightyHttp)location.reload(); } catch (e: Any) {} }; apply(); restore(); document.addEventListener('DOMContentLoaded', function () { apply(); restore(); }, { once: true }); } catch (e: Any) {} return true; })();`;
  }
  function saveNightyToken(token: Any) {
    const host = pageHost();
    const clean = cleanToken(token);
    if (!host || !clean) return;
    const current = store.sessions && typeof store.sessions === "object" ? store.sessions : {};
    if (store.sessionHost === host && cleanToken(store.sessionToken) === clean && current[host] === clean) return;
    store.sessionHost = host;
    store.sessionToken = clean;
    store.sessions = { ...current, [host]: clean };
    r.changed();
    Promise.resolve(r.api.storage.flush()).catch((error) => r.error("Save Nighty login", error));
  }
  function rememberCookies(host: Any, response: Any) {
    const raw = response?.headers?.get?.("set-cookie") || response?.headers?.map?.["set-cookie"] || "";
    const rows = parseSetCookie(raw);
    if (!host || !rows.length) return;
    const jar = httpCookies[host] || (httpCookies[host] = {});
    for (const row of rows) jar[row.name] = row.value;
  }
  function cookieFor(host: Any) {
    const parts = [];
    const jar = cookieHeader(httpCookies[host]);
    if (jar) parts.push(jar);
    const saved = sessionToken();
    if (saved) parts.push("access_token=" + saved);
    return parts.join("; ");
  }
  function xhrText(url: Any, method: Any, headers: Any, body: Any) {
    return new Promise<Any>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open(method || "GET", url, true);
      xhr.timeout = 20000;
      xhr.responseType = "text";
      if (headers) {
        for (const key of Object.keys(headers)) {
          try { xhr.setRequestHeader(key, headers[key]); } catch { }
        }
      }
      xhr.onload = () => resolve({ status: xhr.status || 0, text: xhr.responseText || "", setCookie: xhr.getResponseHeader("set-cookie") || "" });
      xhr.onerror = () => reject(new Error("Network request failed"));
      xhr.ontimeout = () => reject(Object.assign(new Error("The HTTP address timed out."), { name: "AbortError" }));
      xhr.send(body == null ? null : body);
    });
  }
  async function readHttp(url: Any, options: Any = {}) {
    const method = options.method || "GET";
    const headers = options.headers && Object.keys(options.headers).length ? options.headers : void 0;
    const body = method === "GET" || method === "HEAD" ? void 0 : options.body;
    const finish = (status: Any, text: Any, setCookie: Any) => {
      if (setCookie) rememberCookies(new URL(url).host, { headers: { get: (name: Any) => name === "set-cookie" ? setCookie : "" } });
      return { response: { ok: status >= 200 && status < 300, status, headers: { forEach() {} } }, text };
    };
    const safeHeaders = (() => {
      if (!headers) return void 0;
      const next: Record<string, Any> = {};
      for (const key of Object.keys(headers)) {
        if (key.toLowerCase() === "cookie") continue;
        next[key] = headers[key];
      }
      return Object.keys(next).length ? next : void 0;
    })();
    try {
      const response = await fetch(url, { method, ...safeHeaders ? { headers: safeHeaders } : {}, ...body != null ? { body } : {} });
      rememberCookies(new URL(url).host, response);
      return { response, text: await response.text() };
    } catch (error: Any) {
      if (error?.name === "AbortError") throw error;
      try {
        const xhr = await xhrText(url, method, safeHeaders, body);
        return finish(xhr.status, xhr.text, xhr.setCookie);
      } catch (xhrError: Any) {
        if (xhrError?.name === "AbortError") throw xhrError;
        const message = String(xhrError?.message || error?.message || error || "");
        throw new Error(message || "Could not download the HTTP page.");
      }
    }
  }
  function downloadCleartext(src: Any) {
    return loadCleartextPage(src, async (url: Any) => {
      const { response, text } = await readHttp(url);
      if (!response.ok) throw new Error("Nighty returned HTTP " + response.status + ".");
      return text;
    });
  }
  function handleHttpMessage(data: Any) {
    const id = data?.id;
    const reply = (payload: Any) => {
      const js = "window.__mimeNightyHttpResult&&window.__mimeNightyHttpResult(" + JSON.stringify(payload) + ");true;";
      pageBridge.ref?.current?.injectJavaScript?.(js);
    };
    Promise.resolve().then(async () => {
      const page = pageUrl(store.url);
      let target = "";
      try {
        target = new URL(String(data?.url || ""), page || undefined).href;
      } catch {
      }
      if (!page || !target || !sameOrigin(page, target)) {
        reply({ id, error: "Blocked" });
        return;
      }
      const method = String(data?.method || "GET").toUpperCase();
      const headers = data?.headers && typeof data.headers === "object" ? { ...data.headers } : {};
      const cookie = cookieFor(new URL(page).host);
      if (cookie) headers.Cookie = headers.Cookie ? headers.Cookie + "; " + cookie : cookie;
      const { response, text } = await readHttp(target, {
        method,
        headers,
        body: method === "GET" || method === "HEAD" ? undefined : data?.body || undefined
      });
      if (target.includes("/api/login")) {
        try {
          const parsed = JSON.parse(text);
          if (typeof parsed?.access_token === "string") saveNightyToken(parsed.access_token);
        } catch {
        }
      }
      const headerDump: Record<string, Any> = {};
      response.headers?.forEach?.((value, key) => {
        if (String(key).toLowerCase() !== "set-cookie") headerDump[key] = value;
      });
      reply({ id, status: response.status, body: text, headers: headerDump });
    }).catch((error) => reply({ id, error: String(error?.message || error || "Request failed") }));
  }
  function onSessionMessage(event: Any) {
    if (!r.active) return;
    let data;
    try {
      data = JSON.parse(event?.nativeEvent?.data || "");
    } catch {
      return;
    }
    if (data?.type === "NIGHTY_HTTP") {
      handleHttpMessage(data);
      return;
    }
    if (data?.type !== "NIGHTY_TOKEN") return;
    saveNightyToken(data.token);
  }
  function readInset(edge: Any) {
    try {
      const mod = r.find("initialWindowMetrics") || r.find("useSafeAreaInsets") || {};
      const insets = mod.initialWindowMetrics?.insets || mod.insets;
      const value = insets?.[edge];
      if (typeof value === "number" && value > 0 && value < 80) return Math.round(value);
    } catch {
    }
    return 0;
  }
  function loginScript() {
    if (!store.autoLogin) return "";
    const username = String(store.loginUsername || "").trim();
    const password = String(store.loginPassword || "");
    if (!username || !password || username.length > 256 || password.length > 256) return "";
    const user = JSON.stringify(username);
    const pass = JSON.stringify(password);
    const stamp = JSON.stringify(`${username}\n${password}`);
    return `(() => { try { var stamp = ${stamp}; if (window.__mimeNightyLoginStamp === stamp) return true; window.__mimeNightyLoginStamp = stamp; if (window.__mimeNightyLoginTimer) clearInterval(window.__mimeNightyLoginTimer); var user = ${user}; var pass = ${pass}; var setValue = function (input, value) { var proto = input && input.tagName === "TEXTAREA" ? window.HTMLTextAreaElement : window.HTMLInputElement; var desc = proto && Object.getOwnPropertyDescriptor(proto.prototype, "value"); if (desc && desc.set) desc.set.call(input, value); else input.value = value; input.dispatchEvent(new Event("input", { bubbles: true })); input.dispatchEvent(new Event("change", { bubbles: true })); }; var tries = 0; window.__mimeNightyLoginTimer = setInterval(function () { tries++; try { var usernameInput = document.querySelector('input[name="Username"]'); var passwordInput = document.querySelector('input[name="Password"]'); if (!usernameInput || !passwordInput) { if (tries > 30) { clearInterval(window.__mimeNightyLoginTimer); window.__mimeNightyLoginStamp = ""; } return; } clearInterval(window.__mimeNightyLoginTimer); setValue(usernameInput, user); setValue(passwordInput, pass); var button = usernameInput.form && usernameInput.form.querySelector('button[type="submit"]') || document.querySelector('button[type="submit"]'); if (button) button.click(); else if (usernameInput.form && usernameInput.form.requestSubmit) usernameInput.form.requestSubmit(); else if (usernameInput.form) usernameInput.form.submit(); } catch (e: Any) { clearInterval(window.__mimeNightyLoginTimer); } }, 500); } catch (e: Any) {} return true; })();`;
  }
  function NightyPage() {
    r.useRefresh();
    const src = pageUrl(store.url);
    const cleartext = RN.Platform?.OS === "ios" && isHttpPage(src);
    const WebView = r.find("WebView")?.WebView || r.byName("WebView");
    const webViewRef = React.useRef(null);
    pageBridge.ref = webViewRef;
    const savedSession = sessionToken();
    const [error, setError] = React.useState("");
    const [html, setHtml] = React.useState("");
    const [pageToken, setPageToken] = React.useState(0);
    const frame = { flex: 1, width: "100%", backgroundColor: "#080D1B", overflow: "hidden" };
    React.useEffect(() => {
      if (!cleartext) {
        setHtml("");
        return;
      }
      let alive = true;
      setError("");
      setHtml("");
      downloadCleartext(src).then((result) => {
        if (alive && r.active) setHtml(result.html);
      }).catch((cause) => {
        if (alive && r.active) setError(cause?.message || "Could not load this HTTP address.");
      });
      return () => {
        alive = false;
      };
    }, [src, pageToken, cleartext]);
    const allow = (req: Any) => {
      const url = req?.url || "";
      if (!url || url === "about:blank" || url.startsWith("about:") || url.startsWith("data:") || url.startsWith("blob:")) return true;
      if (cleartext) {
        if (/^https?:\/\/(?:localhost|127\.0\.0\.1)(?::\d+)?(?:\/|$)/i.test(url)) return true;
        if (req?.isTopFrame && req?.navigationType === "reload") {
          setPageToken((value: Any) => value + 1);
          return false;
        }
        return false;
      }
      return url === src || !!pageUrl(url);
    };
    return h(
      RN.View,
      { style: frame },
      !src ? h(Text, null, "Set a valid HTTP or HTTPS URL in Nighty Tab settings.") : !WebView ? h(Text, null, "WebView is unavailable in this Snow build.") : cleartext && !html ? h(Text, null, error || "Opening the HTTP address…") : h(WebView, {
        key: `${src}:${cleartext ? "http" : "https"}:${pageToken}:${html.length}:${savedSession ? "signed-in" : "signed-out"}:${store.autoLogin && store.loginUsername && store.loginPassword ? "auto" : "manual"}`,
        ref: webViewRef,
        source: cleartext ? { html, baseUrl: "http://localhost/" } : { uri: src, ...savedSession ? { headers: { Cookie: `access_token=${savedSession}` } } : {} },
        style: { flex: 1, width: "100%", backgroundColor: "#080D1B", opacity: cleartext ? 0.99 : 1 },
        containerStyle: { flex: 1, backgroundColor: "#080D1B" },
        originWhitelist: ["*", "http://*", "https://*"],
        javaScriptEnabled: true,
        domStorageEnabled: true,
        cacheEnabled: true,
        sharedCookiesEnabled: true,
        thirdPartyCookiesEnabled: true,
        incognito: false,
        startInLoadingState: true,
        injectedJavaScriptBeforeContentLoaded: pageScript(savedSession),
        injectedJavaScript: pageScript(savedSession) + loginScript(),
        pullToRefreshEnabled: true,
        bounces: true,
        directionalLockEnabled: true,
        showsHorizontalScrollIndicator: false,
        showsVerticalScrollIndicator: false,
        setBuiltInZoomControls: false,
        displayZoomControls: false,
        scalesPageToFit: false,
        allowsBackForwardNavigationGestures: false,
        automaticallyAdjustContentInsets: false,
        contentInsetAdjustmentBehavior: "never",
        contentInset: { top: 0, right: 0, bottom: 0, left: 0 },
        overScrollMode: "never",
        onMessage: onSessionMessage,
        onShouldStartLoadWithRequest: allow,
        onError: (event: Any) => {
          const description = event.nativeEvent?.description || "";
          if (cleartext) return;
          setError(description || "Could not load Nighty.");
        },
        onHttpError: (event: Any) => setError(`Nighty returned HTTP ${event.nativeEvent?.statusCode}.`),
        onLoad: () => setError(""),
        onLoadEnd: () => webViewRef.current?.injectJavaScript?.(pageScript(sessionToken()) + loginScript())
      }),
      error && !(cleartext && !html) ? h(Text, null, error) : null
    );
  }
  function Settings({ close }: Any) {
    r.useRefresh();
    const selectedLogo = store.iconType === "grayscale" ? "white" : store.iconType;
    const sectionLabel = (label: Any) => h(RN.Text, { style: { color: colors.muted, fontSize: 13, lineHeight: 18, fontWeight: "600", marginLeft: 4, marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 } }, label);
    const card = (...children: Any[]) => h(RN.View, { style: { backgroundColor: colors.surface, borderRadius: 16, borderWidth: 1, borderColor: colors.border, overflow: "hidden" } }, ...children);
    const divider = () => h(RN.View, { style: { height: 1, backgroundColor: colors.border, marginLeft: 16 } });
    const field = ({ value, onChange, placeholder, maxLength, keyboardType, secure }: Any) => h(RN.TextInput, {
      value,
      onChangeText: onChange,
      placeholder,
      placeholderTextColor: "#6D6F78",
      autoCapitalize: "none",
      autoCorrect: false,
      maxLength,
      keyboardType,
      secureTextEntry: !!secure,
      selectionColor: colors.accent,
      style: { minHeight: 50, color: colors.text, fontSize: 16, lineHeight: 21, backgroundColor: "#151619", borderRadius: 12, borderWidth: 1, borderColor: colors.border, paddingHorizontal: 14, paddingVertical: 12 }
    });
    const switchRow = (setting: Any, title: Any, description: Any) => h(RN.View, { style: { minHeight: 72, flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingVertical: 12, gap: 12 } },
      h(RN.View, { style: { flex: 1 } },
        h(RN.Text, { style: { color: colors.text, fontSize: 16, lineHeight: 21, fontWeight: "600", marginBottom: 3 } }, title),
        h(RN.Text, { style: { color: colors.muted, fontSize: 14, lineHeight: 19 } }, description)
      ),
      h(RN.Switch, { value: !!store[setting], onValueChange: (value: Any) => r.set(setting, value), trackColor: { false: "#3F4147", true: colors.accent }, thumbColor: "#FFFFFF", ios_backgroundColor: "#3F4147" })
    );
    const logoChoice = (value: Any, label: Any, detail: Any) => {
      const selected = selectedLogo === value;
      const uri = value === "custom" ? pageUrl(store.customIconUrl) : nightyBlueAsset;
      return h(RN.Pressable || RN.TouchableOpacity, {
        key: value,
        accessibilityRole: "radio",
        accessibilityState: { selected },
        onPress: () => r.set("iconType", value),
        style: ({ pressed }: Any = {}) => ({ minHeight: 60, flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingVertical: 10, gap: 12, backgroundColor: pressed ? colors.surfacePressed : colors.surface })
      },
      h(RN.View, { style: { width: 42, height: 34, borderRadius: 10, backgroundColor: "#151619", alignItems: "center", justifyContent: "center" } }, uri ? h(RN.Image, { source: { uri }, resizeMode: "contain", style: { width: 30, height: 30, transform: [{ scale: 1.35 }], ...value === "white" ? { tintColor: colors.text } : {} } }) : h(RN.Text, { style: { color: colors.muted, fontSize: 17 } }, "+")),
      h(RN.View, { style: { flex: 1 } }, h(RN.Text, { style: { color: colors.text, fontSize: 16, lineHeight: 21, fontWeight: "600" } }, label), h(RN.Text, { style: { color: colors.muted, fontSize: 13, lineHeight: 17, marginTop: 2 } }, detail)),
      h(RN.View, { style: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: selected ? colors.accent : "#5B5D66", alignItems: "center", justifyContent: "center" } }, selected ? h(RN.View, { style: { width: 12, height: 12, borderRadius: 6, backgroundColor: colors.accent } }) : null)
      );
    };
    return h(
      RN.ScrollView,
      { style: { flex: 1, backgroundColor: colors.background }, contentContainerStyle: { paddingHorizontal: 16, paddingTop: 18, paddingBottom: 36 }, keyboardShouldPersistTaps: "handled", showsVerticalScrollIndicator: false },
      sectionLabel("Nighty website"),
      card(h(RN.View, { style: { padding: 14 } },
        field({ value: store.url, placeholder: "https://nighty.example", onChange: (value: Any) => r.set("url", value), keyboardType: "url" }),
        store.url && !pageUrl(store.url) ? h(RN.Text, { style: { color: colors.danger, fontSize: 13, lineHeight: 18, marginTop: 8 } }, "Use an HTTP or HTTPS address without a username or password.") : null,
        isHttpPage(store.url) ? h(RN.Text, { style: { color: colors.muted, fontSize: 13, lineHeight: 18, marginTop: 8 } }, "On iPhone, an http address is opened inside this page.") : null,
        h(RN.Pressable || RN.TouchableOpacity, { accessibilityRole: "button", onPress: () => { if (!openNighty()) openSheet(); }, style: ({ pressed }: Any = {}) => ({ height: 48, borderRadius: 12, backgroundColor: pressed ? "#4752C4" : colors.accent, alignItems: "center", justifyContent: "center", marginTop: 12 }) }, h(RN.Text, { style: { color: "#FFFFFF", fontSize: 16, lineHeight: 20, fontWeight: "700" } }, "Open Nighty")),
        h(RN.Text, { style: { color: colors.muted, fontSize: 13, lineHeight: 18, marginTop: 8 } }, sessionToken() ? "Login saved for this address." : "Sign in once to save your login.")
      )),
      h(RN.View, { style: { height: 22 } }),
      sectionLabel("Behavior"),
      card(switchRow("showNightyButton", "Profile shortcut", "Add Nighty beside Settings on your profile."), divider(), switchRow("scriptUtils", "Script utilities", "Add Download Script to attachment menus.")),
      h(RN.View, { style: { height: 22 } }),
      sectionLabel("Auto login"),
      card(
        switchRow("autoLogin", "Auto login", "Fill the Nighty Username and Password fields when the page opens. Saved only in this plugin on your device."),
        divider(),
        h(RN.View, { style: { padding: 14, gap: 10 } },
          field({ value: store.loginUsername, placeholder: "Username", onChange: (value: Any) => r.set("loginUsername", value), maxLength: 256 }),
          field({ value: store.loginPassword, placeholder: "Password", secure: true, onChange: (value: Any) => r.set("loginPassword", value), maxLength: 256 })
        )
      ),
      h(RN.View, { style: { height: 22 } }),
      sectionLabel("Command prefix"),
      card(h(RN.View, { style: { padding: 14 } }, field({ value: store.nightyPrefix, placeholder: ".", maxLength: 1, onChange: (value: Any) => r.set("nightyPrefix", value) }), h(RN.Text, { style: { color: colors.muted, fontSize: 13, lineHeight: 18, marginTop: 8 } }, "Nighty reads this character before script commands."))),
      h(RN.View, { style: { height: 22 } }),
      sectionLabel("Logo"),
      card(logoChoice("white", "White", "Matches Discord's profile icons."), divider(), logoChoice("blue", "Nighty blue", "Shows Nighty's blue logo."), divider(), logoChoice("custom", "Custom image", "Uses an icon from an HTTPS address.")),
      selectedLogo === "custom" ? h(RN.View, { style: { marginTop: 10 } }, field({ value: store.customIconUrl, placeholder: "https://example.com/icon.png", onChange: (value: Any) => r.set("customIconUrl", value), keyboardType: "url" })) : null,
      close ? h(RN.Pressable || RN.TouchableOpacity, { onPress: close, style: { height: 46, alignItems: "center", justifyContent: "center", marginTop: 18 } }, h(RN.Text, { style: { color: colors.muted, fontSize: 15, fontWeight: "600" } }, "Close")) : null
    );
  }
  function screenNavigator() {
    const found = r.byName("Navigator", true) || r.byName("Navigator") || r.find("Navigator");
    if (typeof found === "function") return found;
    if (typeof found?.Navigator === "function") return found.Navigator;
    if (typeof found?.default === "function") return found.default;
    return null;
  }
  function openNighty() {
    if (!r.active) return false;
    const navigation = r.common.navigation || r.find("push", "pushLazy", "pop");
    if (typeof navigation?.push !== "function") return false;
    const Navigator = screenNavigator();
    const close = () => navigation.pop?.();
    const headerLeft = discordClose(close) || (() => closeMark(close));
    function Screen() {
      if (Navigator) return h(Navigator, {
        initialRouteName: "Nighty",
        goBackOnBackPress: true,
        screens: {
          Nighty: {
            title: "Nighty",
            headerBackVisible: false,
            headerLeft,
            render: () => r.active ? h(NightyPage, { close }) : null
          }
        }
      });
      return h(RN.View, { style: { flex: 1, width: "100%" } }, renderClose(close), h(NightyPage, { close }));
    }
    Screen.displayName = "Nighty";
    try {
      navigation.push(Screen);
      return true;
    } catch (error: Any) {
      if (r.active) r.error("Open Nighty", error);
      return false;
    }
  }
  function openSheet() {
    try {
      r.open("nighty", NightyPage, {}, { scrollable: false });
    } catch (error: Any) {
      if (r.active) r.error("Open Nighty", error);
    }
  }
  function press() {
    return () => {
      if (r.active && store.showNightyButton && !openNighty()) openSheet();
    };
  }
  function toolbarIcon() {
    const uri = iconUrl();
    if (!uri) return null;
    return h(RN.Image, {
      source: { uri },
      resizeMode: "contain",
      fadeDuration: 0,
      accessibilityIgnoresInvertColors: true,
      style: { width: selectedIconSize, height: selectedIconSize, ...iconTint() ? { tintColor: iconTint() } : {} }
    });
  }
  // Discord's bar icons sit in a 24pt box. A taller box makes the Nighty control taller than its neighbours and drops its label.
  const profileBarIconBox = 24;
  function profileImage() {
    const uri = iconUrl();
    if (!uri) return null;
    return h(
      RN.View,
      { style: { width: profileBarIconBox, height: profileBarIconBox, alignItems: "center", justifyContent: "center", overflow: "visible" } },
      h(RN.Image, {
        source: { uri },
        resizeMode: "contain",
        fadeDuration: 0,
        accessibilityIgnoresInvertColors: true,
        style: { width: selectedIconSize, height: selectedIconSize, ...iconTint() ? { tintColor: iconTint() } : {} }
      })
    );
  }
  function ProfileBarIcon() {
    return profileImage();
  }
  function discordClose(onClose: Any) {
    const module = r.find("getRenderCloseButton") || r.find("getHeaderCloseButton");
    const render = module?.getRenderCloseButton || module?.getHeaderCloseButton;
    if (typeof render !== "function") return null;
    try {
      return render(onClose) || null;
    } catch (error: Any) {
      if (r.active) r.error("Nighty close button", error);
      return null;
    }
  }
  function closeMark(onClose: Any) {
    return h(RN.Pressable || RN.TouchableOpacity, {
      accessibilityLabel: "Close",
      accessibilityRole: "button",
      onPress: onClose,
      hitSlop: { top: 12, bottom: 12, left: 12, right: 12 },
      style: { width: 44, height: 44, alignItems: "center", justifyContent: "center" }
    }, h(RN.Text, { style: { color: "#FFFFFF", fontSize: 22, lineHeight: 24 } }, "\u2715"));
  }
  function renderClose(onClose: Any) {
    const control = discordClose(onClose);
    if (typeof control === "function") return h(control);
    return control || closeMark(onClose);
  }
  function treeContainsSettingsLabel(node: Any) {
    if (Array.isArray(node)) return node.some(treeContainsSettingsLabel);
    if (typeof node === "string") return isSettingsText(node);
    if (!React.isValidElement(node)) return false;
    return treeContainsSettingsLabel(node.props?.children);
  }
  function treeContainsNightyLabel(node: Any) {
    if (Array.isArray(node)) return node.some(treeContainsNightyLabel);
    if (typeof node === "string") return /^Nighty$/i.test(node.trim());
    if (!React.isValidElement(node)) return false;
    return treeContainsNightyLabel(node.props?.children);
  }
  function repairNightyChildren(node: Any, state: Any): Any {
    if (Array.isArray(node)) {
      const labelIndex = node.findIndex(treeContainsNightyLabel);
      return node.map((child, index) => {
        if (!state.icon && labelIndex >= 0 && index !== labelIndex && React.isValidElement(child)) {
          state.icon = true;
          state.changed = true;
          return profileImage();
        }
        return repairNightyChildren(child, state);
      });
    }
    if (!React.isValidElement(node)) return node;
    const props: Record<string, Any> = {};
    for (const key of ["icon", "Icon", "IconComponent", "renderIcon", "leading", "leadingIcon", "iconSource", "iconName", "glyph", "image"]) {
      if (node.props?.[key] != null) {
        props[key] = typeof node.props[key] === "function" ? ProfileBarIcon : profileImage();
        state.changed = true;
      }
    }
    if (node.props?.children != null) props.children = repairNightyChildren(node.props.children, state);
    return Object.keys(props).length ? React.cloneElement(node, props) : node;
  }
  function repairNightyControl(element: Any) {
    if (!isIconControl(element)) return element;
    const marker = [element.props?.testID, element.props?.nativeID, element.props?.id, element.props?.accessibilityHint].filter(Boolean).join(" ");
    const isNighty = /mime-nighty-profile-button|Open Nighty/i.test(marker);
    if (!isNighty) return element;
    const state = { icon: false, changed: false };
    const props: Record<string, Any> = {};
    for (const key of ["icon", "Icon", "IconComponent", "renderIcon", "leading", "leadingIcon", "iconSource", "iconName", "glyph", "image"]) {
      if (element.props?.[key] != null) {
        props[key] = typeof element.props[key] === "function" ? ProfileBarIcon : profileImage();
        state.changed = true;
      }
    }
    if (element.props?.children != null) props.children = repairNightyChildren(element.props.children, state);
    return state.changed ? React.cloneElement(element, props) : element;
  }
  function nativeControlTree(node: Any, depth = 0, state = { icon: false }): Any {
    if (Array.isArray(node)) {
      const labelIndex = node.findIndex(treeContainsSettingsLabel);
      return node.map((child, index) => {
        if (!state.icon && labelIndex >= 0 && index !== labelIndex && React.isValidElement(child)) {
          state.icon = true;
          return profileImage();
        }
        return nativeControlTree(child, depth, state);
      });
    }
    if (typeof node === "string") return isSettingsText(node) ? "Nighty" : node;
    if (!React.isValidElement(node)) return node;
    const hint = `${iconHint(node)} ${nodeText(node)}`;
    if (!state.icon && depth > 0 && /SettingsIcon|GearIcon|CogIcon|\b(?:gear|cog)\b/i.test(hint) && !pressProps(node.props)) {
      state.icon = true;
      return profileImage();
    }
    const props: Record<string, Any> = {};
    for (const key of ["icon", "Icon", "IconComponent", "renderIcon", "leading", "leadingIcon"]) {
      if (node.props?.[key] != null) {
        props[key] = typeof node.props[key] === "function" ? ProfileBarIcon : profileImage();
      }
    }
    for (const key of ["accessibilityLabel", "accessibilityHint", "aria-label", "testID", "nativeID", "label", "name", "id"]) {
      if (typeof node.props?.[key] === "string" && isSettingsText(node.props[key])) props[key] = "Nighty";
    }
    if (node.props?.children != null) props.children = nativeControlTree(node.props.children, depth + 1, state);
    return React.cloneElement(node, props);
  }
  // Mounted buttons in mount order; the first one shows. Claims happen in effects, so a render React
  // throws away cannot keep ownership, and the next button takes over when the owner unmounts.
  const profileButtons = new Set<Any>();
  function claimProfileButton() {
    const [token] = React.useState(() => ({ refresh: null }));
    const [, refresh] = React.useReducer((count: Any) => count + 1, 0);
    React.useLayoutEffect(() => {
      token.refresh = refresh;
      profileButtons.add(token);
      refresh();
      return () => {
        profileButtons.delete(token);
        for (const other of profileButtons) other.refresh();
      };
    }, []);
    const first = profileButtons.values().next().value;
    return !first || first === token;
  }
  function NightyProfileButton({ sample }: Any) {
    const shown = claimProfileButton();
    r.useRefresh();
    const onPress = press();
    if (!shown || !r.active || !store.showNightyButton) return null;
    if (React.isValidElement(sample)) {
      const native = nativeControlTree(sample);
      return React.cloneElement(native, {
        key: "mime-nighty-profile-button",
        // The sample is Settings; its ref must stay with Settings.
        ref: null,
        accessibilityLabel: "Nighty",
        accessibilityHint: "Open Nighty",
        testID: "mime-nighty-profile-button",
        onPress,
        onPressOut: void 0
      });
    }
    return h(
      RN.Pressable || RN.TouchableOpacity,
      {
        accessibilityLabel: "Nighty",
        accessibilityHint: "Open Nighty",
        accessibilityRole: "button",
        testID: "mime-nighty-profile-button",
        onPress,
        style: { flex: 1, alignItems: "center", justifyContent: "center" }
      },
      profileImage(),
      h(RN.Text, { style: { color: "#F2F3F5", fontSize: 14, lineHeight: 18, fontWeight: "500", marginTop: 2 } }, "Nighty")
    );
  }
  function nightyControl(sample: Any) {
    return h(NightyProfileButton, { key: "mime-nighty-profile-button", sample });
  }
  function nightyRecord(sample: Any) {
    const image = toolbarIcon();
    const record: Record<string, Any> = {};
    if (sample && typeof sample === "object") for (const [key, value] of Object.entries(sample)) {
      if (!/(?:icon|image|glyph|leading)/i.test(key)) record[key] = value;
    }
    for (const key of Object.keys(record)) {
      if (typeof record[key] === "string" && isSettingsText(record[key])) record[key] = "Nighty";
    }
    record.key = "mime-nighty-profile-button";
    record.id = "mime-nighty-profile-button";
    record.label = "Nighty";
    record.text = "Nighty";
    record.accessibilityLabel = "Nighty";
    record.accessibilityHint = "Open Nighty";
    record.IconComponent = Icon;
    record.icon = typeof sample?.icon === "function" ? Icon : image;
    record.onPress = press();
    return record;
  }
  function applyToolbar(element: Any) {
    if (!r.active || !store.showNightyButton || !element?.props) return element;
    const repaired = repairNightyControl(element);
    if (repaired !== element) return repaired;
    const slotted = insertNightySlot(r.React, element, nightyControl);
    if (slotted !== element) {
      r.status.profileButton = "added";
      return slotted;
    }
    let changed = false;
    const props: Record<string, Any> = {};
    for (const key of ACTION_KEYS) {
      const next = insertPlainAction(element.props[key], nightyRecord);
      if (next !== element.props[key]) {
        props[key] = next;
        changed = true;
      }
    }
    if (!changed) return element;
    r.status.profileButton = "added";
    return r.React.cloneElement(element, props);
  }
  const watched = new Set();
  function watch(parent: Any, key: Any) {
    const fn = parent?.[key];
    if (typeof fn !== "function" || watched.has(fn)) return false;
    watched.add(fn);
    // Snow refuses frozen factory objects, such as its own JSX runtime; the hook by name in start() covers those.
    try {
      return r.patch("after", parent, key, (_args, result) => {
        const next = applyToolbar(result);
        return next === result ? void 0 : next;
      });
    } catch {
      return false;
    }
  }
  return { Settings, NightyPage, download, start() {
    registerSettingsRow("NIGHTY", { kind: "page", title: () => "Nighty", icon: Icon, page: NightyPage });
    registerSettingsSection("NIGHTY_SECTION", { title: "Nighty", rows: ["NIGHTY"] });
    r.status.settingsEntry = true;
    r.status.messageMenu = patchLazySheet(r, (key, props) => key === "MessageLongPressActionSheet" && canDownload(store, props?.message) ? { key: "mime-nighty-download", label: "Download Script", icon: h(Icon), onPress: () => download(props.message) } : null);
    rememberMessages(r.common?.i18n?.Messages || r.find("Messages")?.Messages);
    // Discord modules keep the JSX factory they loaded with, so the factory patches below miss a You tab that
    // loaded before this plugin started. The loader's own hook is in place from launch and matches the bar by name.
    r.hook(["YouScreenNavIconMeasurer"], (element) => {
      const next = applyToolbar(element);
      return next === element ? void 0 : next;
    });
    const patched = watch(React, "createElement");
    for (const key of ["jsx", "jsxs"]) watch(React, key);
    // The namespace import is a frozen copy; its default is the host's own runtime object, which can be patched.
    const factories: Any[] = [(jsxRuntimeModule as Any).default ?? jsxRuntimeModule];
    try {
      factories.push(...(findByPropsAll("jsx", "jsxs") || []), findByProps("jsx", "jsxs"));
    } catch {
    }
    for (const factory of factories) {
      watch(factory, "jsx");
      watch(factory, "jsxs");
    }
    r.status.profileButton = patched === false ? "unavailable" : r.status.profileButton === "replaced" ? "replaced" : "patched";
  } };
}
NightyTab.defaults = { url: "", scriptUtils: false, nightyPrefix: ".", iconType: "white", customIconUrl: "", showNightyButton: true, autoLogin: false, loginUsername: "", loginPassword: "", sessionHost: "", sessionToken: "", sessions: {} };

export default register(NightyTab);
