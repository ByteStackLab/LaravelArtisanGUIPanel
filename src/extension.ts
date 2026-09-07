import * as vscode from 'vscode';
import { ArtisanSidebarProvider } from './sidebarProvider';

export function activate(context: vscode.ExtensionContext): void {
  const provider = new ArtisanSidebarProvider(context);

  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(ArtisanSidebarProvider.viewType, provider)
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('laravelArtisan.refresh', () => provider.refresh())
  );

  context.subscriptions.push(
    vscode.workspace.onDidChangeWorkspaceFolders(() => provider.refresh())
  );
}

export function deactivate(): void {}
