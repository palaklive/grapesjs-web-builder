import type { BlockProperties } from "grapesjs";

export const blockConfigurations: BlockProperties[] = [
  // Basic Blocks
  {
    id: "text",
    label: "Text",
    category: "Basic",
    content: `<div style="padding: 10px; font-size: 14px; line-height: 1.6;">Insert your text here</div>`,
    attributes: { class: "fa fa-text" },
  },
  {
    id: "heading",
    label: "Heading",
    category: "Basic",
    content: `<h2 style="padding: 10px; margin: 0; font-weight: bold;">Heading Text</h2>`,
    attributes: { class: "fa fa-header" },
  },
  {
    id: "image",
    label: "Image",
    category: "Basic",
    content: {
      type: "image",
      style: { width: "150px", height: "auto" },
      attributes: { src: "https://picsum.photos/150/150" },
    },
    activate: true,
    attributes: { class: "fa fa-image" },
  },
  {
    id: "button",
    label: "Button",
    category: "Basic",
    content: `<button class="web-button">Click Me</button>`,
    attributes: { class: "fa fa-hand-pointer" },
  },
  
  // Layout Blocks
  {
    id: "section",
    label: "Section",
    category: "Layout",
    content: `<section style="padding: 40px 20px; background-color: #f5f5f5; text-align: center;">
      <div style="max-width: 600px; margin: 0 auto;">Section content goes here</div>
    </section>`,
    attributes: { class: "fa fa-square" },
  },
  {
    id: "two-columns",
    label: "2 Columns",
    category: "Layout",
    content: { type: "two-columns" },
    attributes: { class: "fa fa-columns" },
  },
];