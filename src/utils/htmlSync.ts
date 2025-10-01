// utilities for composing and applying full HTML documents with GrapesJS editor
import type { Editor } from "grapesjs";

export function composeFullHtml(html: string, css: string) {
  return `<!DOCTYPE html>
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
}

export function getEditorHtmlDocument(editor: Editor) {
  const html = editor.getHtml();
  const css = editor.getCss();
  return composeFullHtml(html, css);
}

export function applyHtmlDocumentToEditor(editor: Editor, fullHtml: string) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(fullHtml, "text/html");

  const styleElements = doc.querySelectorAll("style");
  let cssContent = "";
  styleElements.forEach((style) => {
    cssContent += style.textContent || "";
  });

  const bodyHtml = doc.body.innerHTML;

  editor.setComponents(bodyHtml);
  editor.setStyle(cssContent);
}
