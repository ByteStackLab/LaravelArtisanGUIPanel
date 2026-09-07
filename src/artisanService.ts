import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { exec } from 'child_process';
import { ArtisanCommand, DetectionResult } from './types';

const GLOBAL_OPTIONS = new Set([
  'help',
  'quiet',
  'verbose',
  'version',
  'ansi',
  'no-interaction',
  'env',
]);

export function findLaravelRoot(): string | undefined {
  const folders = vscode.workspace.workspaceFolders;
  if (!folders) {
    return undefined;
  }
  for (const folder of folders) {
    const artisanPath = path.join(folder.uri.fsPath, 'artisan');
    if (fs.existsSync(artisanPath)) {
      return folder.uri.fsPath;
    }
  }
  return undefined;
}

function categoryFor(name: string): string {
  const idx = name.indexOf(':');
  if (idx === -1) {
    return 'General';
  }
  return name.substring(0, idx);
}

function runArtisanList(cwd: string): Promise<string> {
  return new Promise((resolve, reject) => {
    exec('php artisan list --format=json', { cwd, maxBuffer: 1024 * 1024 * 10 }, (error, stdout, stderr) => {
      if (error) {
        reject(new Error(stderr?.trim() || error.message));
        return;
      }
      resolve(stdout);
    });
  });
}

function parseCommands(json: string): ArtisanCommand[] {
  const parsed = JSON.parse(json);
  const rawCommands: any[] = parsed.commands ?? [];

  return rawCommands
    .filter((cmd) => cmd.name && cmd.name !== '_complete' && cmd.name !== 'completion')
    .map((cmd) => {
      const def = cmd.definition ?? {};
      const args = Object.values(def.arguments ?? {}) as any[];
      const opts = (Object.values(def.options ?? {}) as any[]).filter(
        (opt) => !GLOBAL_OPTIONS.has(opt.name)
      );

      return {
        name: cmd.name as string,
        description: (cmd.description as string) ?? '',
        category: categoryFor(cmd.name as string),
        arguments: args.map((a) => ({
          name: a.name,
          is_required: !!a.is_required,
          is_array: !!a.is_array,
          description: a.description ?? '',
          default: a.default ?? null,
        })),
        options: opts.map((o) => ({
          name: o.name,
          shortcut: o.shortcut ?? '',
          accept_value: !!o.accept_value,
          is_value_required: !!o.is_value_required,
          is_multiple: !!o.is_multiple,
          description: o.description ?? '',
          default: o.default ?? null,
        })),
      } as ArtisanCommand;
    })
    .sort((a, b) => a.name.localeCompare(b.name));
}

export async function detectArtisanCommands(): Promise<DetectionResult> {
  const root = findLaravelRoot();
  if (!root) {
    return { root: undefined, commands: [], error: undefined };
  }

  try {
    const output = await runArtisanList(root);
    const commands = parseCommands(output);
    return { root, commands, error: undefined };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return { root, commands: [], error: message };
  }
}
