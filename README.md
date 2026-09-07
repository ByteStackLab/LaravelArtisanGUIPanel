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
- **Run button (▶)** — for a simple command (e.g. `migrate`, `cache:clear`) it runs immediately in
  an integrated terminal. For a command that takes arguments/options (e.g. `make:model`), it opens
  a small inline form first (see below)
- **Copy button (⧉)** — copies `php artisan <command>` to the clipboard so you can paste and adjust
  it by hand if you'd rather not use the form
- **Argument/option form** — for commands like `make:model`, fills in the required name and
  toggles common flags (`-m`, `-c`, `-f`, ...) without memorizing the CLI syntax
- **Automatic command detection** — reads the live list from `php artisan list --format=json`, so
  it always matches your installed Laravel version, including commands added by packages (e.g.
  `telescope:clear`, `permission:cache-reset`) and your own custom commands. Nothing is hard-coded.
- **Automatic Laravel project detection** — finds the workspace folder that contains an `artisan`
  file and always runs commands from that directory, regardless of where the VS Code window itself
  is rooted

## Usage

1. Open a Laravel project folder in VS Code (any folder containing an `artisan` file works, even
   as a subfolder in a multi-root workspace).
2. Click the **Laravel Artisan** icon in the Activity Bar (left sidebar).
3. The panel loads every Artisan command your project currently has, grouped under **Common
   Commands**, **Recently Used**, and by category.
4. To run something simple — click ▶ next to `migrate`, `cache:clear`, `route:list`, etc. It
   executes immediately in an "Artisan" terminal.
5. To run something that needs input — click ▶ next to `make:model`. A small form appears
   in-place: fill in the model name, tick `-m` for a migration, `-c` for a controller, etc., then
   click the **Run** button inside the form.
6. To copy instead — click ⧉. `php artisan make:model` (without arguments) is copied to the
   clipboard so you can type the rest yourself.
7. Use the search box at the top to jump straight to a command by name or description.
8. Use the refresh icon (⟳) in the panel's title bar if you add a custom command or install a
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
- Global Symfony options common to every command (`--help`, `--quiet`, `--verbose`, `--env`, etc.)
  are filtered out of the generated form, since they rarely apply to day-to-day usage

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
