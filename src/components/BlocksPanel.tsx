import { Block } from "grapesjs";
import { BlocksProvider } from "@grapesjs/react";
import "./BlocksPanel.css";

export function BlocksPanel() {
  return (
    <div className="editor-sidebar">
      <BlocksProvider>
        {({ blocks, dragStart, dragStop }) => (
          <div className="blocks-panel">
            <h3 className="blocks-panel-title">Blocks</h3>
            {blocks.map((block: Block) => (
              <BlockItem
                key={block.getId()}
                block={block}
                onDragStart={dragStart}
                onDragStop={dragStop}
              />
            ))}
          </div>
        )}
      </BlocksProvider>
    </div>
  );
}

interface BlockItemProps {
  block: Block;
  onDragStart: (block: Block, ev?: Event) => void;
  onDragStop: (cancel?: boolean) => void;
}

function BlockItem({ block, onDragStart, onDragStop }: BlockItemProps) {
  return (
    <div
      draggable
      onDragStart={(ev) => onDragStart(block, ev.nativeEvent)}
      onDragEnd={() => onDragStop()}
      className="block-item"
    >
      <div className="block-label">{block.getLabel()}</div>
    </div>
  );
}
