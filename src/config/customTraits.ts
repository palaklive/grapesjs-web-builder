import type { Editor } from 'grapesjs';

// URL validation helper
export const isValidUrl = (url: string): boolean => {
  if (!url || url.trim() === '') return true; // Empty is valid
  try {
    new URL(url);
    return true;
  } catch {
    // Check for relative URLs
    return url.startsWith('/') || url.startsWith('#') || url.startsWith('mailto:') || url.startsWith('tel:');
  }
};

// Email validation helper
export const isValidEmail = (email: string): boolean => {
  if (!email || email.trim() === '') return true; // Empty is valid
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Required field validation helper
export const isRequiredFieldValid = (value: string): boolean => {
  return Boolean(value && value.trim().length > 0);
};

// Data binding validation helper
export const isValidDataBinding = (value: string): boolean => {
  if (!value || value.trim() === '') return true; // Empty is valid
  // Check for valid data binding syntax: {{ variableName }}
  const dataBindingRegex = /^{{\s*[a-zA-Z_$][a-zA-Z0-9_$]*(?:\.[a-zA-Z_$][a-zA-Z0-9_$]*)*\s*}}$/;
  return dataBindingRegex.test(value.trim());
};

// Register custom trait types
export const registerCustomTraits = (editor: Editor) => {
  const traitManager = editor.TraitManager;

  // URL trait with validation
  traitManager.addType('url-validated', {
    createInput({ trait }) {
      const input = document.createElement('input');
      input.type = 'text';
      input.placeholder = trait.get('placeholder') || 'https://example.com';
      input.className = 'trait-input';
      
      input.addEventListener('blur', () => {
        const value = input.value;
        if (value && !isValidUrl(value)) {
          input.classList.add('trait-input-error');
          input.title = 'Invalid URL format';
        } else {
          input.classList.remove('trait-input-error');
          input.title = '';
        }
      });
      
      return input;
    },
    
    onUpdate({ elInput, component }) {
      const value = component.get('attributes')[this.get('name')] || '';
      elInput.value = value;
    },
    
    onEvent({ elInput, component }) {
      const value = elInput.value;
      component.addAttributes({ [this.get('name')]: value });
    },
  });

  // Email trait with validation
  traitManager.addType('email-validated', {
    createInput({ trait }) {
      const input = document.createElement('input');
      input.type = 'email';
      input.placeholder = trait.get('placeholder') || 'user@example.com';
      input.className = 'trait-input';
      
      input.addEventListener('blur', () => {
        const value = input.value;
        if (value && !isValidEmail(value)) {
          input.classList.add('trait-input-error');
          input.title = 'Invalid email format';
        } else {
          input.classList.remove('trait-input-error');
          input.title = '';
        }
      });
      
      return input;
    },
    
    onUpdate({ elInput, component }) {
      const value = component.get('attributes')[this.get('name')] || '';
      elInput.value = value;
    },
    
    onEvent({ elInput, component }) {
      const value = elInput.value;
      component.addAttributes({ [this.get('name')]: value });
    },
  });

  // Required text trait
  traitManager.addType('text-required', {
    createInput({ trait }) {
      const input = document.createElement('input');
      input.type = 'text';
      input.placeholder = trait.get('placeholder') || '';
      input.className = 'trait-input';
      input.required = true;
      
      input.addEventListener('blur', () => {
        const value = input.value.trim();
        if (!value) {
          input.classList.add('trait-input-error');
          input.title = 'This field is required';
        } else {
          input.classList.remove('trait-input-error');
          input.title = '';
        }
      });
      
      return input;
    },
    
    onUpdate({ elInput, component }) {
      const value = component.get('attributes')[this.get('name')] || '';
      elInput.value = value;
    },
    
    onEvent({ elInput, component }) {
      const value = elInput.value;
      component.addAttributes({ [this.get('name')]: value });
    },
  });

  // Number range trait
  traitManager.addType('number-range', {
    createInput({ trait }) {
      const container = document.createElement('div');
      container.className = 'trait-number-range';
      
      const input = document.createElement('input');
      input.type = 'number';
      input.min = trait.get('min') || '0';
      input.max = trait.get('max') || '100';
      input.step = trait.get('step') || '1';
      input.className = 'trait-input';
      
      const label = document.createElement('span');
      label.className = 'trait-range-label';
      label.textContent = `(${input.min}-${input.max})`;
      
      container.appendChild(input);
      container.appendChild(label);
      
      return container;
    },
    
    onUpdate({ elInput, component }) {
      const input = elInput.querySelector('input');
      if (input) {
        const value = component.get('attributes')[this.get('name')] || this.get('default') || '';
        input.value = value;
      }
    },
    
    onEvent({ elInput, component }) {
      const input = elInput.querySelector('input');
      if (input) {
        const value = input.value;
        component.addAttributes({ [this.get('name')]: value });
      }
    },
  });

  // Data binding trait (for future dynamic content)
  traitManager.addType('data-binding', {
    createInput({ trait }) {
      const container = document.createElement('div');
      container.className = 'trait-data-binding';
      
      const input = document.createElement('input');
      input.type = 'text';
      input.placeholder = '{{ variable }}';
      input.className = 'trait-input';
      
      const hint = document.createElement('small');
      hint.className = 'trait-hint';
      hint.textContent = 'Use {{ variableName }} for dynamic content';
      
      // Add validation on blur
      input.addEventListener('blur', () => {
        const value = input.value;
        if (value && !isValidDataBinding(value)) {
          input.classList.add('trait-input-error');
          input.title = 'Invalid data binding syntax. Use {{ variableName }} format';
        } else {
          input.classList.remove('trait-input-error');
          input.title = '';
        }
      });
      
      container.appendChild(input);
      container.appendChild(hint);
      
      return container;
    },
    
    onUpdate({ elInput, component }) {
      const input = elInput.querySelector('input');
      if (input) {
        const value = component.get('attributes')[this.get('name')] || '';
        input.value = value;
      }
    },
    
    onEvent({ elInput, component }) {
      const input = elInput.querySelector('input');
      if (input) {
        const value = input.value;
        component.addAttributes({ [this.get('name')]: value });
      }
    },
  });

  // Source dropdown trait for data sources
  traitManager.addType('source-dropdown', {
    createInput({ trait }) {
      const container = document.createElement('div');
      container.className = 'trait-source-dropdown';
      
      const select = document.createElement('select');
      select.className = 'trait-select';
      
      // Add default option
      const defaultOption = document.createElement('option');
      defaultOption.value = '';
      defaultOption.textContent = '- Select Data Source -';
      select.appendChild(defaultOption);
      
      // Add predefined data sources
      const dataSources = trait.get('sources') || [
        { id: 'user.firstName', name: 'User First Name' },
        { id: 'user.lastName', name: 'User Last Name' },
        { id: 'user.email', name: 'User Email' },
        { id: 'product.name', name: 'Product Name' },
        { id: 'product.price', name: 'Product Price' },
        { id: 'company.name', name: 'Company Name' },
        { id: 'order.total', name: 'Order Total' },
      ];
      
      dataSources.forEach((source: { id: string; name: string }) => {
        const option = document.createElement('option');
        option.value = `{{ ${source.id} }}`;
        option.textContent = source.name;
        select.appendChild(option);
      });
      
      // Add custom option
      const customOption = document.createElement('option');
      customOption.value = 'custom';
      customOption.textContent = 'Custom...';
      select.appendChild(customOption);
      
      const customInput = document.createElement('input');
      customInput.type = 'text';
      customInput.placeholder = '{{ custom.variable }}';
      customInput.className = 'trait-input';
      customInput.style.display = 'none';
      customInput.style.marginTop = '8px';
      
      // Handle custom option selection
      select.addEventListener('change', () => {
        if (select.value === 'custom') {
          customInput.style.display = 'block';
          customInput.focus();
        } else {
          customInput.style.display = 'none';
        }
      });
      
      // Add validation for custom input
      customInput.addEventListener('blur', () => {
        const value = customInput.value;
        if (value && !isValidDataBinding(value)) {
          customInput.classList.add('trait-input-error');
          customInput.title = 'Invalid data binding syntax. Use {{ variableName }} format';
        } else {
          customInput.classList.remove('trait-input-error');
          customInput.title = '';
        }
      });
      
      container.appendChild(select);
      container.appendChild(customInput);
      
      return container;
    },
    
    onUpdate({ elInput, component }) {
      const select = elInput.querySelector('select');
      const customInput = elInput.querySelector('input');
      if (select && customInput) {
        const value = component.get('attributes')[this.get('name')] || '';
        if (value.startsWith('{{ ') && value.endsWith(' }}')) {
          // Check if it's a predefined source
          const predefinedSources = this.get('sources') || [];
          const isPredefined = predefinedSources.some((source: { id: string }) => 
            value === `{{ ${source.id} }}`
          );
          
          if (isPredefined) {
            select.value = value;
            customInput.style.display = 'none';
          } else {
            select.value = 'custom';
            customInput.value = value;
            customInput.style.display = 'block';
          }
        } else {
          select.value = '';
          customInput.value = value;
          customInput.style.display = 'none';
        }
      }
    },
    
    onEvent({ elInput, component }) {
      const select = elInput.querySelector('select');
      const customInput = elInput.querySelector('input');
      if (select && customInput) {
        let value = '';
        if (select.value === 'custom') {
          value = customInput.value;
        } else if (select.value) {
          value = select.value;
        }
        component.addAttributes({ [this.get('name')]: value });
      }
    },
  });

  // Color picker with presets
  traitManager.addType('color-preset', {
    createInput({ trait }) {
      const container = document.createElement('div');
      container.className = 'trait-color-preset';
      
      const input = document.createElement('input');
      input.type = 'color';
      input.className = 'trait-color-input';
      
      const presets = trait.get('presets') || ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
      const presetContainer = document.createElement('div');
      presetContainer.className = 'color-presets';
      
      presets.forEach((color: string) => {
        const preset = document.createElement('button');
        preset.type = 'button';
        preset.className = 'color-preset-btn';
        preset.style.backgroundColor = color;
        preset.title = color;
        preset.addEventListener('click', () => {
          input.value = color;
          input.dispatchEvent(new Event('change'));
        });
        presetContainer.appendChild(preset);
      });
      
      container.appendChild(input);
      container.appendChild(presetContainer);
      
      return container;
    },
    
    onUpdate({ elInput, component }) {
      const input = elInput.querySelector('input[type="color"]');
      if (input) {
        const value = component.get('attributes')[this.get('name')] || '#000000';
        input.value = value;
      }
    },
    
    onEvent({ elInput, component }) {
      const input = elInput.querySelector('input[type="color"]');
      if (input) {
        const value = input.value;
        component.addAttributes({ [this.get('name')]: value });
      }
    },
  });
};

// Common trait configurations for reuse
export const commonTraits = {
  // Link traits
  href: {
    type: 'url-validated',
    label: 'Link URL',
    name: 'href',
    placeholder: 'https://example.com',
  },
  
  target: {
    type: 'select',
    label: 'Link Target',
    name: 'target',
    options: [
      { id: '', name: 'Same Window' },
      { id: '_blank', name: 'New Window' },
    ],
  },
  
  // Image traits
  src: {
    type: 'text',
    label: 'Image Source',
    name: 'src',
    placeholder: 'https://example.com/image.jpg',
  },
  
  alt: {
    type: 'text-required',
    label: 'Alt Text',
    name: 'alt',
    placeholder: 'Describe the image',
  },
  
  width: {
    type: 'number-range',
    label: 'Width',
    name: 'width',
    min: '0',
    max: '1000',
    step: '1',
  },
  
  height: {
    type: 'number-range',
    label: 'Height',
    name: 'height',
    min: '0',
    max: '1000',
    step: '1',
  },
  
  // Text traits
  placeholder: {
    type: 'text',
    label: 'Placeholder',
    name: 'placeholder',
  },
  
  // Button traits
  type: {
    type: 'select',
    label: 'Button Type',
    name: 'type',
    options: [
      { id: 'button', name: 'Button' },
      { id: 'submit', name: 'Submit' },
      { id: 'reset', name: 'Reset' },
    ],
  },
  
  // Data binding
  dataBinding: {
    type: 'data-binding',
    label: 'Data Source',
    name: 'data-bind',
  },
  
  // Source dropdown for common data sources
  sourceDropdown: {
    type: 'source-dropdown',
    label: 'Data Source',
    name: 'data-source',
    sources: [
      { id: 'user.firstName', name: 'User First Name' },
      { id: 'user.lastName', name: 'User Last Name' },
      { id: 'user.email', name: 'User Email' },
      { id: 'product.name', name: 'Product Name' },
      { id: 'product.price', name: 'Product Price' },
      { id: 'company.name', name: 'Company Name' },
      { id: 'order.total', name: 'Order Total' },
    ],
  },
};

