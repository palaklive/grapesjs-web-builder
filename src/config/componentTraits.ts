import type { Editor } from 'grapesjs';
import { commonTraits } from './customTraits';

// Enhance default components with custom traits
export const enhanceComponentTraits = (editor: Editor) => {
  // Image component
  editor.DomComponents.addType('image', {
    model: {
      defaults: {
        traits: [
          commonTraits.src,
          commonTraits.alt,
          {
            type: 'number',
            label: 'Width',
            name: 'width',
          },
          {
            type: 'number',
            label: 'Height',
            name: 'height',
          },
          {
            type: 'text',
            label: 'Title',
            name: 'title',
            placeholder: 'Tooltip text',
          },
        ],
      },
    },
  });

  // Link component
  editor.DomComponents.addType('link', {
    model: {
      defaults: {
        traits: [
          commonTraits.href,
          commonTraits.target,
          {
            type: 'text',
            label: 'Title',
            name: 'title',
            placeholder: 'Link title',
          },
        ],
      },
    },
  });

  // Text component - add data binding option
  editor.DomComponents.addType('text', {
    model: {
      defaults: {
        traits: [
          {
            type: 'text',
            label: 'Content',
            name: 'content',
            changeProp: 1,
          },
          commonTraits.sourceDropdown,
        ],
      },
    },
  });

  // Button component with enhanced traits
  editor.DomComponents.addType('button', {
    extend: 'link',
    isComponent: (el) => el?.tagName === 'BUTTON',
    model: {
      defaults: {
        tagName: 'button',
        attributes: { type: 'button' },
        traits: [
          {
            type: 'text-required',
            label: 'Button Text',
            name: 'text',
            changeProp: 1,
          },
          commonTraits.type,
          commonTraits.href,
          commonTraits.target,
          {
            type: 'color-preset',
            label: 'Background Color',
            name: 'data-bg-color',
            presets: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'],
          },
        ],
      },
    },
  });

  // Input component with validation
  editor.DomComponents.addType('input', {
    isComponent: (el) => el?.tagName === 'INPUT',
    model: {
      defaults: {
        tagName: 'input',
        droppable: false,
        traits: [
          {
            type: 'select',
            label: 'Type',
            name: 'type',
            options: [
              { id: 'text', name: 'Text' },
              { id: 'email', name: 'Email' },
              { id: 'password', name: 'Password' },
              { id: 'number', name: 'Number' },
              { id: 'tel', name: 'Telephone' },
              { id: 'url', name: 'URL' },
            ],
          },
          {
            type: 'text',
            label: 'Name',
            name: 'name',
          },
          commonTraits.placeholder,
          {
            type: 'checkbox',
            label: 'Required',
            name: 'required',
          },
        ],
      },
    },
  });
};

