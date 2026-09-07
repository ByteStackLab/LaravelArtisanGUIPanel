# Changelog

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
