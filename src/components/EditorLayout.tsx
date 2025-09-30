import { Canvas } from "@grapesjs/react";
import { BlocksPanel } from "./BlocksPanel";
import { EditorControls } from "./EditorControls";
import { RightPanel } from "./RightPanel";
import "./EditorLayout.css";

export function EditorLayout() {
  return (
    <div className="editor-container">
      <BlocksPanel />
      <div className="editor-main">
        <EditorControls />
        <div className="editor-canvas-container">
          <Canvas />
        </div>
      </div>
      <RightPanel />
    </div>
  );
}
