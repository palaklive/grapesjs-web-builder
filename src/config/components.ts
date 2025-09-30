import type { AddComponentTypeOptions } from "grapesjs";

interface ComponentConfig extends AddComponentTypeOptions {
  id: string;
}

// Custom components for droppable layouts
export const componentDefinitions: ComponentConfig[] = [
  {
    id: "two-columns",
    model: {
      defaults: {
        tagName: "div",
        draggable: true,
        droppable: true,
        attributes: { class: "columns-container" },
        styles: `
          .columns-container {
            display: flex;
            gap: 20px;
            padding: 20px;
          }
          .column {
            flex: 1;
            padding: 20px;
            background-color: #f9f9f9;
            min-height: 100px;
          }
        `,
        components: [
          {
            tagName: "div",
            attributes: { class: "column" },
            draggable: false,
            droppable: true,
            content: "Drop content here",
          },
          {
            tagName: "div",
            attributes: { class: "column" },
            draggable: false,
            droppable: true,
            content: "Drop content here",
          },
        ],
      },
    },
  },
];