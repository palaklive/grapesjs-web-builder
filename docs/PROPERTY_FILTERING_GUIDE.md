# Style Property Filtering Guide

## Overview

This guide explains how style property filtering works in the web builder and what to expect when styling different elements.

---

## How Property Filtering Works

### Current Implementation

The style panel now implements **intelligent property filtering** with multiple layers of checks:

```typescript
isPropertyVisible(prop) {
  1. Check if prop.isVisible() exists and returns false → HIDE
  2. Check if prop.get('visible') === false → HIDE  
  3. Check if prop has 'requires' attribute → Filter by component type
  4. Default → SHOW (let GrapesJS determine applicability)
}
```

### What Gets Filtered

1. **Explicitly Hidden Properties**
   - Properties marked with `visible: false`
   - Properties where `isVisible()` returns `false`

2. **Component-Specific Requirements**
   - Properties with `requires: ['componentType']` attribute
   - Only shown for matching component types

3. **Empty Sectors**
   - Sectors with zero visible properties don't display
   - Property count badges show `(0)` before hiding

---

## GrapesJS Property Behavior

### Important Understanding

**GrapesJS shows ALL configured styleManager properties by default** unless:
- Property is explicitly hidden (`visible: false`)
- Property has component-type requirements
- Property's `isVisible()` method returns `false`

This means:
- ✅ All typography properties show for text AND images
- ✅ All spacing properties show for all elements
- ✅ Background properties show for all container elements

This is **by design** in GrapesJS because:
1. CSS properties can apply to any HTML element
2. Users might want to style any element in unexpected ways
3. Flexibility is prioritized over strict filtering

---

## Per-Element Property Visibility

### Text Elements (`<p>`, `<h1>`, etc.)

**Typically Shows:**
- Typography (font-family, font-size, color, text-align, etc.)
- Spacing (padding, margin)
- Layout (display, position)
- Borders
- Background
- Effects (opacity, shadow)

**Why show non-text properties?**
- Users might want background colors on text
- Text might need padding/margin
- Text containers can have borders

---

### Image Elements (`<img>`)

**Typically Shows:**
- Dimensions (width, height)
- Spacing (margin)
- Borders
- Effects (opacity, shadow, filters)
- Layout (display, position)

**Note:** Typography properties might still show but won't affect the image itself. They're available in case the image is in a styled container.

---

### Button Elements (`<button>`)

**Typically Shows:**
- Typography (text styling)
- Spacing (padding for clickable area, margin)
- Borders (button outline)
- Background (button color, gradients)
- Effects (shadows, hover states)
- Layout (display, position)

**All properties are relevant** for buttons since they contain text and need full styling.

---

## Advanced Filtering Options

### Option 1: Configure StyleManager Per Component Type

To show ONLY specific properties for specific components, configure in `editorConfig.ts`:

```typescript
styleManager: {
  sectors: [
    {
      name: "Typography",
      open: true,
      // Only show typography for text-like components
      buildProps: ['font-family', 'font-size', 'color', 'text-align'],
      // Configure which components can use these
      ...
    }
  ]
}
```

### Option 2: Use Component-Specific Style Configurations

Define styles per component type:

```typescript
editor.DomComponents.addType('custom-button', {
  model: {
    defaults: {
      stylable: ['background', 'color', 'padding', 'border-radius'],
      // Only these properties will be editable
    }
  }
});
```

### Option 3: Custom Property Requirements

Add requirements to properties:

```typescript
{
  name: "Text Transform",
  property: "text-transform",
  type: "select",
  requires: ['text', 'heading', 'button'], // Only for these types
  options: [...]
}
```

---

## Current Filtering Status

### ✅ What's Filtered Now

1. **Hidden Properties**
   - Properties explicitly marked as hidden
   - Properties that fail `isVisible()` checks

2. **Empty Sectors**
   - Sectors with no visible properties don't display
   - Clean interface without empty sections

3. **Property Counts**
   - Each sector shows count: `Typography (7)`
   - Helps users know what's available

