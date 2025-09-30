import type { EditorConfig } from "grapesjs";

export const editorConfig: EditorConfig = {
  height: "100vh",
  storageManager: false,
  components: "<h1>Welcome to template builder</h1>",
  canvas: {
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
