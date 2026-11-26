<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="assets/snow/icon-dark.svg">
    <source media="(prefers-color-scheme: light)" srcset="assets/snow/icon-light.svg">
    <img src="assets/snow/icon-light.svg" alt="Snow" width="112" />
  </picture>
</p>

<div align="center">

# Snow Plugins

Plugins for Snow, built with the Snow plugin SDK.

[![Snowclient](https://img.shields.io/badge/Snowclient-neoarz%2Fsnow-5865F2?style=flat-square)](https://github.com/neoarz/snow)
[![License](https://img.shields.io/badge/license-PolyForm%20Noncommercial%201.0.0-227c57?style=flat-square)](./LICENSE)

</div>

## About

Snow Plugins is a Snow repository: add it to Snow once, then browse, install and update its plugins from Snow's Plugins page. Each plugin is a TypeScript module in `plugins/<id>/` written against Snow's own modules, and the published bundles are built from this repository by its Publish workflow.

[GlobalBadges](./plugins/mime.globalbadges/) and [Pin DMs](./plugins/mime.pindms/) are available here for Snow releases that lack the built-in versions. If your Snow build includes either feature, use one version at a time.

## Requirements and installation

1. Use a build of [Snow](https://github.com/neoarz/snow) with plugin repositories (plugin API 1.x).
2. In Snow, open **Plugins**, then the options menu, then **Repositories**, then **Add repository**, and enter:

   ```
   https://xmimiez.github.io/SnowPlugins/repository.json
   ```

3. Confirm the trust sheet, then open **Browse** on the Plugins page and install the plugins you want.

### Updates

Snow checks the repository every 6 hours, or when you refresh it from its page under **Repositories**. New versions appear under **Check for plugin updates**. A published version never changes; every fix is a new version, and under **Update track** you can follow a channel or pin one exact version.

## Behavior and limits

- Settings are stored per plugin ID. Plugins installed from the older Bunny-format releases are separate installs and do not share their settings with these.
- Discord's JavaScript is not a stable API. A Discord update can move what a plugin patches; the plugin then does nothing for that part until it is updated.
- The plugins are tested on Discord for iOS 354.0 with Snow 0.5.0.

## Credits and license

Repo managed by [xMimiez](https://github.com/xMimiez).

Snow Plugins is licensed under the [PolyForm Noncommercial License 1.0.0](./LICENSE), with these exceptions:

- `plugins/mime.nitrosniper/` is licensed under MIT, the license of the NitroSniper code it is ported from.
- `plugins/mime.pindms/` is licensed under GPL-3.0-or-later.
- `shared/action-sheet.ts` is licensed under MPL-2.0.
- The Snow logo is licensed under the [MIT License](./assets/snow/LICENSE).
- The build scripts at the repository root and `types/` are generated from Snow and keep Snow's licenses; see `types/snow/notices/`.
