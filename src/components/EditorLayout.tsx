import { Canvas, WithEditor } from "@grapesjs/react";
import { BlocksPanel } from "./BlocksPanel";
import { Toolbar } from "./Toolbar";
import { EditorControls } from "./EditorControls";
import { RightPanel } from "./RightPanel";
import { CodeEditor } from "./CodeEditor";
import { ResizablePanel } from "./ResizablePanel";
import { ValidationPanel } from "./ValidationPanel";
import { useView } from "@/contexts/ViewContext";
import { useState } from "react";
import "./EditorLayout.css";

export function EditorLayout() {
  const { viewMode } = useView();
  const [isValidationPanelVisible, setIsValidationPanelVisible] = useState(false);

  return (
    <div className="editor-container">
      <ResizablePanel position="left" minWidth={200} maxWidth={400} defaultWidth={280}>
        <BlocksPanel />
      </ResizablePanel>
      <div className="editor-main">
        <Toolbar />
        <EditorControls onValidateClick={() => setIsValidationPanelVisible(true)} />
        <div className={`editor-canvas-container view-${viewMode}`}>
          <div className="canvas-wrapper">
            <Canvas />
          </div>
          <div className="code-wrapper">
            <CodeEditor onValidateClick={() => setIsValidationPanelVisible(true)} />
          </div>
        </div>
      </div>
      <ResizablePanel position="right" minWidth={280} maxWidth={600} defaultWidth={340}>
        <RightPanel />
      </ResizablePanel>
      <WithEditor>
        <ValidationPanel 
          isVisible={isValidationPanelVisible} 
          onClose={() => setIsValidationPanelVisible(false)} 
        />
      </WithEditor>
    </div>
  );
}
