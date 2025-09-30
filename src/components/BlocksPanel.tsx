import type { JSX } from "react";
import { Block } from "grapesjs";
import { BlocksProvider } from "@grapesjs/react";
import "./BlocksPanel.css";

export function BlocksPanel() {
  return (
    <div className="editor-sidebar">
      <BlocksProvider>
        {({ blocks, dragStart, dragStop }) => (
          <div className="blocks-panel">
            <h3 className="blocks-panel-title">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="title-icon">
                <path d="M3 4h14M3 10h14M3 16h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              Blocks
            </h3>
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

const getBlockIcon = (blockId: string) => {
  const icons: Record<string, JSX.Element> = {
    text: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M4 7h16M4 12h10M4 17h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
    heading: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M4 7v10M10 7v10M4 12h6M16 9v6m0 0v-6m0 6h4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
      </svg>
    ),
    image: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
        <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor"/>
        <path d="M21 15l-5-5L5 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
    button: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <rect x="4" y="8" width="16" height="8" rx="2" stroke="currentColor" strokeWidth="2"/>
        <path d="M9 12h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
    section: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="6" width="18" height="12" rx="2" stroke="currentColor" strokeWidth="2"/>
        <path d="M3 10h18" stroke="currentColor" strokeWidth="2"/>
      </svg>
    ),
    "two-columns": (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="4" width="8" height="16" rx="1" stroke="currentColor" strokeWidth="2"/>
        <rect x="13" y="4" width="8" height="16" rx="1" stroke="currentColor" strokeWidth="2"/>
      </svg>
    ),
  };

  return icons[blockId] || (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
    </svg>
  );
};

function BlockItem({ block, onDragStart, onDragStop }: BlockItemProps) {
  const blockId = block.getId();
  const category = block.get('category');
  const categoryLabel = typeof category === 'string' ? category : 'Basic';
  
  return (
    <div
      draggable
      onDragStart={(ev) => onDragStart(block, ev.nativeEvent)}
      onDragEnd={() => onDragStop()}
      className="block-item"
    >
      <div className="block-icon">
        {getBlockIcon(blockId)}
      </div>
      <div className="block-content">
        <div className="block-label">{block.getLabel()}</div>
        <div className="block-category">{categoryLabel}</div>
      </div>
    </div>
  );
}
