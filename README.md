# Laravel Artisan GUI Panel

A lightweight VS Code extension for Laravel developers. It adds a sidebar panel listing every
Artisan command available in your project — browse, search, copy, or run any of them in one
click, without typing `php artisan ...` in the terminal every time.

**Marketplace:** https://marketplace.visualstudio.com/items?itemName=bytestacklab.laravel-artisan-gui-panel
**Open VSX:** https://open-vsx.org/extension/bytestacklab/laravel-artisan-gui-panel

---

## Features

- **Laravel Artisan icon in the Activity Bar** — opens a dedicated panel, no need to use the
  terminal to remember command names
- **Pinned "⭐ Common Commands" section** — `make:controller`, `make:model`, `make:migration`,
  `make:request`, `make:middleware`, `make:seeder`, `migrate`, `migrate:fresh`,
  `migrate:rollback`, `db:seed`, `route:list`, `cache:clear`, `config:clear` — the ones used most
  across projects, always at the top
- **"🕒 Recently Used" section** — the last commands you ran in this workspace, most recent first,
  so repeating a command is one click away
- **Category grouping** — every other command grouped by its prefix (`make`, `migrate`, `db`,
  `cache`, `route`, `queue`, `config`, ...), collapsible
- **Search box** — type `controller` and instantly filter down to `make:controller`
- **Run button (▶)** — runs the command immediately in an integrated terminal, for every command.
  If a command needs input it doesn't have (e.g. `make:model`'s name), Artisan itself prompts for
  it interactively right there in the terminal — no separate form to fill in first
- **Copy button (⧉)** — copies `php artisan <command>` to the clipboard so you can paste it
  somewhere and add arguments/flags by hand
- **Automatic command detection** — reads the live list from `php artisan list --format=json`, so
  it always matches your installed Laravel version, including commands added by packages (e.g.
  `telescope:clear`, `permission:cache-reset`) and your own custom commands. Nothing is hard-coded.
- **Automatic Laravel project detection** — finds the workspace folder that contains an `artisan`
  file and always runs commands from that directory, regardless of where the VS Code window itself
  is rooted

## Installation

- **From the Marketplace:** search "Laravel Artisan GUI Panel" in VS Code's Extensions panel
  (`Cmd/Ctrl+Shift+X`), or install directly:
  ```bash
  code --install-extension bytestacklab.laravel-artisan-gui-panel
  ```
- **From Open VSX** (VSCodium, Cursor, Gitpod, etc.): search the same name in your editor's
  extension panel, or use its equivalent of the command above.
- **From a `.vsix` file:** `code --install-extension laravel-artisan-gui-panel-<version>.vsix`

## Usage

1. Open a Laravel project folder in VS Code (any folder containing an `artisan` file works, even
   as a subfolder in a multi-root workspace).
2. Click the **Laravel Artisan** icon in the Activity Bar (left sidebar).
3. The panel loads every Artisan command your project currently has, grouped under **Common
   Commands**, **Recently Used**, and by category.
4. Click ▶ next to any command — `migrate`, `cache:clear`, `make:model`, anything — to run it
   immediately in an integrated terminal named "Artisan", from the Laravel project root.
   - If the command needs something you didn't provide (e.g. `make:model`'s name), Artisan asks
     for it right there in the terminal — just answer the prompt.
   - To pass flags upfront (e.g. `make:model Product -m`), use Copy instead and add them by hand,
     or just answer "yes" when Artisan asks whether to also create a migration.
5. Click ⧉ to copy `php artisan <command>` to the clipboard instead of running it.
6. Use the search box at the top to jump straight to a command by name or description.
7. Use the refresh icon (⟳) in the panel's title bar if you add a custom command or install a
   package and want the list to pick it up without reopening VS Code.

## How command detection works

On every load, the extension runs `php artisan list --format=json` from your project root and
parses the result — the same JSON Symfony Console produces for any Artisan command, built-in or
not. This means:

- It always reflects your exact installed Laravel/package versions — no hard-coded command list to
  fall out of date
- Custom commands your team registers under `app/Console/Commands` show up automatically
- Commands added by installed packages (Telescope, Horizon, Spatie packages, etc.) show up
  automatically
- The panel shows each command's description straight from Artisan, so it's never out of sync with
  what `php artisan list` itself would tell you

## Requirements

- PHP CLI available on `PATH` (the extension shells out to `php artisan`)
- A Laravel project — a workspace folder (or a subfolder in it) containing an `artisan` file

## Development

```bash
npm install
npm run watch
```

Press `F5` in VS Code to launch an Extension Development Host with the extension loaded, then open
a Laravel project folder in that window. See `PUBLISHING.md` for how releases are published to the
Marketplace and Open VSX.

## License

MIT — see [LICENSE](LICENSE).
