# Changelog

## [1.0.0] - 2026-09-07

- Initial release
- Sidebar panel with Artisan command list, grouped by category
- Search box to filter commands
- Run button — executes in the integrated terminal from the Laravel project root
- Copy button — copies the full `php artisan` command to the clipboard
- Auto-detects commands via `php artisan list --format=json` (built-in, custom, and package commands)
- Auto-detects the Laravel project root
- Generated argument/option form for commands that need input
