// Design tokens for consistent styling across the web builder
export const designTokens = {
  colors: {
    primary: {
      50: '#eff6ff',
      100: '#dbeafe',
      200: '#bfdbfe',
      300: '#93c5fd',
      400: '#60a5fa',
      500: '#3b82f6',
      600: '#2563eb',
      700: '#1d4ed8',
      800: '#1e40af',
      900: '#1e3a8a',
    },
    neutral: {
      50: '#f8fafc',
      100: '#f1f5f9',
      200: '#e2e8f0',
      300: '#cbd5e1',
      400: '#94a3b8',
      500: '#64748b',
      600: '#475569',
      700: '#334155',
      800: '#1e293b',
      900: '#0f172a',
    },
    success: {
      500: '#10b981',
      600: '#059669',
    },
    warning: {
      500: '#f59e0b',
      600: '#d97706',
    },
    error: {
      500: '#ef4444',
      600: '#dc2626',
    },
  },
  typography: {
    fontFamilies: [
      { id: 'system', name: 'System Default', value: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' },
      { id: 'inter', name: 'Inter', value: '"Inter", -apple-system, sans-serif' },
      { id: 'georgia', name: 'Georgia', value: 'Georgia, serif' },
      { id: 'times', name: 'Times New Roman', value: '"Times New Roman", Times, serif' },
      { id: 'courier', name: 'Courier', value: '"Courier New", Courier, monospace' },
      { id: 'arial', name: 'Arial', value: 'Arial, sans-serif' },
      { id: 'helvetica', name: 'Helvetica', value: 'Helvetica, Arial, sans-serif' },
      { id: 'verdana', name: 'Verdana', value: 'Verdana, sans-serif' },
    ],
    fontSizes: [
      { id: 'xs', name: 'Extra Small', value: '12px' },
      { id: 'sm', name: 'Small', value: '14px' },
      { id: 'base', name: 'Base', value: '16px' },
      { id: 'lg', name: 'Large', value: '18px' },
      { id: 'xl', name: 'Extra Large', value: '20px' },
      { id: '2xl', name: '2XL', value: '24px' },
      { id: '3xl', name: '3XL', value: '30px' },
      { id: '4xl', name: '4XL', value: '36px' },
      { id: '5xl', name: '5XL', value: '48px' },
    ],
    fontWeights: [
      { id: 'light', name: 'Light', value: '300' },
      { id: 'normal', name: 'Normal', value: '400' },
      { id: 'medium', name: 'Medium', value: '500' },
      { id: 'semibold', name: 'Semibold', value: '600' },
      { id: 'bold', name: 'Bold', value: '700' },
      { id: 'extrabold', name: 'Extra Bold', value: '800' },
    ],
    lineHeights: [
      { id: 'tight', name: 'Tight', value: '1.25' },
      { id: 'snug', name: 'Snug', value: '1.375' },
      { id: 'normal', name: 'Normal', value: '1.5' },
      { id: 'relaxed', name: 'Relaxed', value: '1.625' },
      { id: 'loose', name: 'Loose', value: '2' },
    ],
  },
  spacing: {
    options: [
      { id: '0', name: 'None', value: '0' },
      { id: '1', name: 'XS', value: '4px' },
      { id: '2', name: 'SM', value: '8px' },
      { id: '3', name: 'MD', value: '12px' },
      { id: '4', name: 'LG', value: '16px' },
      { id: '5', name: 'XL', value: '20px' },
      { id: '6', name: '2XL', value: '24px' },
      { id: '8', name: '3XL', value: '32px' },
      { id: '10', name: '4XL', value: '40px' },
      { id: '12', name: '5XL', value: '48px' },
    ],
  },
  borders: {
    radius: [
      { id: 'none', name: 'None', value: '0' },
      { id: 'sm', name: 'Small', value: '4px' },
      { id: 'md', name: 'Medium', value: '6px' },
      { id: 'lg', name: 'Large', value: '8px' },
      { id: 'xl', name: 'Extra Large', value: '12px' },
      { id: '2xl', name: '2XL', value: '16px' },
      { id: 'full', name: 'Full', value: '9999px' },
    ],
    widths: [
      { id: '0', name: 'None', value: '0' },
      { id: '1', name: 'Thin', value: '1px' },
      { id: '2', name: 'Medium', value: '2px' },
      { id: '4', name: 'Thick', value: '4px' },
      { id: '8', name: 'Extra Thick', value: '8px' },
    ],
    styles: [
      { id: 'solid', name: 'Solid', value: 'solid' },
      { id: 'dashed', name: 'Dashed', value: 'dashed' },
      { id: 'dotted', name: 'Dotted', value: 'dotted' },
      { id: 'double', name: 'Double', value: 'double' },
      { id: 'none', name: 'None', value: 'none' },
    ],
  },
  shadows: {
    options: [
      { id: 'none', name: 'None', value: 'none' },
      { id: 'sm', name: 'Small', value: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' },
      { id: 'md', name: 'Medium', value: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' },
      { id: 'lg', name: 'Large', value: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)' },
      { id: 'xl', name: 'Extra Large', value: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' },
    ],
  },
};

// Helper to get color options for style manager
export const getColorOptions = () => {
  const options: Array<{ id: string; label: string }> = [];
  
  Object.entries(designTokens.colors).forEach(([category, shades]) => {
    if (typeof shades === 'object') {
      Object.entries(shades).forEach(([shade, value]) => {
        options.push({
          id: value,
          label: `${category}-${shade}`,
        });
      });
    }
  });
  
  return options;
};

