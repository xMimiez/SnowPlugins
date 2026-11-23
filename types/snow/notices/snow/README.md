# Licensing

Snow uses several licenses. The root MIT license applies by default only to
original Snow material owned by neoarz. It does not replace the licenses or
notices listed below.

## Snow-authored contributions

Copyrightable material that neoarz authored for Snow in this repository is
licensed under the [MIT License](../../LICENSE). This covers original standalone
code and neoarz's copyrightable additions or changes to existing code.
`packages/dev/**`, `tooling/**`, and `tests/**` are original Snow work and use MIT
unless a file carries a different notice.

In files derived from Rain or RainTweak, the MIT grant covers only neoarz's
contribution. Upstream material keeps its license. The contribution is also
available under the governing MPL-2.0 or OSL-3.0 terms where those licenses
require the modified or derivative file to keep that license. Recipients cannot
treat the combined file as MIT-only.

## Snow and Rain source

JavaScript and TypeScript files retained or modified from
[Rain](https://codeberg.org/raincord/rain) remain under the
[Mozilla Public License 2.0](licenses/MPL-2.0.txt). The client, API, core,
Discord adapter, native adapter, and UI workspace packages contain both
Rain-derived MPL files and original MIT files. Their package metadata uses
`MIT AND MPL-2.0` to indicate that both licenses apply. The original `@snow/dev`
package uses `MIT`.

The MPL is file-level copyleft. Modified MPL-covered files remain under the MPL,
and anyone distributing builds must tell recipients where to find the
corresponding source.

## Native iOS loader

Snow's native loader under [`native`](../../native) is a modified version of
[RainTweak](https://codeberg.org/raincord/RainTweak). It remains licensed under
the [Open Software License 3.0](../../native/LICENSE), except for the React Native
headers identified below. Snow is not an official Rain or RainTweak release.

> [!IMPORTANT]
> OSL-3.0 has conditions for external deployment, source availability, attribution,
> and recipient assent. Keeping the license text alone does not meet them all.
> Snow cannot relicense RainTweak-derived files without permission from the
> relevant copyright holders. A public binary release should receive legal
> review specific to the project.

## Separately licensed source

These files retain their upstream terms and are not relicensed by Snow:

| Source                                                       | License                                             |
| ------------------------------------------------------------ | --------------------------------------------------- |
| `native/Vendor/jsi/**` and `native/Vendor/RCTHost.h`         | React Native MIT license in `native/Vendor/LICENSE` |
| `plugins/core/errorboundary/parseErrorStack.ts`              | React Native MIT notice embedded in the file        |
| `plugins/features/moreconfirm/index.ts`                      | GPL-3.0-or-later notice embedded in the file        |
| `plugins/features/decor/lib/stores/UsersDecorationsStore.ts` | GPL-3.0-or-later notice embedded in the file        |
| `plugins/features/decor/lib/decoration.ts`                   | GPL-3.0-or-later notice embedded in the file        |
| `packages/api/src/lib/utils/cyrb64.ts`                       | Public-domain notice embedded in the file           |

The complete GPL text is in
[`licenses/GPL-3.0-or-later.txt`](licenses/GPL-3.0-or-later.txt).

Installed dependencies keep their own licenses. Production builds
generate `dist/LICENSES.txt` from the exact package locations included by the
bundler, and native packages include that file in `SnowResources.bundle`. GPL
text is included in binary notices only when GPL-covered source is a
bundle input.

See [`upstream.md`](upstream.md) for pinned upstream revisions and
[`third-party.md`](third-party.md) for the detailed source and dependency
notice inventory. Git history and the pinned upstream revision are the
authoritative provenance record for mixed packages.

## User-installed plugins, themes, and fonts

Snow stores content downloaded through its direct URL importers in the user's
app container. That content is not part of Snow's source tree or release bundle.
Its copyright, license, trademark, privacy, and distribution obligations remain
with its publisher and user. Snow displays a plugin manifest's declared SPDX
license when available, or **Not declared** for compatibility formats that omit
one. Snow verifies syntax and artifact integrity but does not verify ownership,
license accuracy, source provenance, or legal compatibility.

Snow's schema 2 plugin manifest requires a license expression and source URL.
Vendetta and Bunny compatibility manifests may omit them because their upstream
formats do not require the same metadata. Missing metadata is not permission to
copy, modify, or redistribute a plugin. Do not add downloaded third-party code to
this repository, fixtures, release artifacts, or generated notices without a
separate license review and the provenance records required above.

## Contributions

New original contributions are accepted under MIT. Contributions that modify an
MPL-2.0 or OSL-3.0 file are also licensed under that file's governing license so
the combined file can be distributed under its upstream terms. Contributors may
not relicense material they do not own.

No license grants rights to the names, logos, or trademarks of Snow, Rain,
RainTweak, Discord, or any other project.

Discord itself and any user-supplied Discord IPA are not part of Snow and are
not distributed or licensed by this repository.
