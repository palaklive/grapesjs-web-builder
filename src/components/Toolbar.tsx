import { WithEditor, useEditor } from "@grapesjs/react";
import { useEffect, useState } from "react";
import { icons } from "@/config/panels";
import "./Toolbar.css";

export function Toolbar() {
  return (
    <WithEditor>
      <ToolbarContent />
    </WithEditor>
  );
}

function ToolbarContent() {
  const editor = useEditor();
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  useEffect(() => {
    if (!editor) return;

    const updateUndoRedoState = () => {
      const um = editor.UndoManager;
      setCanUndo(um.hasUndo());
      setCanRedo(um.hasRedo());
    };

    // Initial state
    updateUndoRedoState();

    // Listen for changes
    editor.on('change:changesCount', updateUndoRedoState);

    return () => {
      editor.off('change:changesCount', updateUndoRedoState);
    };
  }, [editor]);

  const runCommand = (commandId: string) => {
    if (editor) {
      editor.runCommand(commandId);
    }
  };

  return (
    <div className="toolbar">
      <div className="toolbar-group">
        <button
          className="toolbar-btn"
          onClick={() => runCommand('undo')}
          disabled={!canUndo}
          title="Undo (Ctrl+Z)"
          aria-label="Undo"
        >
          <span dangerouslySetInnerHTML={{ __html: icons.undo }} />
        </button>
        <button
          className="toolbar-btn"
          onClick={() => runCommand('redo')}
          disabled={!canRedo}
          title="Redo (Ctrl+Y)"
          aria-label="Redo"
        >
          <span dangerouslySetInnerHTML={{ __html: icons.redo }} />
        </button>
      </div>

      <div className="toolbar-group">
        <button
          className="toolbar-btn"
          onClick={() => runCommand('preview')}
          title="Preview in New Tab"
          aria-label="Preview"
        >
          <span dangerouslySetInnerHTML={{ __html: icons.preview }} />
          <span className="toolbar-btn-label">Preview</span>
        </button>
        <button
          className="toolbar-btn primary"
          onClick={() => runCommand('export-html')}
          title="Export HTML File"
          aria-label="Export HTML"
        >
          <span dangerouslySetInnerHTML={{ __html: icons.export }} />
          <span className="toolbar-btn-label">Export</span>
        </button>
      </div>

      <div className="toolbar-group">
        <button
          className="toolbar-btn"
          onClick={() => runCommand('fullscreen')}
          title="Toggle Fullscreen"
          aria-label="Toggle Fullscreen"
        >
          <span dangerouslySetInnerHTML={{ __html: icons.fullscreen }} />
        </button>
        <button
          className="toolbar-btn danger"
          onClick={() => runCommand('clear-canvas')}
          title="Clear Canvas"
          aria-label="Clear Canvas"
        >
          <span dangerouslySetInnerHTML={{ __html: icons.clear }} />
        </button>
      </div>
    </div>
  );
}

