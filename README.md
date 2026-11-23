<div align="center">

# Snow Plugins

Plugins for Snow, built with the Snow plugin SDK and published as a Snow repository.

[![Snowclient](https://img.shields.io/badge/Snowclient-neoarz%2Fsnow-5865F2?style=flat-square)](https://github.com/neoarz/snow)
[![License](https://img.shields.io/badge/license-PolyForm%20Noncommercial%201.0.0-227c57?style=flat-square)](./LICENSE)

</div>

## About

Snow Plugins is a Snow repository: add it to Snow once, then browse, install and update its plugins from Snow's Plugins page. Each plugin is a TypeScript module in `plugins/<id>/` written against Snow's own modules, and the published bundles are built from this repository by its Publish workflow.

> [!WARNING]
> Plugins run JavaScript inside Discord without a sandbox and can reach anything Discord can, including account and session data. Snow checks that the files you install are the ones this repository published; it does not review them. Client mods can violate Discord's Terms of Service. This project is not affiliated with Discord.

## Plugins

<!-- snow:plugins -->
| Name | Description | Authors | ID |
| --- | --- | --- | --- |
| [GlobalBadges](plugins/mime.globalbadges) | Profile badges from EquiBadges (all client mods) and ObaWorkshop BadgeVault. | Mime \| N0_.q3 | `mime.globalbadges` |
| [Nighty Tab](plugins/mime.nightytab) | Nighty in mobile settings, with an optional profile-bar button and Download Script replies. | Mime \| N0_.q3, rico \| wkcp | `mime.nightytab` |
| [Pin DMs](plugins/mime.pindms) | Per-account DM categories, colors, ordering and collapsible sections for mobile. | Mime \| N0_.q3 | `mime.pindms` |
<!-- /snow:plugins -->

| Plugin | How it works |
| --- | --- |
| GlobalBadges | Adds badges from EquiBadges and BadgeVault to the profile badge row and to Discord's badges page, where they show as **Ultimate**. Separate switches hide custom and BadgeVault badges and donor badges. |
| Nighty Tab | Opens your Nighty web panel from Discord's settings and from an optional button in the profile bar. With script utilities on, messages get a **Download Script** action that replies with your Nighty prefix. |
| Pin DMs | Groups DMs into colored categories in the DM list, per account. Tap a category name to collapse it, hold it to edit it, and hold and drag it to reorder. Hold a DM and tap **Pin DMs** to pin it. |

Each plugin's folder has a README with a **Network** section that lists every host it contacts.

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

## Development

```sh
bun install --frozen-lockfile
bun run typecheck
bun run build        # dist/<id>/manifest.json and the bundle
bun run test         # loads the built bundles with stand-in host modules
bun run dev:repo     # serves the repository locally; see Snow's plugin docs for HTTPS
```

Shared code lives in `shared/`. `types/` holds Snow's public API declarations for the Snow commit in `types/snow/snapshot.json`; regenerate it when moving to a newer Snow. Read [CONTRIBUTING.md](CONTRIBUTING.md) before opening a pull request.

## Credits and license

Maintained by **Mime | @N0_.q3**. GlobalBadges is based on GlobalBadges by domi.btnr and Wolfie. Pin DMs is a mobile port of Equicord's PinDMs by Vendicated and Aria. Nighty Tab is written with rico | wkcp.

Snow Plugins is licensed under the [PolyForm Noncommercial License 1.0.0](./LICENSE), with these exceptions:

- `plugins/mime.pindms/` is licensed under GPL-3.0-or-later, the license of the Equicord code it is ported from.
- `shared/action-sheet.ts` is licensed under MPL-2.0.
- The build scripts at the repository root and `types/` are generated from Snow and keep Snow's licenses; see `types/snow/notices/`.
