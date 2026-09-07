(function () {
  const vscode = acquireVsCodeApi();
  const content = document.getElementById('content');
  const searchInput = document.getElementById('search');
  const refreshBtn = document.getElementById('refresh-btn');

  const COMMON_COMMANDS = [
    'make:controller',
    'make:model',
    'make:migration',
    'make:request',
    'make:middleware',
    'make:seeder',
    'migrate',
    'migrate:fresh',
    'migrate:rollback',
    'db:seed',
    'route:list',
    'cache:clear',
    'config:clear',
  ];

  /** @type {{root?: string, commands: any[], error?: string, recent?: string[]}} */
  let state = { commands: [], recent: [] };
  let query = '';
  const collapsed = new Set();

  function matchesQuery(cmd) {
    if (!query) {
      return true;
    }
    const q = query.toLowerCase();
    return cmd.name.toLowerCase().includes(q) || cmd.description.toLowerCase().includes(q);
  }

  function appendCommandRow(container, cmd) {
    const row = document.createElement('div');
    row.className = 'command-row';

    const main = document.createElement('div');
    main.className = 'command-main';
    const name = document.createElement('div');
    name.className = 'command-name';
    name.textContent = cmd.name;
    main.appendChild(name);
    if (cmd.description) {
      const desc = document.createElement('div');
      desc.className = 'command-desc';
      desc.textContent = cmd.description;
      main.appendChild(desc);
    }
    row.appendChild(main);

    const actions = document.createElement('div');
    actions.className = 'command-actions';

    const hasParams = cmd.arguments.length > 0 || cmd.options.length > 0;

    const runBtn = document.createElement('button');
    runBtn.className = 'icon-btn';
    runBtn.title = hasParams
      ? 'Run now (Artisan will prompt for any missing details in the terminal)'
      : 'Run';
    runBtn.textContent = '▶';
    runBtn.addEventListener('click', () => {
      vscode.postMessage({ type: 'run', command: cmd.name });
    });
    actions.appendChild(runBtn);

    const copyBtn = document.createElement('button');
    copyBtn.className = 'icon-btn';
    copyBtn.title = 'Copy';
    copyBtn.textContent = '⧉';
    copyBtn.addEventListener('click', () => {
      vscode.postMessage({ type: 'copy', text: `php artisan ${cmd.name}` });
    });
    actions.appendChild(copyBtn);

    row.appendChild(actions);
    container.appendChild(row);
  }

  function appendPinnedSection(container, key, title, cmds) {
    if (cmds.length === 0) {
      return;
    }
    const section = document.createElement('div');
    section.className = 'category';

    const header = document.createElement('div');
    header.className = 'category-header';
    header.textContent = `${collapsed.has(key) ? '▸' : '▾'} ${title} (${cmds.length})`;
    header.addEventListener('click', () => {
      if (collapsed.has(key)) {
        collapsed.delete(key);
      } else {
        collapsed.add(key);
      }
      render();
    });
    section.appendChild(header);

    if (!collapsed.has(key)) {
      for (const cmd of cmds) {
        appendCommandRow(section, cmd);
      }
    }

    container.appendChild(section);
  }

  function groupByCategory(commands) {
    const groups = new Map();
    for (const cmd of commands) {
      if (!groups.has(cmd.category)) {
        groups.set(cmd.category, []);
      }
      groups.get(cmd.category).push(cmd);
    }
    return new Map([...groups.entries()].sort((a, b) => a[0].localeCompare(b[0])));
  }

  function render() {
    content.innerHTML = '';

    if (state.error) {
      const err = document.createElement('div');
      err.className = 'error-box';
      err.textContent = state.error;
      content.appendChild(err);
      return;
    }

    if (!state.root) {
      const hint = document.createElement('p');
      hint.className = 'hint';
      hint.textContent = 'No Laravel project detected. Open a folder that contains an "artisan" file.';
      content.appendChild(hint);
      return;
    }

    const filtered = state.commands.filter(matchesQuery);
    if (filtered.length === 0) {
      const hint = document.createElement('p');
      hint.className = 'hint';
      hint.textContent = 'No matching commands.';
      content.appendChild(hint);
      return;
    }

    if (!query) {
      const byName = new Map(state.commands.map((cmd) => [cmd.name, cmd]));

      const recentCmds = (state.recent || [])
        .map((name) => byName.get(name))
        .filter(Boolean);
      appendPinnedSection(content, '__recent', '🕒 Recently Used', recentCmds);

      const commonCmds = COMMON_COMMANDS.map((name) => byName.get(name)).filter(Boolean);
      appendPinnedSection(content, '__common', '⭐ Common Commands', commonCmds);
    }

    const groups = groupByCategory(filtered);
    for (const [category, cmds] of groups) {
      const section = document.createElement('div');
      section.className = 'category';

      const header = document.createElement('div');
      header.className = 'category-header';
      header.textContent = `${collapsed.has(category) ? '▸' : '▾'} ${category} (${cmds.length})`;
      header.addEventListener('click', () => {
        if (collapsed.has(category)) {
          collapsed.delete(category);
        } else {
          collapsed.add(category);
        }
        render();
      });
      section.appendChild(header);

      if (!collapsed.has(category)) {
        for (const cmd of cmds) {
          appendCommandRow(section, cmd);
        }
      }

      content.appendChild(section);
    }
  }

  searchInput.addEventListener('input', (e) => {
    query = e.target.value;
    render();
  });

  refreshBtn.addEventListener('click', () => {
    vscode.postMessage({ type: 'refresh' });
  });

  window.addEventListener('message', (event) => {
    const message = event.data;
    if (message.type === 'state') {
      state = message;
      render();
    } else if (message.type === 'recent') {
      state.recent = message.recent;
      render();
    }
  });
})();
