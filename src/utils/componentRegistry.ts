import type { Editor, AddComponentTypeOptions } from "grapesjs";

interface ComponentConfig extends AddComponentTypeOptions {
  id: string;
}

export function registerComponents(
  editor: Editor,
  components: ComponentConfig[]
): void {
  const componentManager = editor.Components;

  components.forEach(({ id, ...config }) => {
    componentManager.addType(id, config);
  });
}
