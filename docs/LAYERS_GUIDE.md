# Layers Panel Guide

Complete guide to the Enhanced Layers Panel with search, filter, drag-and-drop reordering, and layer management features.

## Overview

The Enhanced Layers Panel provides a hierarchical view of your template structure with advanced features for managing components. The panel is fully resizable and supports drag-and-drop reordering for intuitive component organization.

## Features

### 0. Resizable Panel
The layers panel (and blocks panel) can be resized to fit your workflow:

- **Drag the resize handle** between panels to adjust width
- **Min width:** 280px for optimal usability
- **Max width:** 600px to preserve canvas space
- **Smooth resize** with visual feedback
- **Persistent layout** maintains your preferences

### 1. Search & Filter

#### Search by Name/Type/ID
```
Search: "button"
```
- Searches across component name, type, and ID
- Real-time filtering
- Case-insensitive
- Highlights matching components

#### Filter by Component Type
```
Filter dropdown: "image" | "text" | "button" | "all"
```
- Shows only selected component types
- Dynamically populated based on current template
- Combines with search for precise filtering

### 2. Layer Tree Navigation

#### Expand/Collapse
- Click arrow icon to expand/collapse child components
- Keyboard: Space/Enter to toggle
- Visual indicator shows expand state

#### Selection
- Click component name to select
- Selected layer highlighted in blue
- Syncs with canvas selection

### 3. Layer Actions

#### Visibility Toggle
- **Show/Hide Icon** (Eye): Toggle component visibility
- Hidden components appear with 30% opacity
- State persists during session
- Keyboard: V to toggle selected layer

#### Lock/Unlock
- **Lock Icon**: Prevent accidental modifications
- Locked components cannot be:
  - Selected in canvas
  - Moved or resized
  - Deleted (without unlocking)
- Visual indicator: reduced opacity
- Keyboard: L to toggle lock

#### Duplicate
- **Copy Icon**: Clone selected component
- Creates exact copy with all styles
- Appended to same parent
- Keyboard: Ctrl+D

#### Delete
- **Trash Icon**: Remove component
- Confirmation dialog before deletion
- Cannot be undone without Undo Manager
- Keyboard: Delete/Backspace

## Layer Icons

Each component type has a unique icon:

| Type | Icon | Description |
|------|------|-------------|
| Text | T | Text blocks |
| Image | 🖼 | Images |
| Button | ▢ | Buttons |
| Section | □ | Container sections |
| Default | □ | Other elements |

## Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| Toggle visibility | V |
| Toggle lock | L |
| Duplicate | Ctrl+D |
| Delete | Delete/Backspace |
| Select next | ↓ |
| Select previous | ↑ |
| Expand/Collapse | Space |

## Component States

### Normal
- White background
- Full opacity
- All actions available

### Selected
- Blue gradient background
- White text
- Highlighted in canvas

### Hidden
- Eye icon crossed out
- 30% opacity in canvas
- Can still be selected from layers

### Locked
- Lock icon filled
- Reduced opacity
- Cannot select in canvas
- Can unlock from layers panel

## Reordering Components

### Drag and Drop (Primary Method)
The layers panel now supports native drag-and-drop reordering with visual feedback:

1. **Click and hold** any unlocked layer
2. **Drag** to the desired position
3. **Visual indicators** show where the component will be dropped:
   - **Blue line above** = drop before target
   - **Blue line below** = drop after target
   - **Blue dashed border** = drop inside container (nest)
4. **Release** to complete the reorder

#### Drop Behavior:
- **Top third** of target → Drop before
- **Middle third** (containers only) → Drop inside/nest
- **Bottom third** of target → Drop after

#### Smart Restrictions:
- ✅ Locked layers cannot be dragged
- ✅ Cannot drop parent into its own child
- ✅ Preview shows exact drop location
- ✅ Smooth animations guide the operation

## Best Practices

### Naming Conventions
```
✅ Good:
- "Hero Section"
- "CTA Button"
- "Product Image"

❌ Avoid:
- "div"
- "component-1"
- Unnamed elements
```

### Organization
1. **Group related components** in sections
2. **Lock background elements** to prevent accidents
3. **Hide reference layers** while working
4. **Use descriptive names** for complex templates

### Large Templates
For templates with 50+ components:
1. Use search to find specific elements
2. Filter by type to reduce clutter
3. Lock completed sections
4. Hide sections you're not editing

## Integration Tests

The layers panel includes comprehensive test coverage (26 tests):

### Core Functionality
- ✅ Search input and filter rendering
- ✅ Component layer display
- ✅ Hierarchical layer structure
- ✅ Tree expansion/collapse

### Drag and Drop Reordering
- ✅ Drag initiation
- ✅ Locked layer drag prevention
- ✅ Drop indicator display
- ✅ Smart parent-child validation

### Visibility Operations
- ✅ Hide/show components
- ✅ Opacity changes
- ✅ Multi-component state management

### Layer Locking
- ✅ Lock/unlock operations
- ✅ Selection prevention for locked layers
- ✅ Visual locked indicators
- ✅ Drag prevention for locked layers

### Deletion Operations
- ✅ Confirmation dialog
- ✅ Safe deletion workflow
- ✅ Cancellation handling

### Search & Filter for Large Templates
- ✅ Search query filtering (50+ components)
- ✅ Type-based filtering
- ✅ Combined search + filter
- ✅ Large nested tree handling (3 levels, 4 children each)

### Edge Cases
- ✅ Components without names
- ✅ Empty component trees
- ✅ Rapid filter changes
- ✅ Duplication operations

Run tests with:
```bash
pnpm test EnhancedLayersPanel
```

All tests pass with 100% coverage of critical layer management features.

## Troubleshooting

### Search not finding component
- Check spelling
- Try searching by type instead of name
- Clear search and use filter

### Cannot select component
- Check if component is locked (unlock it)
- Check if component is inside collapsed parent
- Verify component isn't hidden

### Duplicate creates wrong copy
- Ensure correct component is selected
- Check if parent container accepts children
- Verify component isn't locked

