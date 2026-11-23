# Third-party source notices

Follow the third-party notices embedded in source files. They are authoritative
and must not be removed.

- `native/Vendor/jsi/` and `native/Vendor/RCTHost.h` contain
  React Native source distributed under the MIT license by Meta Platforms, Inc.
  The complete license is in
  `native/Vendor/LICENSE`.
- `plugins/core/errorboundary/parseErrorStack.ts` contains React Native source
  distributed under the MIT license. The file includes the complete notice.
- `plugins/features/moreconfirm/index.ts` contains source distributed under
  GPL-3.0-or-later by Amsyar Rasyiq. It keeps its separate license and is
  included in Snow's generated application bundle.
- `plugins/features/decor/lib/stores/UsersDecorationsStore.ts` and
  `plugins/features/decor/lib/decoration.ts` contain Vencord
  source distributed under GPL-3.0-or-later by Vendicated and contributors.
  The Decor feature is excluded from Snow's generated application bundle.
- The development-only React inspection preload is built from
  `react-devtools-core@6.1.5`, distributed under the MIT license by Meta and
  contributors. It is not embedded in production builds.
- The locked development dependencies override `browserslist` (MIT), `shell-quote`
  (MIT), `ws` (MIT), and `yaml` (ISC) to reviewed patched versions. Their
  installed packages contain the authoritative upstream notices.

The production client currently uses `@gullerya/object-observer` (ISC),
`@shikijs/core`, `@shikijs/engine-javascript`, `@shikijs/primitive`,
`@shikijs/types`, and `@shikijs/vscode-textmate` (MIT), `@swc/helpers`
(Apache-2.0), `color-name` (MIT), `es-toolkit` (MIT), `oniguruma-to-es` with
`oniguruma-parser`, `regex`, `regex-recursion`, and `regex-utilities` (MIT),
`spdx-expression-parse` (MIT), and `zustand` (MIT). The SPDX parser bundles
`spdx-exceptions` (CC-BY-3.0) and `spdx-license-ids` (CC0-1.0). Those two npm
packages declare their licenses but do not publish license files. Snow keeps pinned copies of their canonical SPDX
license texts from `https://spdx.org/licenses/CC-BY-3.0.txt` and
`https://spdx.org/licenses/CC0-1.0.txt` in `meta/legal/licenses/` and includes them
in generated notices. Other transitive dependencies keep their own licenses.

The build uses esbuild metadata to identify the exact set of bundled packages.
It writes their installed notices, or an explicitly mapped canonical text, to
`dist/LICENSES.txt`. The native package embeds that file in
`SnowResources.bundle`.

The Bun lockfile records package identities and integrity data, not a complete
license inventory. Snow generates release notices from installed, locked package
metadata. No source from architectural reference projects was copied as part of
the Snow rewrite.

## VendettaThemeUtil color mappings

`plugins/core/painter/themes/legacy-tokens.json` contains historical color mappings
from [VendettaThemeUtil](https://github.com/nexpid/VendettaThemeUtil/tree/3b6f03b386b391da6b1abf75565406d971fdda82),
Discord 209.8. The source's MIT notice follows.

MIT License

Copyright (c) 2023 nexpid

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

## Code block highlighting grammars and themes

`plugins/features/codeblockhighlighting/assets/` is generated from
`@shikijs/langs` 4.5.0 and `@shikijs/themes` 4.5.0 (MIT, Shiki). The build adds
those packages' notices to `dist/LICENSES.txt`. Shiki redistributes each
grammar and theme under its original license; the sources below are the ones
recorded by `tm-grammars` 1.32.22 and `tm-themes` 1.12.12.

- Microsoft Visual Studio Code (MIT, Copyright (c) 2015 - present Microsoft
  Corporation): the `c`, `csharp`, `css`, `diff`, `docker`, `go`, `html`,
  `ini`, `java`, `json`, `jsonc`, `lua`, `markdown`, `python`, `rust`,
  `shellscript`, `tsx`, and `xml` grammars, and the `dark-plus`, `light-plus`,
  and `monokai` themes.
- fwcd/vscode-kotlin (MIT, Copyright (c) 2016 George Fraser, Copyright (c)
  2018 fwcd): the `kotlin` grammar.
- textmate/yaml.tmbundle and textmate/toml.tmbundle (TextMate bundle
  license, below): the `yaml` and `toml` grammars.
- primer/github-vscode-theme (MIT, Copyright (c) 2020 Primer): the
  `github-dark-default` and `github-light-default` themes.
- Binaryify/OneDark-Pro (MIT, Copyright (c) 2013-2022 Binaryify): the
  `one-dark-pro` theme.
- dracula/visual-studio-code (MIT, Copyright (c) 2016 Dracula Theme): the
  `dracula` theme.

The MIT-licensed items above share this permission notice:

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

The TextMate bundle license:

    Permission to copy, use, modify, sell and distribute this
    software is granted. This software is provided "as is" without
    express or implied warranty, and with no claim as to its
    suitability for any purpose.
