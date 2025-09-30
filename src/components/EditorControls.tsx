import { useEditor } from "@grapesjs/react";
import "./EditorControls.css";

export function EditorControls() {
  const editor = useEditor();

  const handlePreview = () => {
    const commands = editor.Commands;
    if (commands.isActive("preview")) {
      commands.stop("preview");
    } else {
      commands.run("preview");
    }
  };

  const handleExportHTML = () => {
    if (!editor) return;

    const html = editor.getHtml();
    const css = editor.getCss();

    const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Canvas Template</title>
  <style>
    ${css}
  </style>
</head>
<body>
  ${html}
</body>
</html>`;

    // Create blob and download
    const blob = new Blob([fullHtml], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "canvas-template.html";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleClear = () => {
    if (confirm("Are you sure you want to clear the canvas?")) {
      editor.setComponents("");
    }
  };

  return (
    <div className="editor-controls">
      <button
        className="control-btn"
        onClick={handlePreview}
        title="Preview Mode"
      >
        👁️ Preview
      </button>
      <button
        className="control-btn"
        onClick={handleExportHTML}
        title="Export HTML"
      >
        💾 Export HTML
      </button>
      <button
        className="control-btn danger"
        onClick={handleClear}
        title="Clear Canvas"
      >
        🗑️ Clear
      </button>
    </div>
  );
}
