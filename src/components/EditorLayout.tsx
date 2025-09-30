import { Canvas } from "@grapesjs/react";
import { BlocksPanel } from "./BlocksPanel";
import "./EditorLayout.css";

export function EditorLayout() {
  return (
    <div className="editor-container">
      <BlocksPanel />
      <div className="editor-main">
        <div className="editor-canvas-container">
          <Canvas />
        </div>
      </div>
    </div>
  );
}
