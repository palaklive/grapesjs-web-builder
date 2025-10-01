# GrapesJS Email Builder

A modern, drag-and-drop email template builder built with React, TypeScript, and GrapesJS. This application provides an intuitive visual interface for creating responsive email templates with both visual canvas and live code editor modes, featuring bidirectional sync, auto-prettified HTML, and a beautiful dark-themed UI with enhanced user experience.

## ✨ Features

### Core Functionality
- **Visual Drag-and-Drop Interface**: Easily build email templates by dragging and dropping pre-built blocks with icon-based design
- **Custom Email Components**: Pre-configured components optimized for email compatibility
- **Canvas ↔ Code Toggle**: Seamlessly switch between visual canvas and live HTML code editor with bidirectional sync
- **Real-time Editing**: Edit content directly in the canvas OR code editor with instant visual feedback
- **Prettified HTML Code**: Automatically formatted HTML with syntax highlighting for better readability
- **Customizable Properties**: Modify colors, padding, fonts, and other properties through an intuitive right panel
- **Responsive Layout**: Built-in support for multi-column layouts

### Modern UI/UX
- **Dark Theme Interface**: Professional dark-themed editor with gradient backgrounds and smooth animations
- **Icon-Based Blocks**: Visual icons for each block type (Text, Heading, Image, Button, Section, Columns)
- **Interactive Panels**: 
  - **Layers Panel**: Tree view of your template structure with visual hierarchy
  - **Styles Panel**: Comprehensive styling controls with organized sections
  - **Properties Panel**: Component-specific settings and attributes
- **Enhanced Visual Feedback**: Hover effects, smooth transitions, and clear active states
- **Live Code Editor**: Full-featured HTML code editor with:
  - Auto-prettification with proper indentation
  - Real-time bidirectional sync (Canvas ↔ Code)
  - Copy to clipboard functionality

## 🛠️ Tech Stack

- **React 19** - UI framework
- **TypeScript** - Type safety and better developer experience
- **GrapesJS** - Web Builder Framework
- **@grapesjs/react** - Official React wrapper for GrapesJS
- **Prettier** - Code formatter for HTML beautification
- **Vite** - Fast build tool and dev server
- **pnpm** - Fast, disk space efficient package manager

## 📦 Prerequisites

- Node.js 22+ 
- pnpm 10+ (or npm/yarn)

## 🚀 Getting Started

### Installation

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview
```

### Development

The development server will start at `http://localhost:5173` (default Vite port).

## 📁 Project Structure

```
email-builder/
├── src/
│   ├── components/              # React components
│   │   ├── BlocksPanel.tsx      # Icon-based drag-and-drop blocks sidebar
│   │   ├── BlocksPanel.css      # Blocks panel styling
│   │   ├── CodeEditor.tsx       # Live HTML code editor with sync
│   │   ├── CodeEditor.css       # Code editor styling
│   │   ├── EditorControls.tsx   # Toolbar with canvas/code toggle & actions
│   │   ├── EditorControls.css   # Controls styling
│   │   ├── EditorLayout.tsx     # Main editor layout structure
│   │   ├── EditorLayout.css     # Layout styling
│   │   ├── RightPanel.tsx       # Layers, Styles, and Properties panels
│   │   └── RightPanel.css       # Right panel styling
│   ├── contexts/                # React contexts
│   │   └── ViewContext.tsx      # View mode state management (canvas/code)
│   ├── config/                  # Configuration files
│   │   ├── blocks.ts            # Block definitions with categories
│   │   ├── components.ts        # Custom GrapesJS component types
│   │   └── editorConfig.ts      # GrapesJS editor configuration
│   ├── utils/                   # Utility functions
│   │   ├── blockRegistry.ts     # Block registration utility
│   │   └── componentRegistry.ts # Component registration utility
│   ├── App.tsx                  # Main application component
│   ├── main.tsx                 # Application entry point
│   └── index.css                # Global styles
├── public/                      # Static assets
├── package.json
├── vite.config.ts              # Vite configuration
└── tsconfig.json               # TypeScript configuration
```

## 🎨 Available Components

### Basic Components
- **Text** 📝: Editable text blocks with customizable font size, color, and alignment
- **Heading** H: H1-H6 headings with bold styling and color customization
- **Button** 🔘: Call-to-action buttons with customizable colors, padding, and border radius
- **Image** 🖼️: Responsive images with auto-sizing and border options

### Layout Components
- **Section** 📦: Container blocks with customizable background, padding, and max-width
- **2 Columns** ⚏: Two-column layout for responsive email designs with equal-width columns

## 🎛️ Editor Panels

### Left Panel - Blocks
Browse and drag pre-built components:
- **Visual Icons**: Each block has a unique icon for easy identification
- **Category Labels**: Shows whether block is "Basic" or "Layout"
- **Drag Feedback**: Smooth animations when dragging blocks
- **Hover Effects**: Cards elevate and highlight on hover

### Right Panel - Configuration
Three-tab interface for complete control:

#### 1. Layers Tab 🗂️
- **Tree Structure**: Hierarchical view of all components
- **Select Elements**: Click any layer to select it on canvas
- **Visual Indicators**: Selected layer highlighted in blue
- **Nested Display**: Child elements indented for clarity

#### 2. Styles Tab 🎨
- **Selectors**: Add and manage CSS classes
- **State Management**: Define styles for hover, active states
- **Property Sections**: Organized by category (Typography, Decorations, etc.)
- **Color Pickers**: Visual color selection for all color properties
- **Unit Inputs**: Numeric inputs with proper validation

