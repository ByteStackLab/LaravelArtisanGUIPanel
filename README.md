# Laravel Artisan GUI Panel

A lightweight VS Code extension that adds a sidebar panel for browsing, searching, copying, and running Laravel Artisan commands — no need to type `php artisan ...` in the terminal.

## Features

- Activity bar panel listing Artisan commands, grouped by category
- Search box to filter commands
- Run button — executes the command in an integrated terminal, from the Laravel project root
- Copy button — copies `php artisan <command>` to the clipboard
- Auto-detects commands via `php artisan list --format=json`, so custom and package commands show up automatically
- Auto-detects the Laravel project root (folder containing `artisan`)

## Development

```bash
npm install
npm run watch
```

Press `F5` in VS Code to launch an Extension Development Host with the extension loaded, then open a Laravel project folder in that window.

## Requirements

- PHP CLI available on `PATH`
- A Laravel project (a workspace folder containing an `artisan` file)
