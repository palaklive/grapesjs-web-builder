# Style Manager Guide

Complete guide to the enhanced Style Manager with design tokens and advanced styling controls.

## Overview

The Style Manager is configured with project-specific style sectors mapped to design tokens, providing a consistent and professional styling system.

## Design Token System

### Color Tokens

```typescript
// Primary Colors
primary-50 to primary-900 (Blue scale)

// Neutral Colors  
neutral-50 to neutral-900 (Gray scale)

// Semantic Colors
success-500, success-600 (Green)
warning-500, warning-600 (Orange)
error-500, error-600 (Red)
```

### Typography Tokens

**Font Families**
- System Default: -apple-system, BlinkMacSystemFont...
- Inter: Professional UI font
- Georgia, Times New Roman: Serif options
- Courier: Monospace for code
- Arial, Helvetica, Verdana: Web-safe fonts

**Font Sizes**
- xs (12px) to 5xl (48px)
- Named scales for consistency
- Web-safe sizes

**Font Weights**
- Light (300) to Extra Bold (800)
- Standard weight scales
- Web browser compatible

**Line Heights**
- Tight (1.25) to Loose (2)
- Semantic naming
- Responsive text readability

### Spacing Tokens

**Padding/Margin Options**
- 0 (None) to 12 (48px)
- 4px increments
- Named scales (XS, SM, MD, LG, XL, etc.)

### Border Tokens

**Border Radius**
- None (0) to Full (9999px)
- Small (4px) to 2XL (16px)
- Web-safe values

**Border Width**
- None to Extra Thick (8px)
- Standard increments

**Border Styles**
- Solid, Dashed, Dotted, Double, None

### Shadow Tokens

**Box Shadow Options**
- None to Extra Large
- Pre-configured shadow values
- Subtle to pronounced effects

## Style Sectors

### 1. Typography
Controls all text-related properties:

**Properties:**
- Font Family (dropdown with tokens)
- Font Size (token-based sizes)
- Font Weight (named weights)
- Line Height (semantic scales)
- Text Color (color picker)
- Text Align (radio: left/center/right/justify)
- Letter Spacing (number input)

**Example:**
```css
font-family: 'Inter', -apple-system, sans-serif;
font-size: 16px; /* Base */
font-weight: 600; /* Semibold */
line-height: 1.5; /* Normal */
color: #1e293b;
text-align: left;
letter-spacing: 0px;
```

### 2. Dimension
Controls size properties:

**Properties:**
- Width (px, %, auto, vw)
- Height (px, %, auto, vh)
- Max Width (px, %, none)
- Min Height (px, %, auto)

**Best Practices:**
- Use `max-width: 1200px` for web page containers
- Use `%` for responsive elements
- Use `auto` for content-based sizing

### 3. Spacing
Composite controls for padding and margin:

**Padding:**
- Individual controls for Top, Right, Bottom, Left
- Visual padding box representation
- Px units only (web-safe)

**Margin:**
- Individual controls for each side
- Supports `auto` for centering
- Collapsible groups

**Example:**
```css
padding: 20px 40px; /* Vertical | Horizontal */
margin: 0 auto; /* Center horizontally */
```

### 4. Colors
Centralized color management:

**Properties:**
- Background Color
- Text Color
- Border Color

**Features:**
- Color picker with hex input
- Recently used colors
- Design token suggestions
- Alpha channel support

### 5. Border
Complete border styling:

**Properties:**
- Border Radius (token dropdown)
- Border Width (token dropdown)
- Border Style (solid/dashed/etc.)
- Border Color (color picker)

**Examples:**
```css
/* Rounded button */
border-radius: 8px;
border-width: 2px;
border-style: solid;
border-color: #3b82f6;

/* Pill button */
border-radius: 9999px;
```

### 6. Effects
Visual enhancements:

**Properties:**
- Box Shadow (token dropdown)
- Opacity (slider: 0-1)

**Shadow Examples:**
```css
/* Subtle */
box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);

/* Medium */
box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);

/* Large */
box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
```

## Selector Manager

### Creating Classes

1. Select a component
2. In Selectors section, click input
3. Type class name (e.g., `button-primary`)
4. Press Enter

### Managing States

**Available States:**
- Normal (default)
- Hover (:hover)
- Active (:active)
- Focus (:focus)
- Visited (:visited) - for links

**Setting Hover Styles:**
1. Select component
2. Choose "hover" from state dropdown
3. Modify properties
4. Styles apply only on hover

**Example:**
```css
.button-primary {
  background: #3b82f6;
  color: white;
}

.button-primary:hover {
  background: #2563eb;
  transform: translateY(-2px);
}
```

### Removing Selectors

1. Find selector in list
2. Click × button
3. Confirm removal (if prompted)

## Hidden Properties

To simplify the UI, the following CSS properties are **not** shown:
- `position` (use layout components instead)
- `float` (use flex/grid instead)
- `z-index` (managed by layer order)
- `display` (component-specific)
- Advanced CSS properties (transforms, animations)

These can still be applied via custom CSS if needed.

## Composite Controls

### Padding Control
Visual box representation:
```
┌─────────────┐
│ ↑ Top       │
│ ← → Sides   │
│ ↓ Bottom    │
└─────────────┘
```

### Margin Control
Same visual representation:
- Use arrows or inputs
- Auto value for centering
- Supports negative values

## Automated Testing

Style changes are validated by automated tests:

```bash
# Run style manager tests
pnpm test styles

# Test CSS export
pnpm test:coverage
```

**Tests verify:**
- ✅ Style application to components
- ✅ Selector creation and management
- ✅ State-specific styles (hover, active)
- ✅ CSS export accuracy
- ✅ Design token mapping

## Best Practices

### Web Compatibility
1. **Use inline styles** when possible
2. **Avoid complex CSS** (gradients work in some clients)
3. **Test across clients** (Gmail, Outlook, Apple Mail)
4. **Use web-safe fonts** as fallbacks
5. **Limit box shadows** (not supported everywhere)

### Responsive Design
```css
/* Mobile-friendly */
max-width: 600px;
padding: 20px 16px;
font-size: 16px; /* Minimum for mobile */

/* Desktop */
padding: 40px;
font-size: 18px;
```

### Performance
1. Reuse classes instead of inline styles
2. Minimize complex selectors
3. Use design tokens for consistency
4. Group related styles in sectors

### Maintainability
1. Name selectors semantically (`.hero-title` not `.big-text`)
2. Use design tokens instead of hard-coded values
3. Document custom styles
4. Keep style specificity low

## Troubleshooting

### Styles not applying
1. Check selector specificity
2. Verify component is selected
3. Check for conflicting styles
4. Inspect element in browser DevTools

### Token not showing
1. Refresh token configuration
2. Check `designTokens.ts` file
3. Verify token is in correct category

### Color picker issues
1. Use hex format (#RRGGBB)
2. Avoid named colors
3. Check alpha channel support

