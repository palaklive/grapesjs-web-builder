import type { AddComponentTypeOptions } from "grapesjs";

interface ComponentConfig extends AddComponentTypeOptions {
  id: string;
}

export const componentDefinitions: ComponentConfig[] = [
  {
    id: "email-button",
    model: {
      defaults: {
        tagName: "a",
        draggable: true,
        droppable: false,
        editable: true,
        content: "Click Me",
        attributes: { href: "#", class: "email-button" },
        style: {
          display: "inline-block",
          padding: "12px 24px",
          "background-color": "#007bff",
          color: "white",
          "text-decoration": "none",
          "border-radius": "4px",
          "font-weight": "bold",
          "text-align": "center",
        },
        traits: [
          {
            type: "text",
            name: "href",
            label: "Link URL",
          },
          {
            type: "color",
            name: "background-color",
            label: "Background Color",
          },
          {
            type: "color",
            name: "color",
            label: "Text Color",
          },
          {
            type: "text",
            name: "padding",
            label: "Padding",
          },
          {
            type: "text",
            name: "border-radius",
            label: "Border Radius",
          },
        ],
      },
    },
  },
  {
    id: "email-section",
    model: {
      defaults: {
        tagName: "section",
        draggable: true,
        droppable: true,
        attributes: { class: "email-section" },
        styles: `
          .email-section {
            padding: 40px 20px;
            background-color: #f5f5f5;
          }
        `,
        traits: [
          {
            type: "color",
            name: "background-color",
            label: "Background Color",
          },
          {
            type: "text",
            name: "padding",
            label: "Padding",
          },
        ],
      },
    },
  },
  {
    id: "email-text",
    model: {
      defaults: {
        tagName: "div",
        draggable: true,
        droppable: false,
        editable: true,
        attributes: { class: "email-text" },
        content: "Insert your text here",
        styles: `
          .email-text {
            padding: 10px;
            font-size: 14px;
            line-height: 1.6;
          }
        `,
        traits: [
          {
            type: "color",
            name: "color",
            label: "Text Color",
          },
          {
            type: "select",
            name: "font-size",
            label: "Font Size",
            options: [
              { id: "12px", value: "12px", name: "Small" },
              { id: "14px", value: "14px", name: "Normal" },
              { id: "16px", value: "16px", name: "Medium" },
              { id: "18px", value: "18px", name: "Large" },
              { id: "24px", value: "24px", name: "Extra Large" },
            ],
          },
        ],
      },
    },
  },
  {
    id: "email-heading",
    model: {
      defaults: {
        tagName: "h2",
        draggable: true,
        droppable: false,
        editable: true,
        attributes: { class: "email-heading" },
        content: "Heading Text",
        styles: `
          .email-heading {
            padding: 10px;
            margin: 0;
            font-weight: bold;
          }
        `,
        traits: [
          {
            type: "select",
            name: "tagName",
            label: "Heading Level",
            options: [
              { id: "h1", value: "h1", name: "H1" },
              { id: "h2", value: "h2", name: "H2" },
              { id: "h3", value: "h3", name: "H3" },
              { id: "h4", value: "h4", name: "H4" },
              { id: "h5", value: "h5", name: "H5" },
              { id: "h6", value: "h6", name: "H6" },
            ],
          },
          {
            type: "color",
            name: "color",
            label: "Text Color",
          },
        ],
      },
    },
  },
  {
    id: "email-columns",
    model: {
      defaults: {
        tagName: "div",
        draggable: true,
        droppable: true,
        attributes: { class: "email-columns" },
        styles: `
          .email-columns {
            display: flex;
            gap: 20px;
            padding: 20px;
          }
          .email-column {
            flex: 1;
            padding: 20px;
            background-color: #f9f9f9;
          }
        `,
        components: [
          {
            tagName: "div",
            attributes: { class: "email-column" },
            content: "Column 1 content",
          },
          {
            tagName: "div",
            attributes: { class: "email-column" },
            content: "Column 2 content",
          },
        ],
        traits: [
          {
            type: "number",
            name: "gap",
            label: "Gap (px)",
            min: 0,
            max: 100,
          },
        ],
      },
    },
  },
];
