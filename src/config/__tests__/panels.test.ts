import { describe, it, expect, vi, beforeEach } from 'vitest';
import { setupCommandTelemetry, registerCommands } from '../panels';
import type { Editor } from 'grapesjs';

describe('Panels Configuration', () => {
  let mockEditor: Partial<Editor>;
  let onCallbacks: Record<string, Function[]>;

  beforeEach(() => {
    onCallbacks = {};
    
    mockEditor = {
      on: vi.fn((event: string, callback: Function) => {
        if (!onCallbacks[event]) {
          onCallbacks[event] = [];
        }
        onCallbacks[event].push(callback);
      }),
      Commands: {
        add: vi.fn(),
      } as any,
      UndoManager: {
        undo: vi.fn(),
        redo: vi.fn(),
      } as any,
      getHtml: vi.fn(() => '<div>Test</div>'),
      getCss: vi.fn(() => 'body { margin: 0; }'),
      setComponents: vi.fn(),
      setStyle: vi.fn(),
      runCommand: vi.fn(),
      stopCommand: vi.fn(),
    };
  });

  describe('setupCommandTelemetry', () => {
    it('registers telemetry event listeners', () => {
      setupCommandTelemetry(mockEditor as Editor);
      
      expect(mockEditor.on).toHaveBeenCalledWith('run', expect.any(Function));
      expect(mockEditor.on).toHaveBeenCalledWith('stop', expect.any(Function));
      expect(mockEditor.on).toHaveBeenCalledWith('abort', expect.any(Function));
    });

    it('logs command run events', () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      
      setupCommandTelemetry(mockEditor as Editor);
      
      // Trigger run event
      const runCallback = onCallbacks['run'][0];
      runCallback({ id: 'test-command' }, null, {});
      
      expect(consoleSpy).toHaveBeenCalledWith(
        '[Telemetry] Command started:',
        expect.objectContaining({
          command: 'test-command',
        })
      );
      
      consoleSpy.mockRestore();
    });

    it('logs command stop events', () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      
      setupCommandTelemetry(mockEditor as Editor);
      
      const stopCallback = onCallbacks['stop'][0];
      stopCallback({ id: 'test-command' }, null, {});
      
      expect(consoleSpy).toHaveBeenCalledWith(
        '[Telemetry] Command stopped:',
        expect.objectContaining({
          command: 'test-command',
        })
      );
      
      consoleSpy.mockRestore();
    });

    it('logs command abort events', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      
      setupCommandTelemetry(mockEditor as Editor);
      
      const abortCallback = onCallbacks['abort'][0];
      abortCallback({ id: 'test-command' }, null, {});
      
      expect(consoleSpy).toHaveBeenCalledWith(
        '[Telemetry] Command aborted:',
        expect.objectContaining({
          command: 'test-command',
        })
      );
      
      consoleSpy.mockRestore();
    });
  });

  describe('registerCommands', () => {
    it('registers all required commands', () => {
      registerCommands(mockEditor as Editor);
      
      expect(mockEditor.Commands?.add).toHaveBeenCalledWith('undo', expect.any(Object));
      expect(mockEditor.Commands?.add).toHaveBeenCalledWith('redo', expect.any(Object));
      expect(mockEditor.Commands?.add).toHaveBeenCalledWith('export-html', expect.any(Object));
      expect(mockEditor.Commands?.add).toHaveBeenCalledWith('preview', expect.any(Object));
      expect(mockEditor.Commands?.add).toHaveBeenCalledWith('clear-canvas', expect.any(Object));
      expect(mockEditor.Commands?.add).toHaveBeenCalledWith('fullscreen', expect.any(Object));
    });

    it('undo command calls UndoManager.undo', () => {
      registerCommands(mockEditor as Editor);
      
      const undoCommand = (mockEditor.Commands?.add as any).mock.calls.find(
        (call: any[]) => call[0] === 'undo'
      )[1];
      
      undoCommand.run(mockEditor);
      
      expect(mockEditor.UndoManager?.undo).toHaveBeenCalled();
    });

    it('redo command calls UndoManager.redo', () => {
      registerCommands(mockEditor as Editor);
      
      const redoCommand = (mockEditor.Commands?.add as any).mock.calls.find(
        (call: any[]) => call[0] === 'redo'
      )[1];
      
      redoCommand.run(mockEditor);
      
      expect(mockEditor.UndoManager?.redo).toHaveBeenCalled();
    });

    it('clear-canvas command clears components and styles', () => {
      global.confirm = vi.fn(() => true);
      
      registerCommands(mockEditor as Editor);
      
      const clearCommand = (mockEditor.Commands?.add as any).mock.calls.find(
        (call: any[]) => call[0] === 'clear-canvas'
      )[1];
      
      clearCommand.run(mockEditor);
      
      expect(global.confirm).toHaveBeenCalled();
      expect(mockEditor.setComponents).toHaveBeenCalledWith('');
      expect(mockEditor.setStyle).toHaveBeenCalledWith('');
    });

    it('export-html generates complete HTML document', () => {
      // Mock createObjectURL and createElement
      global.URL.createObjectURL = vi.fn(() => 'blob:url');
      global.URL.revokeObjectURL = vi.fn();
      const mockLink = {
        href: '',
        download: '',
        click: vi.fn(),
      };
      document.createElement = vi.fn(() => mockLink as any);
      
      registerCommands(mockEditor as Editor);
      
      const exportCommand = (mockEditor.Commands?.add as any).mock.calls.find(
        (call: any[]) => call[0] === 'export-html'
      )[1];
      
      exportCommand.run(mockEditor);
      
      expect(mockEditor.getHtml).toHaveBeenCalled();
      expect(mockEditor.getCss).toHaveBeenCalled();
      expect(mockLink.click).toHaveBeenCalled();
    });
  });
});

