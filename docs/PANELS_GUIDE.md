# Panels & Buttons Guide

This guide describes the custom panels and toolbar functionality in the Web Builder.

## Overview

The Web Builder uses a custom PanelsManager configuration with SVG icons and telemetry tracking for all core actions.

## Toolbar Buttons

### Undo/Redo
- **Undo** (Ctrl+Z): Reverts the last change
- **Redo** (Ctrl+Y): Reapplies a reverted change
- State-aware: buttons are disabled when no actions are available

### Export & Preview
- **Preview**: Opens current template in a new browser tab
  - Full HTML document with embedded CSS
  - Useful for testing across different browsers
  
- **Export HTML**: Downloads complete HTML file
  - File name: `web-page-[timestamp].html`
  - Includes all CSS styles inline
  - Ready for web hosting provider upload

### Utility Actions
- **Fullscreen**: Toggle fullscreen canvas mode
- **Clear**: Reset canvas (includes confirmation dialog)

## Command Telemetry

All commands emit lifecycle events that are logged to the console. The system implements **two levels of telemetry**:

### 1. Generic Event Listeners

These listen to ALL commands in the editor:

- **run** - Any command started
- **stop** - Any command completed
- **abort** - Any command cancelled or failed

Example output:
```javascript
[Telemetry] Command started: {
  command: "export-html",
  timestamp: "2025-10-01T12:34:56.789Z",
  options: {}
}
```

### 2. Command-Specific Event Listeners

These listen to specific commands using the `run:cmd`, `stop:cmd`, `abort:cmd` pattern:

Monitored commands:
- `undo`
- `redo`
- `export-html`
- `preview`
- `clear-canvas`
- `fullscreen`

Example output:
```javascript
[Telemetry] Specific command run:export-html {
  timestamp: "2025-10-01T12:34:56.789Z",
  sender: "toolbar-button",
  options: {}
}

[Telemetry] Specific command stop:export-html {
  timestamp: "2025-10-01T12:34:57.123Z",
  sender: "toolbar-button",
  options: {}
}
```

### Benefits of Dual Telemetry

1. **Generic listeners** - Track all editor commands, including built-in GrapesJS commands
2. **Specific listeners** - Fine-grained monitoring of critical custom commands
3. **Analytics integration** - Easy to replace console.log with analytics service
4. **Debugging** - Detailed command lifecycle tracking

## Custom Command Registration

You can add custom commands in `src/config/panels.ts`:

```typescript
editor.Commands.add('my-custom-command', {
  run(editor) {
    // Command logic here
  },
  stop(editor) {
    // Cleanup logic (optional)
  }
});
```

To include your custom command in telemetry monitoring, add it to the `MONITORED_COMMANDS` array:

```typescript
const MONITORED_COMMANDS = [
  'undo',
  'redo',
  'export-html',
  'preview',
  'clear-canvas',
  'fullscreen',
  'my-custom-command', // Add your command here
] as const;
```

## Integrating Analytics Services

You can easily integrate third-party analytics by modifying the telemetry setup:

### Example: Google Analytics

```typescript
export const setupCommandTelemetry = (editor: Editor) => {
  editor.on('run', (command, sender, options) => {
    // Console logging
    console.log('[Telemetry] Command started:', command.id);
    
    // Send to Google Analytics
    if (window.gtag) {
      window.gtag('event', 'command_run', {
        command_id: command.id,
        timestamp: new Date().toISOString()
      });
    }
  });
};
```

### Example: Custom Analytics Service

```typescript
import { trackEvent } from './analytics';

editor.on(`run:export-html`, () => {
  trackEvent('export_initiated', {
    feature: 'email_builder',
    action: 'export_html'
  });
});
```

## SVG Icons

All toolbar buttons use inline SVG icons for:
- Scalability
- Theme compatibility
- Fast rendering
- No external dependencies

Icons are defined in `src/config/panels.ts` and can be customized or replaced.

## Usage in Components

```typescript
import { WithEditor, useEditor } from "@grapesjs/react";

function MyComponent() {
  const editor = useEditor();
  
  const handleExport = () => {
    editor.runCommand('export-html');
  };
  
  return <button onClick={handleExport}>Export</button>;
}
```

## Accessibility

All toolbar buttons include:
- `aria-label` for screen readers
- `title` for tooltips
- Disabled state handling
- Keyboard navigation support

