# Changelog

## [1.0.4] - 2026-09-07

- Removed the ⚙ "configure arguments" button and inline form entirely — Run always executes
  immediately for every command, and Artisan's own interactive terminal prompts handle anything
  missing. Simpler UI, same capability.
- Expanded README with an Installation section and updated the usage walkthrough to match.

## [1.0.3] - 2026-09-07

- Changed: ▶ Run now always executes the command immediately in the terminal, for every command
  — including ones with arguments (Artisan itself will interactively prompt for anything required
  that's missing, e.g. `make:model`'s name). Previously it opened an inline form instead of
  running, which read as broken.
- Added a separate ⚙ button (only for commands with arguments/options) to pre-fill values and
  toggle flags like `-m`/`-c` before running, instead of overloading the Run button.

## [1.0.2] - 2026-09-07

- Fixed: for commands that need arguments/options (e.g. `make:model`), clicking ▶ opened the
  inline form silently with no visible feedback, which looked like the button did nothing. It now
  highlights the button, scrolls the form into view, and focuses the first field.

## [1.0.1] - 2026-09-07

- Fixed: Run button would open the terminal and type the command but not execute it, when a new
  terminal had to be created (the shell wasn't ready yet to accept input)
- Added a pinned "⭐ Common Commands" section (make:controller, make:model, make:migration, migrate,
  db:seed, etc.) always shown at the top
- Added a "🕒 Recently Used" section that tracks the last commands you ran, per workspace

## [1.0.0] - 2026-09-07

- Initial release
- Sidebar panel with Artisan command list, grouped by category
- Search box to filter commands
- Run button — executes in the integrated terminal from the Laravel project root
- Copy button — copies the full `php artisan` command to the clipboard
- Auto-detects commands via `php artisan list --format=json` (built-in, custom, and package commands)
- Auto-detects the Laravel project root
- Generated argument/option form for commands that need input
