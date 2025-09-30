import { WithEditor, useEditor } from "@grapesjs/react";
import { useState } from "react";
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
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [htmlCode, setHtmlCode] = useState("");
  const [copied, setCopied] = useState(false);

  const handlePreviewHTML = () => {
    if (!editor) return;

    const html = editor.getHtml();
    const css = editor.getCss();

    const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Email Template</title>
  <style>
    ${css}
  </style>
</head>
<body>
  ${html}
</body>
</html>`;

    setHtmlCode(fullHtml);
    setShowPreviewModal(true);
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
    <>
      <div className="editor-controls">
        <button
          className="control-btn primary"
          onClick={handlePreviewHTML}
          title="Preview HTML Code"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M5 11L2 8l3-3M11 5l3 3-3 3M9 2L7 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          Preview HTML
        </button>
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

      {showPreviewModal && (
        <div className="modal-overlay" onClick={() => setShowPreviewModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>HTML Preview</h3>
              <button
                className="modal-close"
                onClick={() => setShowPreviewModal(false)}
              >
                ✕
              </button>
            </div>
            <div className="modal-body">
              <pre className="code-preview">
                <code>{htmlCode}</code>
              </pre>
            </div>
            <div className="modal-footer">
              <button
                className="modal-btn copy-btn"
                onClick={handleCopyToClipboard}
              >
                {copied ? "✓ Copied!" : "📋 Copy to Clipboard"}
              </button>
              <button
                className="modal-btn close-btn"
                onClick={() => setShowPreviewModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
