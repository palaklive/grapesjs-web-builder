import { WithEditor, useEditor } from "@grapesjs/react";
import { useView } from "@/contexts/ViewContext";
import { useEffect, useRef, useState } from "react";
import { applyHtmlDocumentToEditor } from "@/utils/htmlSync";
import "./CodeEditor.css";

export function CodeEditor() {
  return (
    <WithEditor>
      <CodeEditorContent />
    </WithEditor>
  );
}

function CodeEditorContent() {
  const editor = useEditor();
  const { viewMode, htmlCode, setHtmlCode } = useView();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const applyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastAppliedRef = useRef<string>("");
  const previousViewModeRef = useRef(viewMode);
  const [applyError, setApplyError] = useState<string | null>(null);

  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setHtmlCode(e.target.value);
  };

  useEffect(() => {
    if (viewMode === "code" && previousViewModeRef.current !== "code") {
      lastAppliedRef.current = htmlCode;
    }

    previousViewModeRef.current = viewMode;
  }, [viewMode, htmlCode]);

  useEffect(() => {
    if (!editor || viewMode !== "code") {
      return;
    }

    if (applyTimeoutRef.current) {
      clearTimeout(applyTimeoutRef.current);
    }

    applyTimeoutRef.current = setTimeout(() => {
      if (lastAppliedRef.current === htmlCode) {
        return;
      }

      try {
        applyHtmlDocumentToEditor(editor, htmlCode);
        lastAppliedRef.current = htmlCode;
        setApplyError(null);
      } catch (error) {
        console.error("Error parsing HTML:", error);
        setApplyError("Unable to sync changes. Please check your HTML.");
      }
    }, 400);

    return () => {
      if (applyTimeoutRef.current) {
        clearTimeout(applyTimeoutRef.current);
      }
    };
  }, [editor, htmlCode, viewMode]);

  useEffect(() => {
    return () => {
      if (applyTimeoutRef.current) {
        clearTimeout(applyTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="code-editor-container">
      <div className="code-editor-header">
        <span className="code-editor-title">HTML Code Editor</span>
      </div>
      <textarea
        ref={textareaRef}
        className="code-editor-textarea"
        value={htmlCode}
        onChange={handleCodeChange}
        spellCheck={false}
        placeholder="Your HTML code will appear here..."
      />
      <div className="code-editor-footer">
        <span className={`code-hint${applyError ? " code-hint-error" : ""}`}>
          {applyError ? `⚠️ ${applyError}` : "Auto-syncs with the canvas in real time"}
        </span>
      </div>
    </div>
  );
}

