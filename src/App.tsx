import { EditorLayout } from "@/components/EditorLayout";
import { blockConfigurations } from "@/config/blocks";
import { componentDefinitions } from "@/config/components";
import { editorConfig } from "@/config/editorConfig";
import { registerBlocks } from "@/utils/blockRegistry";
import { registerComponents } from "@/utils/componentRegistry";
import { ViewProvider } from "@/contexts/ViewContext";
import { PanelProvider } from "@/contexts/PanelContext";
import { registerCommands, setupCommandTelemetry } from "@/config/panels";
import { registerCustomTraits } from "@/config/customTraits";
import { enhanceComponentTraits } from "@/config/componentTraits";
import GjsEditor from "@grapesjs/react";
import grapesjs, { type Editor } from "grapesjs";

export default function CustomEditor() {
  const handleEditorLoad = (editor: Editor) => {
    console.log("Editor loaded", { editor });
    
    // Register components and blocks
    registerComponents(editor, componentDefinitions);
    registerBlocks(editor, blockConfigurations);
    
    // Register custom commands and setup telemetry
    registerCommands(editor);
    setupCommandTelemetry(editor);
    
    // Register custom trait types
    registerCustomTraits(editor);
    
    // Enhance component traits
    enhanceComponentTraits(editor);
    
    // Configure default toolbar for all components
    editor.on('component:selected', (component) => {
      // Set default toolbar if component doesn't have one
      if (!component.get('toolbar')) {
        component.set('toolbar', [
          {
            attributes: { class: 'fa fa-arrow-up', title: 'Select Parent' },
            command: 'core:component-outline',
          },
          {
            attributes: { class: 'fa fa-paint-brush', title: 'Open Styles' },
            command: 'open-styles-panel',
          },
          {
            attributes: { class: 'fa fa-clone', title: 'Clone' },
            command: 'tlb-clone',
          },
          {
            attributes: { class: 'fa fa-trash', title: 'Delete' },
            command: 'tlb-delete',
          },
        ]);
      }
    });
    
    // Enable undo manager
    editor.UndoManager.clear();
    
    console.log("Editor initialization complete");
  };

  return (
    <GjsEditor
      id="gjs"
      grapesjs={grapesjs}
      grapesjsCss="https://unpkg.com/grapesjs/dist/css/grapes.min.css"
      onEditor={handleEditorLoad}
      options={editorConfig}
    >
      <ViewProvider>
        <PanelProvider>
          <EditorLayout />
        </PanelProvider>
      </ViewProvider>
    </GjsEditor>
  );
}
