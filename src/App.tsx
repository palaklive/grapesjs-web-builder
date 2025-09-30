import { EditorLayout } from "@/components/EditorLayout";
import { blockConfigurations } from "@/config/blocks";
import { componentDefinitions } from "@/config/components";
import { editorConfig } from "@/config/editorConfig";
import { registerBlocks } from "@/utils/blockRegistry";
import { registerComponents } from "@/utils/componentRegistry";
import GjsEditor from "@grapesjs/react";
import grapesjs, { type Editor } from "grapesjs";

export default function CustomEditor() {
  const handleEditorLoad = (editor: Editor) => {
    console.log("Editor loaded", { editor });
    registerComponents(editor, componentDefinitions);
    registerBlocks(editor, blockConfigurations);
  };

  return (
    <GjsEditor
      id="gjs"
      grapesjs={grapesjs}
      grapesjsCss="https://unpkg.com/grapesjs/dist/css/grapes.min.css"
      onEditor={handleEditorLoad}
      options={editorConfig}
    >
      <EditorLayout />
    </GjsEditor>
  );
}
