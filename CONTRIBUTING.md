# Contributing

Snow cannot sandbox plugins: a plugin runs with the same access as Snow itself. These rules keep
what this repository publishes reviewable. `bun run check:policy` enforces the parts a machine can
check; maintainers review the rest, and review is the real control.

## Layout

- One folder per plugin under `plugins/<id>/`, per theme under `themes/<id>/`, and per font under
  `fonts/<id>/`. The folder name equals the ID.
- IDs are unique across the repository and never change after the first release. Renaming means a
  new plugin.
- Every folder has a line in `.github/CODEOWNERS`. A change needs approval from that owner and one
  maintainer.

## Plugins

- `source` in `snow.plugin.json` links to the plugin's own folder in this repository.
- Plugin folders hold TypeScript, JSON, Markdown, and license files only. No built or minified
  JavaScript and no binaries. Third-party code comes through the root `package.json` and `bun.lock`
  and needs an SPDX license.
- No runtime code loading: the built bundle may not contain `eval(`, `new Function(`, `Function(`,
  or `import(`. The scan is a heuristic and is easy to evade, so review still matters. A maintainer
  can allow a plugin by adding a line below in the form `allow-runtime-loading: <id>: <reason>`.
- The plugin's `README.md` has a `## Network` section that lists every host it contacts and why, or
  says it contacts none.
- Versions follow SemVer. Every change to a plugin folder bumps its version; the Validate check fails
  otherwise. A version with a prerelease part (for example `1.2.0-beta.1`) goes to the prerelease
  channel.

## Themes and fonts

- They must pass Snow's theme and font parsers.
- Font files are linked by HTTPS URLs to stable, versioned locations such as a tagged release or a
  commit-pinned raw URL, never a moving branch like `main`.

## Withdrawing and yanking

- To remove a plugin from Browse, add its ID to `withdrawn` in `snow.repo.json`.
- To pull a bad version, add it to `yanked`, or move its channel back in `channels`.
- Published files are never deleted, so existing installs keep working. Deleting a folder without
  withdrawing it keeps its old releases listed.
- Changes to `snow.repo.json` need maintainer approval.

## Allowed runtime code loading

None.
