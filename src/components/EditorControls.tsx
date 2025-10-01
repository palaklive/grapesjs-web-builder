import { WithEditor, useEditor } from "@grapesjs/react";
import { useState, useEffect, useCallback } from "react";
import { useView } from "@/contexts/ViewContext";
import type { ViewMode } from "@/contexts/ViewContext";
import prettier from "prettier/standalone";
import htmlParser from "prettier/plugins/html";
import { getEditorHtmlDocument, applyHtmlDocumentToEditor } from "@/utils/htmlSync";
import "./EditorControls.css";

export function EditorControls() {
  return (
    <WithEditor>
      <EditorControlsContent />
    </WithEditor>
  );
}

function EditorControlsContent() {
  const editor = useEditor();
  const { viewMode, setViewMode, htmlCode, setHtmlCode } = useView();
  const [copied, setCopied] = useState(false);

  const syncCanvasToHtml = useCallback(async () => {
    if (!editor) return;

    const fullHtml = getEditorHtmlDocument(editor);

    try {
      const prettified = await prettier.format(fullHtml, {
        parser: 'html',
        plugins: [htmlParser],
        printWidth: 80,
        tabWidth: 2,
      });
      setHtmlCode(prettified);
    } catch (error) {
      console.error('Error formatting HTML:', error);
      setHtmlCode(fullHtml);
    }
  }, [editor, setHtmlCode]);

  // Sync canvas to code when switching to code view or when editor becomes available
  useEffect(() => {
    if (viewMode !== 'code') return;
    syncCanvasToHtml();
  }, [viewMode, syncCanvasToHtml]);

  // Listen for canvas changes and keep code updated while in canvas view
  useEffect(() => {
    if (!editor || viewMode !== 'canvas') return;

    const handleUpdate = () => {
      void syncCanvasToHtml();
    };

    handleUpdate();

    editor.on('component:add', handleUpdate);
    editor.on('component:remove', handleUpdate);
    editor.on('component:update', handleUpdate);
    editor.on('style:update', handleUpdate);

    return () => {
      editor.off('component:add', handleUpdate);
      editor.off('component:remove', handleUpdate);
      editor.off('component:update', handleUpdate);
      editor.off('style:update', handleUpdate);
    };
  }, [editor, viewMode, syncCanvasToHtml]);

  const handleViewChange = async (mode: ViewMode) => {
    if (mode === viewMode) return;

    if (mode === "code") {
      await syncCanvasToHtml();
    } else if (mode === "canvas" && editor) {
      try {
        applyHtmlDocumentToEditor(editor, htmlCode);
      } catch (error) {
        console.error("Error applying HTML to editor:", error);
        alert("Could not apply the HTML code. Please ensure the markup is valid.");
        return;
      }
    }

    setViewMode(mode);
    setCopied(false);
  };

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(htmlCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleClear = () => {
    if (confirm("Are you sure you want to clear the canvas?")) {
      editor.setComponents("");
    }
  };

  return (
    <div className="editor-controls">
      <div className={`view-toggle view-${viewMode}`} role="tablist" aria-label="Editor view mode">
        <span className="view-toggle-glider" aria-hidden="true" />
        <button
          type="button"
          role="tab"
          aria-selected={viewMode === 'canvas'}
          className={`view-toggle-btn ${viewMode === 'canvas' ? 'active' : ''}`}
          onClick={() => void handleViewChange('canvas')}
          title="Switch to Canvas view"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M2 3h12M2 8h12M2 13h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <span>Canvas</span>
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={viewMode === 'code'}
          className={`view-toggle-btn ${viewMode === 'code' ? 'active' : ''}`}
          onClick={() => void handleViewChange('code')}
          title="Switch to Code view"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M5 11L2 8l3-3M11 5l3 3-3 3M9 2L7 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <span>Code</span>
        </button>
      </div>

      {viewMode === 'code' && (
        <button
          className="control-btn ghost"
          onClick={handleCopyToClipboard}
          title="Copy HTML to Clipboard"
        >
          {copied ? (
            <>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M13 4L6 11L3 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              Copied!
            </>
          ) : (
            <>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <rect x="4" y="4" width="8" height="10" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                <path d="M6 4V2h6v8" stroke="currentColor" strokeWidth="1.5" fill="none"/>
              </svg>
              Copy
            </>
          )}
        </button>
      )}
      
      <button
        className="control-btn danger"
        onClick={handleClear}
        title="Clear Canvas"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M3 4h10M6 4V3a1 1 0 011-1h2a1 1 0 011 1v1M5 4v9a1 1 0 001 1h4a1 1 0 001-1V4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
        Clear
      </button>
    </div>
  );
}
