import * as vscode from 'vscode';
import { detectArtisanCommands } from './artisanService';

let terminal: vscode.Terminal | undefined;

function getTerminal(cwd: string): vscode.Terminal {
  if (terminal && vscode.window.terminals.includes(terminal)) {
    return terminal;
  }
  terminal = vscode.window.createTerminal({ name: 'Artisan', cwd });
  return terminal;
}

function getNonce(): string {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < 32; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

export class ArtisanSidebarProvider implements vscode.WebviewViewProvider {
  public static readonly viewType = 'laravelArtisan.panel';

  private view: vscode.WebviewView | undefined;

  constructor(private readonly context: vscode.ExtensionContext) {}

  resolveWebviewView(webviewView: vscode.WebviewView): void {
    this.view = webviewView;

    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [vscode.Uri.joinPath(this.context.extensionUri, 'media')],
    };

    webviewView.webview.html = this.renderHtml(webviewView.webview);

    webviewView.webview.onDidReceiveMessage((message) => this.handleMessage(message));

    void this.refresh();
  }

  public async refresh(): Promise<void> {
    if (!this.view) {
      return;
    }
    const result = await detectArtisanCommands();
    void this.view.webview.postMessage({ type: 'state', ...result });
  }

  private async handleMessage(message: any): Promise<void> {
    switch (message?.type) {
      case 'refresh': {
        await this.refresh();
        break;
      }
      case 'copy': {
        await vscode.env.clipboard.writeText(message.text);
        void vscode.window.showInformationMessage(`Copied: ${message.text}`);
        break;
      }
      case 'run': {
        const result = await detectArtisanCommands();
        if (!result.root) {
          void vscode.window.showErrorMessage('No Laravel project (artisan file) found in this workspace.');
          return;
        }
        const term = getTerminal(result.root);
        term.show();
        term.sendText(`php artisan ${message.command}`.trim());
        break;
      }
    }
  }

  private renderHtml(webview: vscode.Webview): string {
    const scriptUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this.context.extensionUri, 'media', 'main.js')
    );
    const styleUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this.context.extensionUri, 'media', 'main.css')
    );
    const nonce = getNonce();

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta
    http-equiv="Content-Security-Policy"
    content="default-src 'none'; style-src ${webview.cspSource}; script-src 'nonce-${nonce}';"
  />
  <link href="${styleUri}" rel="stylesheet" />
  <title>Laravel Artisan</title>
</head>
<body>
  <div id="app">
    <div class="search-row">
      <input id="search" type="text" placeholder="Search commands..." />
      <button id="refresh-btn" title="Refresh">&#8635;</button>
    </div>
    <div id="content"><p class="hint">Loading Artisan commands...</p></div>
  </div>
  <script nonce="${nonce}" src="${scriptUri}"></script>
</body>
</html>`;
  }
}
