import type { EditorConfig } from "grapesjs";

export const editorConfig: EditorConfig = {
  height: "100vh",
  storageManager: false,
  components: "<h1>Welcome to template builder</h1>",
  canvas: {
    styles: [
      // Add any global styles for the canvas here
    ],
  },
  // Enable panels and layers functionality
  layerManager: {
    appendTo: "",
  },
  selectorManager: {
    appendTo: "",
  },
  styleManager: {
    appendTo: "",
    sectors: [
      {
        name: "Typography",
        open: true,
        properties: [
          "font-family",
          "font-size",
          "font-weight",
          "letter-spacing",
          "color",
          "line-height",
          "text-align",
        ],
      },
      {
        name: "Dimension",
        open: false,
        properties: [
          "width",
          "height",
          "max-width",
          "min-height",
          "margin",
          "padding",
        ],
      },
      {
        name: "Background",
        open: false,
        properties: ["background-color", "background"],
      },
      {
        name: "Border",
        open: false,
        properties: [
          "border-radius",
          "border",
          "border-width",
          "border-style",
          "border-color",
        ],
      },
    ],
  },
  traitManager: {
    appendTo: "",
  },
};
