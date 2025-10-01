import { Canvas } from "@grapesjs/react";
import { BlocksPanel } from "./BlocksPanel";
import { EditorControls } from "./EditorControls";
import { RightPanel } from "./RightPanel";
import { CodeEditor } from "./CodeEditor";
import { useView } from "@/contexts/ViewContext";
import "./EditorLayout.css";

export function EditorLayout() {
  const { viewMode } = useView();

  return (
    <div className="editor-container">
      <BlocksPanel />
      <div className="editor-main">
        <EditorControls />
        <div className={`editor-canvas-container view-${viewMode}`}>
          <div className="canvas-wrapper">
            <Canvas />
          </div>
          <div className="code-wrapper">
            <CodeEditor />
          </div>
        </div>
      </div>
      <RightPanel />
    </div>
  );
}
