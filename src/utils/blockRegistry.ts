import { Editor, type BlockProperties } from "grapesjs";

export function registerBlocks(
  editor: Editor,
  blocks: BlockProperties[]
): void {
  const blockManager = editor.Blocks;

  blocks.forEach((block) => {
    blockManager.add(block.id || "", block);
  });
}