#### 3. Properties Tab ⚙️
- **Component Attributes**: Edit component-specific settings
- **Text Content**: Modify text, URLs, image sources
- **Checkboxes**: Toggle boolean properties
- **Dropdowns**: Select from predefined options

## 🎯 How to Use

### Building Your Template

1. **Browse Blocks**: View icon-based blocks in the left sidebar, organized by category (Basic/Layout)
2. **Add Blocks**: Drag blocks from the sidebar onto the canvas - visual feedback shows where blocks will drop
3. **Edit Content**: Double-click on text elements to edit content directly in the canvas
4. **Select Elements**: Click on any element to select it and view its properties

### Customization & Styling

5. **Use the Right Panel Tabs**:
   - **Layers**: View and navigate your template structure in a tree view
   - **Styles**: Apply CSS styles with organized sections (Typography, Decorations, etc.)
   - **Properties**: Edit component-specific attributes (text, href, src, etc.)

6. **Customize Styles**: 
   - Select any element and use the Styles tab
   - Modify colors using the color picker
   - Adjust spacing, fonts, borders, and more
   - Add custom selectors and CSS states (hover, active)

### Code Editor & Export

7. **Toggle Between Views**: Click the "Code" / "Canvas" button to switch between:
   - **Canvas View**: Visual drag-and-drop editor for building templates
   - **Code View**: Live HTML editor with prettified code

8. **Edit in Code View**:
   - View automatically formatted, beautified HTML code
   - Edit the code directly in the editor
   - Watch the canvas update automatically as you type
   - Copy code to clipboard with one click

9. **Bidirectional Sync**:
   - Changes in Canvas automatically update the Code view
   - Code edits stream back to the Canvas in real time
   - Code is always prettified for better readability

10. **Clear Canvas**: Use the "Clear" button to start over (includes confirmation prompt)

## ⚙️ Customization

### Adding New Blocks

Edit `/src/config/blocks.ts` to add new blocks:

```typescript
{
  id: "your-block-id",
  label: "Your Block Label",
  category: "Basic", // or "Layout" - displays under block name
  content: { type: "your-component-type" },
  attributes: { class: "fa fa-icon" } // Optional: for future compatibility
}
```

Then add a corresponding SVG icon in `BlocksPanel.tsx` in the `getBlockIcon` function:

```typescript
"your-block-id": (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="..." stroke="currentColor" strokeWidth="2"/>
  </svg>
)
```

### Creating Custom Components

Add new component definitions in `/src/config/components.ts`:

```typescript
{
  id: "your-component-type",
  model: {
    defaults: {
      tagName: "div",
      draggable: true,
      droppable: false,
      content: "Your content",
      traits: [
        // Add customizable properties here
      ]
    }
  }
}
```

## 🔧 Configuration

### Path Aliases

The project uses `@/` as an alias for the `src/` directory:

```typescript
import { BlocksPanel } from "@/components/BlocksPanel";
```

### Editor Options

Modify editor settings in `/src/config/editorConfig.ts`:

```typescript
export const editorConfig: EditorConfig = {
  height: "100vh",
  storageManager: false,
  components: "<h1>Welcome to template builder</h1>",
  // Add more configuration options
};
```

## 🎨 UI/UX Design

### Dark Theme
The application features a modern dark theme with:
- **Slate color palette** - Professional dark backgrounds (#1e293b, #0f172a)
- **Blue accents** - Gradient buttons and highlights (#3b82f6 to #2563eb)
- **Custom scrollbars** - Themed scrollbars for all panels
- **Smooth animations** - 200-300ms transitions for all interactions

### Visual Feedback
- **Hover States**: Elements lift up, change colors, and show borders on hover
- **Active States**: Visual confirmation when dragging, clicking, or selecting
- **Focus States**: Blue glow on form inputs for accessibility
- **Icons**: SVG icons throughout for better clarity and scalability

### Layout
- **Left Panel (280px)**: Icon-based blocks with category labels
- **Center Canvas**: Main editing area with controls at top
- **Right Panel (320px)**: Tabbed interface for Layers/Styles/Properties

## 📝 Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm preview` - Preview production build
- `pnpm lint` - Run ESLint

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is private and not licensed for public use.

## 🐛 Known Issues

- Storage manager is currently disabled (templates are not persisted between sessions)
- No download option - HTML code must be copied manually from the code editor

## ✅ Recent Improvements

- ✨ Modern dark-themed UI with gradients and smooth animations
- 🎨 Icon-based block design with visual categories
- 🔄 **Canvas ↔ Code toggle with bidirectional sync**
- 💻 **Live HTML code editor with auto-prettification**
- 🔄 **Real-time code-to-canvas sync while typing**
- 📋 **One-click copy to clipboard from code view**
- 🎯 Enhanced right panel with Layers, Styles, and Properties tabs
- 💫 Improved hover states and visual feedback throughout
- 🖱️ Better drag-and-drop experience with visual indicators

## 🔮 Future Enhancements

- [ ] Add template storage and management (localStorage/backend)
- [ ] Download HTML file option from code editor
- [ ] Syntax highlighting for code editor
- [ ] More pre-built email blocks (footer, header, social media, CTA sections)
- [ ] Template gallery with starter templates
- [ ] Undo/Redo functionality
- [ ] Mobile preview mode with device frames
- [ ] Integration with email service providers (SendGrid, Mailchimp, etc.)
- [ ] Component library expansion with email-specific components
- [ ] Dark/Light theme toggle
- [ ] More keyboard shortcuts for common actions

## 📚 Resources

- [GrapesJS Documentation](https://grapesjs.com/docs/)
- [GrapesJS React Wrapper](https://github.com/GrapesJS/react)
- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)