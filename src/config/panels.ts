import type { Editor } from 'grapesjs';

// List of commands to monitor
const MONITORED_COMMANDS = [
  'undo',
  'redo',
  'export-html',
  'preview',
  'clear-canvas',
  'fullscreen',
] as const;

// Telemetry helper for command lifecycle events
export const setupCommandTelemetry = (editor: Editor) => {
  // Listen for ALL command run events (generic listener)
  editor.on('run', (command, sender, options) => {
    console.log('[Telemetry] Command started:', {
      command: command.id,
      timestamp: new Date().toISOString(),
      options,
    });
  });

  // Listen for ALL command stop events (generic listener)
  editor.on('stop', (command, sender, options) => {
    console.log('[Telemetry] Command stopped:', {
      command: command.id,
      timestamp: new Date().toISOString(),
      options,
    });
  });

  // Listen for ALL command abort events (generic listener)
  editor.on('abort', (command, sender, options) => {
    console.warn('[Telemetry] Command aborted:', {
      command: command.id,
      timestamp: new Date().toISOString(),
      options,
    });
  });

  // Add specific command listeners for enhanced telemetry
  MONITORED_COMMANDS.forEach((commandId) => {
    // Listen for specific command run events
    editor.on(`run:${commandId}`, (editor, sender, options) => {
      console.log(`[Telemetry] Specific command run:${commandId}`, {
        timestamp: new Date().toISOString(),
        sender: sender?.id,
        options,
      });
    });

    // Listen for specific command stop events
    editor.on(`stop:${commandId}`, (editor, sender, options) => {
      console.log(`[Telemetry] Specific command stop:${commandId}`, {
        timestamp: new Date().toISOString(),
        sender: sender?.id,
        options,
      });
    });

    // Listen for specific command abort events
    editor.on(`abort:${commandId}`, (editor, sender, options) => {
      console.warn(`[Telemetry] Specific command abort:${commandId}`, {
        timestamp: new Date().toISOString(),
        sender: sender?.id,
        options,
      });
    });
  });
};

// Register custom commands
export const registerCommands = (editor: Editor) => {
  // Open styles panel command
  editor.Commands.add('open-styles-panel', {
    run(editor) {
      console.log('[Command] Opening styles panel for component:', editor.getSelected()?.getName());
      // Dispatch custom event to switch to styles panel
      window.dispatchEvent(new CustomEvent('gjs:open-styles-panel'));
    },
  });

  // Undo command
  editor.Commands.add('undo', {
    run(editor) {
      editor.UndoManager.undo();
    },
  });

  // Redo command
  editor.Commands.add('redo', {
    run(editor) {
      editor.UndoManager.redo();
    },
  });

  // Export HTML command
  editor.Commands.add('export-html', {
    run(editor) {
      const html = editor.getHtml();
      const css = editor.getCss();
      const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Web Page</title>
  <style>${css}</style>
</head>
<body>
  ${html}
</body>
</html>`;

      // Create blob and download
      const blob = new Blob([fullHtml], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `web-page-${Date.now()}.html`;
      link.click();
      URL.revokeObjectURL(url);
    },
  });

  // Preview command (opens in new tab)
  editor.Commands.add('preview', {
    run(editor) {
      const html = editor.getHtml();
      const css = editor.getCss();
      const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Preview - Web Page</title>
  <style>${css}</style>
</head>
<body>
  ${html}
</body>
</html>`;

      const previewWindow = window.open('', '_blank');
      if (previewWindow) {
        previewWindow.document.write(fullHtml);
        previewWindow.document.close();
      }
    },
  });

  // Clear canvas command
  editor.Commands.add('clear-canvas', {
    run(editor) {
      if (confirm('Are you sure you want to clear the canvas?')) {
        editor.setComponents('');
        editor.setStyle('');
      }
    },
  });

  // Toggle fullscreen
  editor.Commands.add('fullscreen', {
    run(editor) {
      editor.runCommand('core:fullscreen');
    },
    stop(editor) {
      editor.stopCommand('core:fullscreen');
    },
  });
};

// SVG Icons for toolbar buttons
export const icons = {
  undo: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M3.5 7h7a3 3 0 010 6H8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
    <path d="M6 4.5L3.5 7 6 9.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`,
  
  redo: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M12.5 7h-7a3 3 0 000 6H8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
    <path d="M10 4.5L12.5 7 10 9.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`,
  
  export: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M8 2v8M5 7l3 3 3-3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M2 11v2a1 1 0 001 1h10a1 1 0 001-1v-2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
  </svg>`,
  
  preview: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <circle cx="8" cy="8" r="3" stroke="currentColor" stroke-width="1.5"/>
    <path d="M2 8s2-4 6-4 6 4 6 4-2 4-6 4-6-4-6-4z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
  </svg>`,
  
  clear: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M3 4h10M6 4V3a1 1 0 011-1h2a1 1 0 011 1v1M5 4v9a1 1 0 001 1h4a1 1 0 001-1V4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
  </svg>`,
  
  fullscreen: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M2 5V3a1 1 0 011-1h2M11 2h2a1 1 0 011 1v2M14 11v2a1 1 0 01-1 1h-2M5 14H3a1 1 0 01-1-1v-2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
  </svg>`,
};

