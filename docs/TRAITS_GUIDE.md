# Traits (Properties) Guide

Complete guide to the enhanced Traits Manager with custom trait types and validation.

## Overview

Traits are component-specific attributes that configure behavior and content. The Email Builder provides custom trait types with built-in validation and user-friendly interfaces.

## Standard Trait Types

### Text
Simple text input for short strings.

```typescript
{
  type: 'text',
  label: 'Button Text',
  name: 'text',
  placeholder: 'Click here'
}
```

**Use cases:**
- Button labels
- Alt text
- Titles
- Short descriptions

### Number
Numeric input with optional min/max.

```typescript
{
  type: 'number',
  label: 'Width',
  name: 'width',
  min: 0,
  max: 1000
}
```

### Select
Dropdown for predefined options.

```typescript
{
  type: 'select',
  label: 'Button Type',
  name: 'type',
  options: [
    { id: 'button', name: 'Button' },
    { id: 'submit', name: 'Submit' }
  ]
}
```

### Checkbox
Boolean on/off toggle.

```typescript
{
  type: 'checkbox',
  label: 'Required',
  name: 'required'
}
```

## Custom Trait Types

### url-validated
URL input with comprehensive validation.

**Features:**
- Validates absolute URLs (https://...)
- Validates relative URLs (/path, #anchor)
- Validates special protocols (mailto:, tel:)
- Shows error state for invalid URLs
- Accepts empty values

**Configuration:**
```typescript
{
  type: 'url-validated',
  label: 'Link URL',
  name: 'href',
  placeholder: 'https://example.com'
}
```

**Valid URLs:**
```
https://example.com
http://example.com/path?query=value
/relative/path
#anchor
mailto:user@example.com
tel:+1234567890
```

**Invalid URLs:**
```
not a url
ht!tp://invalid
example (no protocol)
```

### email-validated
Email input with pattern validation.

**Features:**
- RFC-compliant email validation
- Visual error feedback
- Accepts empty values
- Real-time validation on blur

**Configuration:**
```typescript
{
  type: 'email-validated',
  label: 'Email Address',
  name: 'email',
  placeholder: 'user@example.com'
}
```

**Valid emails:**
```
user@example.com
user.name@domain.co.uk
user+tag@example.com
```

### text-required
Required text field with validation.

**Features:**
- Shows error if empty
- Validates on blur
- Visual error indicator
- Custom error messages

**Configuration:**
```typescript
{
  type: 'text-required',
  label: 'Alt Text',
  name: 'alt',
  placeholder: 'Describe the image'
}
```

**Behavior:**
- Empty = Shows error
- Whitespace-only = Shows error
- Any text = Valid

### number-range
Number input with min/max constraints.

**Features:**
- Visual range indicator
- Enforced min/max values
- Step increment support
- Range label display

**Configuration:**
```typescript
{
  type: 'number-range',
  label: 'Width',
  name: 'width',
  min: '0',
  max: '1000',
  step: '1',
  default: '150'
}
```

**Display:**
```
Width
[____150____] (0-1000)
```

### data-binding
Dynamic content placeholder input.

**Features:**
- Template variable support
- Syntax hints
- Preview formatting
- Documentation tooltip

**Configuration:**
```typescript
{
  type: 'data-binding',
  label: 'Dynamic Content',
  name: 'data-bind'
}
```

**Usage:**
```
{{ firstName }}
{{ product.name }}
{{ user.email }}
```

**Use cases:**
- Personalized greetings
- Product information
- User-specific data
- Dynamic pricing

### color-preset
Color picker with preset swatches.

**Features:**
- Standard color picker
- Quick-select presets
- Custom preset colors
- Visual color swatches

**Configuration:**
```typescript
{
  type: 'color-preset',
  label: 'Background Color',
  name: 'data-bg-color',
  presets: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444']
}
```

**Display:**
```
[Color Picker Input]
[🔵][🟢][🟡][🔴] ← Preset buttons
```

## Common Trait Configurations

### Link Traits

```typescript
// URL with validation
{
  type: 'url-validated',
  label: 'Link URL',
  name: 'href',
  placeholder: 'https://example.com'
}

// Target window
{
  type: 'select',
  label: 'Open In',
  name: 'target',
  options: [
    { id: '', name: 'Same Window' },
    { id: '_blank', name: 'New Window' }
  ]
}
```

**Example Usage:**
```html
<!-- Generated HTML -->
<a href="https://example.com" target="_blank">Click here</a>
```

### Image Traits

```typescript
// Image source
{
  type: 'text',
  label: 'Image URL',
  name: 'src',
  placeholder: 'https://example.com/image.jpg'
}

// Required alt text
{
  type: 'text-required',
  label: 'Alt Text',
  name: 'alt',
  placeholder: 'Describe the image'
}

// Dimensions
{
  type: 'number-range',
  label: 'Width',
  name: 'width',
  min: '0',
  max: '1000'
}
```

**Example Usage:**
```html
<!-- Generated HTML -->
<img src="https://example.com/image.jpg" alt="Product photo" width="300" height="200" />
```

### Button Traits

```typescript
// Button text (required)
{
  type: 'text-required',
  label: 'Button Text',
  name: 'text',
  changeProp: 1
}

// Button type
{
  type: 'select',
  label: 'Type',
  name: 'type',
  options: [
    { id: 'button', name: 'Button' },
    { id: 'submit', name: 'Submit' }
  ]
}

// Background color
{
  type: 'color-preset',
  label: 'Color',
  name: 'data-bg-color',
  presets: ['#3b82f6', '#10b981', '#ef4444']
}
```

**Example Usage:**
```html
<!-- Generated HTML -->
<button type="submit" data-bg-color="#3b82f6">Submit Order</button>
```

### Form Input Traits

```typescript
// Input type
{
  type: 'select',
  label: 'Type',
  name: 'type',
  options: [
    { id: 'text', name: 'Text' },
    { id: 'email', name: 'Email' },
    { id: 'tel', name: 'Phone' }
  ]
}

// Input name
{
  type: 'text',
  label: 'Name',
  name: 'name'
}

// Placeholder
{
  type: 'text',
  label: 'Placeholder',
  name: 'placeholder'
}

// Required field
{
  type: 'checkbox',
  label: 'Required',
  name: 'required'
}
```

**Example Usage:**
```html
<!-- Generated HTML -->
<input type="email" name="user_email" placeholder="Enter your email" required />
```

### Text Component with Data Binding

```typescript
// Content with data source
{
  type: 'text',
  label: 'Content',
  name: 'content',
  changeProp: 1
}

// Data source dropdown
{
  type: 'source-dropdown',
  label: 'Data Source',
  name: 'data-source',
  sources: [
    { id: 'user.firstName', name: 'User First Name' },
    { id: 'user.lastName', name: 'User Last Name' },
    { id: 'user.email', name: 'User Email' },
    { id: 'product.name', name: 'Product Name' },
    { id: 'product.price', name: 'Product Price' },
  ]
}
```

**Example Usage:**
```html
<!-- Generated HTML with static content -->
<p>Welcome to our store!</p>

<!-- Generated HTML with data binding -->
<p data-source="{{ user.firstName }}">Hello {{ user.firstName }}!</p>
```

### Advanced Data Binding Examples

```typescript
// Custom data binding
{
  type: 'data-binding',
  label: 'Dynamic Content',
  name: 'data-bind'
}
```

**Valid Data Binding Syntax:**
```javascript
// Simple variables
{{ firstName }}
{{ lastName }}
{{ email }}

// Nested properties
{{ user.profile.firstName }}
{{ product.category.name }}
{{ order.items.length }}

// Complex objects
{{ user.settings.theme }}
{{ product.reviews.average }}
{{ company.address.city }}
```

**Invalid Data Binding Syntax:**
```javascript
// Missing braces
firstName
{ firstName }

// Incomplete braces
{{ firstName
firstName }}

// Invalid characters
{{ 123variable }}     // Numbers not allowed at start
{{ variable-name }}   // Hyphens not allowed
{{ variable name }}   // Spaces not allowed
```

## Inline Validation

### Visual Indicators

**Valid State:**
```
┌─────────────────┐
│ user@example.com│ ← Normal border
└─────────────────┘
```

**Error State:**
```
┌─────────────────┐
│ invalid         │ ← Red border
└─────────────────┘
  ⚠ Invalid email format
```

### Validation Rules

| Trait Type | Validates | Error Message |
|------------|-----------|---------------|
| url-validated | URL format | "Invalid URL format" |
| email-validated | Email pattern | "Invalid email format" |
| text-required | Non-empty | "This field is required" |
| number-range | Min/max bounds | Auto-enforced |

## Component Examples

### Link Component
```typescript
{
  type: 'link',
  traits: [
    {
      type: 'url-validated',
      label: 'Link URL',
      name: 'href',
      placeholder: 'https://example.com'
    },
    {
      type: 'select',
      label: 'Target',
      name: 'target',
      options: [
        { id: '', name: 'Same Window' },
        { id: '_blank', name: 'New Window' }
      ]
    },
    {
      type: 'text',
      label: 'Title',
      name: 'title',
      placeholder: 'Link title'
    }
  ]
}
```

**Generated HTML:**
```html
<a href="https://example.com" target="_blank" title="Visit our website">
  Click here
</a>
```

### Image Component
```typescript
{
  type: 'image',
  traits: [
    {
      type: 'text',
      label: 'Source',
      name: 'src',
      placeholder: 'https://example.com/image.jpg'
    },
    {
      type: 'text-required',
      label: 'Alt Text',
      name: 'alt',
      placeholder: 'Describe the image'
    },
    {
      type: 'number-range',
      label: 'Width',
      name: 'width',
      min: '0',
      max: '1000',
      step: '1'
    },
    {
      type: 'number-range',
      label: 'Height',
      name: 'height',
      min: '0',
      max: '1000',
      step: '1'
    }
  ]
}
```

**Generated HTML:**
```html
<img src="https://example.com/product.jpg" 
     alt="Product image showing the latest smartphone" 
     width="300" 
     height="200" />
```

### Button Component
```typescript
{
  type: 'button',
  traits: [
    {
      type: 'text-required',
      label: 'Button Text',
      name: 'text',
      placeholder: 'Click here'
    },
    {
      type: 'select',
      label: 'Type',
      name: 'type',
      options: [
        { id: 'button', name: 'Button' },
        { id: 'submit', name: 'Submit' },
        { id: 'reset', name: 'Reset' }
      ]
    },
    {
      type: 'url-validated',
      label: 'Link URL',
      name: 'href',
      placeholder: 'https://example.com/action'
    },
    {
      type: 'color-preset',
      label: 'Background Color',
      name: 'data-bg-color',
      presets: ['#3b82f6', '#10b981', '#ef4444', '#f59e0b']
    }
  ]
}
```

**Generated HTML:**
```html
<button type="submit" 
        href="https://example.com/checkout" 
        data-bg-color="#3b82f6"
        style="background-color: #3b82f6;">
  Add to Cart
</button>
```

### Form Input Component
```typescript
{
  type: 'input',
  traits: [
    {
      type: 'select',
      label: 'Input Type',
      name: 'type',
      options: [
        { id: 'text', name: 'Text' },
        { id: 'email', name: 'Email' },
        { id: 'password', name: 'Password' },
        { id: 'tel', name: 'Phone' },
        { id: 'url', name: 'URL' }
      ]
    },
    {
      type: 'text',
      label: 'Name',
      name: 'name',
      placeholder: 'field_name'
    },
    {
      type: 'text',
      label: 'Placeholder',
      name: 'placeholder',
      placeholder: 'Enter your email'
    },
    {
      type: 'checkbox',
      label: 'Required',
      name: 'required'
    },
    {
      type: 'email-validated',
      label: 'Email Validation',
      name: 'data-email-validate',
      placeholder: 'user@example.com'
    }
  ]
}
```

**Generated HTML:**
```html
<input type="email" 
       name="user_email" 
       placeholder="Enter your email address" 
       required 
       data-email-validate="user@example.com" />
```

### Text Component with Data Binding
```typescript
{
  type: 'text',
  traits: [
    {
      type: 'text',
      label: 'Content',
      name: 'content',
      placeholder: 'Welcome to our store!'
    },
    {
      type: 'source-dropdown',
      label: 'Data Source',
      name: 'data-source',
      sources: [
        { id: 'user.firstName', name: 'User First Name' },
        { id: 'user.lastName', name: 'User Last Name' },
        { id: 'user.email', name: 'User Email' },
        { id: 'product.name', name: 'Product Name' },
        { id: 'product.price', name: 'Product Price' }
      ]
    }
  ]
}
```

**Generated HTML (Static):**
```html
<p>Welcome to our store!</p>
```

**Generated HTML (Dynamic):**
```html
<p data-source="{{ user.firstName }}">
  Hello {{ user.firstName }}, welcome to our store!
</p>
```

## Real-World Examples

### E-commerce Product Card
```typescript
// Product Image
{
  type: 'image',
  traits: [
    { type: 'text', name: 'src', label: 'Product Image URL' },
    { type: 'text-required', name: 'alt', label: 'Product Description' },
    { type: 'number-range', name: 'width', label: 'Width', min: '100', max: '500' }
  ]
}

// Product Title
{
  type: 'text',
  traits: [
    { type: 'text', name: 'content', label: 'Product Name' },
    { type: 'source-dropdown', name: 'data-source', label: 'Dynamic Title' }
  ]
}

// Price
{
  type: 'text',
  traits: [
    { type: 'text', name: 'content', label: 'Price' },
    { type: 'data-binding', name: 'data-bind', label: 'Dynamic Price' }
  ]
}

// Add to Cart Button
{
  type: 'button',
  traits: [
    { type: 'text-required', name: 'text', label: 'Button Text' },
    { type: 'url-validated', name: 'href', label: 'Add to Cart URL' },
    { type: 'color-preset', name: 'data-bg-color', label: 'Button Color' }
  ]
}
```

### Newsletter Signup Form
```typescript
// Email Input
{
  type: 'input',
  traits: [
    { type: 'select', name: 'type', label: 'Type', options: [{ id: 'email', name: 'Email' }] },
    { type: 'text', name: 'name', label: 'Field Name', placeholder: 'email' },
    { type: 'text', name: 'placeholder', label: 'Placeholder', placeholder: 'Enter your email' },
    { type: 'checkbox', name: 'required', label: 'Required' },
    { type: 'email-validated', name: 'data-email-validate', label: 'Email Validation' }
  ]
}

// Submit Button
{
  type: 'button',
  traits: [
    { type: 'text-required', name: 'text', label: 'Button Text', placeholder: 'Subscribe' },
    { type: 'select', name: 'type', label: 'Type', options: [{ id: 'submit', name: 'Submit' }] },
    { type: 'color-preset', name: 'data-bg-color', label: 'Button Color' }
  ]
}
```

### Contact Information
```typescript
// Phone Number
{
  type: 'text',
  traits: [
    { type: 'text', name: 'content', label: 'Phone Number' },
    { type: 'data-binding', name: 'data-bind', label: 'Dynamic Phone' }
  ]
}

// Email Address
{
  type: 'text',
  traits: [
    { type: 'text', name: 'content', label: 'Email Address' },
    { type: 'email-validated', name: 'data-email-validate', label: 'Email Validation' }
  ]
}

// Website Link
{
  type: 'link',
  traits: [
    { type: 'url-validated', name: 'href', label: 'Website URL' },
    { type: 'text', name: 'title', label: 'Link Title' },
    { type: 'select', name: 'target', label: 'Open In', options: [{ id: '_blank', name: 'New Window' }] }
  ]
}
```

## Testing

Automated tests verify:
- ✅ Trait updates component model
- ✅ Validation rules work correctly
- ✅ Changes reflect in HTML export
- ✅ Error states display properly
- ✅ Custom trait types render correctly
- ✅ React UI integration works properly
- ✅ Component trait configuration is correct

**Run tests:**
```bash
# All trait tests
pnpm test traits

# Specific validation tests
pnpm test customTraits

# Component traits integration tests
pnpm test componentTraits

# React UI tests
pnpm test TraitsPanel
```

**Test Coverage:**
- Custom trait validation functions
- React trait input components
- Component trait configuration
- HTML serialization
- Error state handling
- User interaction flows

## Best Practices

### Accessibility
1. Always include `alt` attribute for images
2. Use descriptive link `title` attributes
3. Provide meaningful button text
4. Mark required fields clearly

### Validation
1. Validate on blur, not on every keystroke
2. Show clear error messages
3. Allow empty values unless required
4. Provide helpful placeholders

### Data Binding
1. Use consistent variable naming (`{{ firstName }}`)
2. Document available variables
3. Provide fallback values
4. Test with sample data

### User Experience
1. Group related traits together
2. Use appropriate input types
3. Provide sensible defaults
4. Show validation feedback immediately

## Troubleshooting

### Trait not showing
1. Check component type supports trait
2. Verify trait is in component definition
3. Reload editor

### Validation not working
1. Check trait type is registered
2. Verify validation function is correct
3. Test with different values
4. Check console for errors

### Changes not saving
1. Verify trait name matches attribute
2. Check `changeProp` is set if needed
3. Confirm component model update
4. Test HTML export

