import type { BlockProperties } from "grapesjs";

export const blockConfigurations: BlockProperties[] = [
  {
    id: 'section', // id is mandatory
    label: 'Section', // You can use HTML/SVG inside labels
    attributes: { class: 'gjs-block-section' },
    content: `<section>
      <h1>This is a simple title</h1>
      <div>This is just a Lorem text: Lorem ipsum dolor sit amet</div>
    </section>`,
  },
  {
    id: "text",
    label: "Text",
    category: "Basic",
    content: { type: "email-text" },
    attributes: { class: "fa fa-text" },
  },
  {
    id: "heading",
    label: "Heading",
    category: "Basic",
    content: { type: "email-heading" },
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
    id: "section",
    label: "Section",
    category: "Layout",
    content: { type: "email-section" },
    attributes: { class: "fa fa-square" },
  },
  {
    id: "two-columns",
    label: "2 Columns",
    category: "Layout",
    content: { type: "email-columns" },
    attributes: { class: "fa fa-columns" },
  },
  {
    id: "button",
    label: "Button",
    category: "Basic",
    content: { type: "email-button" },
    attributes: { class: "fa fa-hand-pointer" },
  },
];
