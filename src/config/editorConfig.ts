import type { EditorConfig } from "grapesjs";
import { designTokens } from "./designTokens";

export const editorConfig: EditorConfig = {
  height: "100vh",
  storageManager: false,
  components: "<h1>Welcome to template builder</h1>",
  canvas: {
    // Canvas configuration
    styles: [
      `
        /* Base styles for canvas */
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
          line-height: 1.6;
          color: #1e293b;
          background: #ffffff;
          margin: 0;
          padding: 20px;
        }
        
        /* Typography */
        h1, h2, h3, h4, h5, h6 {
          font-weight: 600;
          line-height: 1.3;
          color: #1e293b;
          margin: 0 0 16px 0;
        }
        
        h1 { font-size: 2.5em; }
        h2 { font-size: 2em; }
        h3 { font-size: 1.75em; }
        h4 { font-size: 1.5em; }
        h5 { font-size: 1.25em; }
        h6 { font-size: 1em; }
        
        p {
          margin: 0 0 16px 0;
        }
        
        /* Links */
        a {
          color: #6366f1;
          text-decoration: none;
          transition: color 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          font-weight: 500;
        }
        
        a:hover {
          color: #4f46e5;
          text-decoration: underline;
        }
        
        /* Modern Button Styles - Default for all buttons */
        button {
          font-family: -apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
          padding: 12px 24px;
          background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
          color: #ffffff;
          border: none;
          border-radius: 10px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.08), 0 1px 2px 0 rgba(0, 0, 0, 0.04);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          line-height: 1.5;
        }
        
        button:hover {
          background: linear-gradient(135deg, #4f46e5 0%, #6366f1 100%);
          transform: translateY(-2px);
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.08), 0 2px 4px -1px rgba(0, 0, 0, 0.04), 0 4px 16px rgba(99, 102, 241, 0.15);
        }
        
        button:active {
          transform: translateY(0);
          box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
        }
        
        /* Email button class (with same styling) */
        .email-button {
          font-family: -apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
          padding: 12px 24px;
          background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
          color: #ffffff;
          border: none;
          border-radius: 10px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.08), 0 1px 2px 0 rgba(0, 0, 0, 0.04);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          line-height: 1.5;
        }
        
        .email-button:hover {
          background: linear-gradient(135deg, #4f46e5 0%, #6366f1 100%);
          transform: translateY(-2px);
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.08), 0 2px 4px -1px rgba(0, 0, 0, 0.04), 0 4px 16px rgba(99, 102, 241, 0.15);
        }
        
        .email-button:active {
          transform: translateY(0);
          box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
        }
        
        /* Image styling */
        img {
          max-width: 100%;
          height: auto;
          display: block;
        }
        
        /* Section styling */
        section {
          margin: 0 0 24px 0;
        }
      `,
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
          {
            name: "Font Family",
            property: "font-family",
            type: "select",
            defaults: designTokens.typography.fontFamilies[0].value,
            options: designTokens.typography.fontFamilies.map(f => ({ 
              id: f.value, 
              label: f.name 
            })),
          },
          {
            name: "Font Size",
            property: "font-size",
            type: "select",
            defaults: "16px",
            options: designTokens.typography.fontSizes.map(s => ({ 
              id: s.value, 
              label: s.name 
            })),
          },
          {
            name: "Font Weight",
            property: "font-weight",
            type: "select",
            defaults: "400",
            options: designTokens.typography.fontWeights.map(w => ({ 
              id: w.value, 
              label: w.name 
            })),
          },
          {
            name: "Line Height",
            property: "line-height",
            type: "select",
            defaults: "1.5",
            options: designTokens.typography.lineHeights.map(l => ({ 
              id: l.value, 
              label: l.name 
            })),
          },
          {
            name: "Text Color",
            property: "color",
            type: "color",
          },
          {
            name: "Text Align",
            property: "text-align",
            type: "radio",
            defaults: "left",
            options: [
              { id: "left", label: "Left" },
              { id: "center", label: "Center" },
              { id: "right", label: "Right" },
              { id: "justify", label: "Justify" },
            ],
          },
          {
            name: "Letter Spacing",
            property: "letter-spacing",
            type: "integer",
            units: ["px", "em"],
            defaults: "0",
          },
        ],
      },
      {
        name: "Dimension",
        open: false,
        properties: [
          {
            name: "Width",
            property: "width",
            type: "integer",
            units: ["px", "%", "auto", "vw"],
            defaults: "auto",
          },
          {
            name: "Height",
            property: "height",
            type: "integer",
            units: ["px", "%", "auto", "vh"],
            defaults: "auto",
          },
          {
            name: "Max Width",
            property: "max-width",
            type: "integer",
            units: ["px", "%", "none"],
            defaults: "none",
          },
          {
            name: "Min Height",
            property: "min-height",
            type: "integer",
            units: ["px", "%", "auto"],
            defaults: "auto",
          },
        ],
      },
      {
        name: "Spacing",
        open: false,
        properties: [
          {
            name: "Padding",
            property: "padding",
            type: "composite",
            properties: [
              { name: "Top", property: "padding-top", type: "integer", units: ["px"], defaults: "0" },
              { name: "Right", property: "padding-right", type: "integer", units: ["px"], defaults: "0" },
              { name: "Bottom", property: "padding-bottom", type: "integer", units: ["px"], defaults: "0" },
              { name: "Left", property: "padding-left", type: "integer", units: ["px"], defaults: "0" },
            ],
          },
          {
            name: "Margin",
            property: "margin",
            type: "composite",
            properties: [
              { name: "Top", property: "margin-top", type: "integer", units: ["px", "auto"], defaults: "0" },
              { name: "Right", property: "margin-right", type: "integer", units: ["px", "auto"], defaults: "0" },
              { name: "Bottom", property: "margin-bottom", type: "integer", units: ["px", "auto"], defaults: "0" },
              { name: "Left", property: "margin-left", type: "integer", units: ["px", "auto"], defaults: "0" },
            ],
          },
        ],
      },
      {
        name: "Colors",
        open: false,
        properties: [
          {
            name: "Background Color",
            property: "background-color",
            type: "color",
          },
          {
            name: "Text Color",
            property: "color",
            type: "color",
          },
          {
            name: "Border Color",
            property: "border-color",
            type: "color",
          },
        ],
      },
      {
        name: "Border",
        open: false,
        properties: [
          {
            name: "Border Radius",
            property: "border-radius",
            type: "select",
            defaults: "0",
            options: designTokens.borders.radius.map(r => ({ 
              id: r.value, 
              label: r.name 
            })),
          },
          {
            name: "Border Width",
            property: "border-width",
            type: "select",
            defaults: "0",
            options: designTokens.borders.widths.map(w => ({ 
              id: w.value, 
              label: w.name 
            })),
          },
          {
            name: "Border Style",
            property: "border-style",
            type: "select",
            defaults: "solid",
            options: designTokens.borders.styles.map(s => ({ 
              id: s.value, 
              label: s.name 
            })),
          },
          {
            name: "Border Color",
            property: "border-color",
            type: "color",
          },
        ],
      },
      {
        name: "Effects",
        open: false,
        properties: [
          {
            name: "Box Shadow",
            property: "box-shadow",
            type: "select",
            defaults: "none",
            options: designTokens.shadows.options.map(s => ({ 
              id: s.value, 
              label: s.name 
            })),
          },
          {
            name: "Opacity",
            property: "opacity",
            type: "slider",
            defaults: "1",
            min: 0,
            max: 1,
            step: 0.01,
          },
        ],
      },
    ],
  },
  traitManager: {
    appendTo: "",
  },
};
