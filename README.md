# GrapesJS Email Builder

A modern, drag-and-drop email template builder built with React, TypeScript, and GrapesJS. This application provides an intuitive visual interface for creating responsive email templates without writing code.

## ✨ Features

- **Visual Drag-and-Drop Interface**: Easily build email templates by dragging and dropping pre-built blocks
- **Custom Email Components**: Pre-configured components optimized for email compatibility
- **Real-time Preview**: Toggle preview mode to see your template as it will appear
- **HTML Export**: Export your template as a complete HTML file with inline styles
- **Customizable Blocks**: Modify colors, padding, fonts, and other properties through an intuitive interface
- **Responsive Layout**: Built-in support for multi-column layouts

## 🛠️ Tech Stack

- **React 19** - UI framework
- **TypeScript** - Type safety and better developer experience
- **GrapesJS** - Web Builder Framework
- **@grapesjs/react** - Official React wrapper for GrapesJS
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
│   ├── components/          # React components
│   │   ├── BlocksPanel.tsx  # Drag-and-drop blocks sidebar
│   │   ├── EditorControls.tsx # Toolbar with preview/export/clear actions
│   │   └── EditorLayout.tsx # Main editor layout
│   ├── config/              # Configuration files
│   │   ├── blocks.ts        # Block definitions for the sidebar
│   │   ├── components.ts    # Custom GrapesJS component types
│   │   └── editorConfig.ts  # GrapesJS editor configuration
│   ├── utils/               # Utility functions
│   │   ├── blockRegistry.ts    # Block registration utility
│   │   └── componentRegistry.ts # Component registration utility
│   ├── App.tsx              # Main application component
│   ├── main.tsx             # Application entry point
│   └── index.css            # Global styles
├── public/                  # Static assets
├── package.json
├── vite.config.ts          # Vite configuration
└── tsconfig.json           # TypeScript configuration
```

## 🎨 Available Components

### Basic Components
- **Text**: Editable text blocks with customizable font size and color
- **Heading**: H1-H6 headings with color customization
- **Button**: Call-to-action buttons with customizable colors, padding, and border radius
- **Image**: Responsive images with auto-sizing

### Layout Components
- **Section**: Container blocks with customizable background and padding
- **2 Columns**: Two-column layout for responsive email designs

## 🎯 How to Use

1. **Add Blocks**: Drag blocks from the left sidebar onto the canvas
2. **Edit Content**: Double-click on text elements to edit content
3. **Customize Styles**: Select an element and use the properties panel to adjust colors, sizes, and spacing
4. **Preview**: Click the "👁️ Preview" button to see how your email will look
5. **Export**: Click "💾 Export HTML" to download your template as an HTML file
6. **Clear**: Use "🗑️ Clear" to start over (with confirmation)

## ⚙️ Customization

### Adding New Blocks

Edit `/src/config/blocks.ts` to add new blocks:

```typescript
{
  id: "your-block-id",
  label: "Your Block Label",
  category: "Basic", // or "Layout"
  content: { type: "your-component-type" },
  attributes: { class: "fa fa-icon" }
}
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

- Storage manager is currently disabled (templates are not persisted)
- Export functionality generates inline styles for maximum email client compatibility

## 🔮 Future Enhancements

- [ ] Add template storage and management
- [ ] More pre-built email blocks (footer, header, social media)
- [ ] Template gallery/starter templates
- [ ] Undo/Redo functionality
- [ ] Mobile preview mode
- [ ] Integration with email service providers
- [ ] Component library expansion

## 📚 Resources

- [GrapesJS Documentation](https://grapesjs.com/docs/)
- [GrapesJS React Wrapper](https://github.com/GrapesJS/react)
- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)