### ⚠️ What's NOT Filtered (By Design)

1. **CSS Properties**
   - All CSS properties are technically applicable to all elements
   - GrapesJS follows CSS rules, not strict component rules

2. **Flexibility**
   - Users can apply any style to any element
   - Advanced users might want unexpected combinations
   - Example: Text shadows on containers, backgrounds on text, etc.

---

## Best Practices for Users

### When Styling Text

**Focus on these sectors:**
- Typography (primary)
- Spacing (padding/margin)
- Background (if you want colored text blocks)

**Can safely ignore:**
- Most dimension properties
- Advanced layout properties (unless needed)

### When Styling Images

**Focus on these sectors:**
- Dimensions (width/height)
- Borders
- Effects (shadows, opacity)
- Spacing (margin)

**Can safely ignore:**
- Typography properties (won't affect image)
- Text-specific properties

### When Styling Buttons

**ALL sectors are relevant!**
- Typography (button text)
- Spacing (clickable area)
- Borders (outline)
- Background (button color)
- Effects (shadows, hover)

---

## Configuration Examples

### Example 1: Strict Text-Only Properties

```typescript
// editorConfig.ts
{
  name: "Text Properties",
  open: true,
  properties: [
    {
      name: "Font Size",
      property: "font-size",
      // Only show for text-like elements
      requires: ['text', 'heading'],
      ...
    }
  ]
}
```

### Example 2: Image-Specific Properties

```typescript
{
  name: "Image Properties",
  open: false,
  properties: [
    {
      name: "Object Fit",
      property: "object-fit",
      requires: ['image'],
      type: "select",
      options: [
        { id: 'contain', label: 'Contain' },
        { id: 'cover', label: 'Cover' },
        ...
      ]
    }
  ]
}
```

---

## Debugging Property Visibility

### Check in Browser Console

When styles panel opens, check console for:
```
[Command] Opening styles panel for component: Button
```

### Verify Property Visibility

The filtering logic logs warnings if issues occur:
```
Error checking property visibility: [error details]
```

### Manual Check

In browser console:
```javascript
// Get selected component
const component = editor.getSelected();

// Check component type
console.log(component.get('type'));

// Get all style properties
const sectors = editor.StyleManager.getSectors();
sectors.forEach(sector => {
  console.log(sector.getName(), sector.getProperties().length);
});
```

---

## Summary

### Current State: ✅ Smart Filtering Active

1. **Explicitly hidden properties** are filtered out
2. **Empty sectors** don't display
3. **Property counts** shown for each sector
4. **Component-type requirements** are checked
5. **Error handling** prevents crashes

### Expected Behavior:

- **All elements show most CSS properties** (this is correct CSS behavior)
- **Typography shows for all** (users might want styled containers)
- **Spacing shows for all** (all elements can have padding/margin)
- **Different property counts** per element type (based on applicability)

### To Get Stricter Filtering:

1. Configure `styleManager` with `requires` attributes
2. Use component-specific `stylable` arrays
3. Implement custom property filtering logic
4. Use GrapesJS plugins for advanced filtering

---

## Future Enhancements

Potential improvements for stricter filtering:

1. **Component Type Mapping**
   - Define which properties apply to which types
   - Automatic filtering based on mapping

2. **Smart Property Groups**
   - "Text Styles" group only for text elements
   - "Image Styles" group only for images

3. **User Preferences**
   - Toggle "Show all properties" vs "Show relevant only"
   - Save user's preferred filtering level

4. **Contextual Help**
   - Show hints for which properties are most relevant
   - Highlight primary vs secondary properties

---

## Conclusion

The current implementation provides **intelligent, safe property filtering** while respecting GrapesJS's flexible CSS-based approach. All CSS properties are technically valid for all elements, so showing them allows maximum flexibility while filtering out only truly non-applicable or hidden properties.

For stricter, component-specific filtering, additional configuration in `editorConfig.ts` is needed with `requires` attributes and `stylable` arrays.

**Status: Property Filtering Working as Designed** ✅

