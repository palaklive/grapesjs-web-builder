import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { TraitsPanel } from '../RightPanel';
import type { Editor, Component } from 'grapesjs';

// Mock useEditor hook
const mockEditor = {
  on: vi.fn(),
  off: vi.fn(),
  getSelected: vi.fn(),
} as unknown as Editor;

const createMockComponent = (id: string, type: string = 'text', traits: unknown[] = []): Component => {
  const comp = {
    getId: () => id,
    get: (key: string) => {
      if (key === 'type') return type;
      if (key === 'traits') return traits;
      if (key === 'attributes') return {};
      return null;
    },
    addAttributes: vi.fn(),
  } as unknown as Component;
  return comp;
};

const createMockTrait = (id: string, type: string, name: string, label: string, options: Record<string, unknown> = {}) => ({
  getId: () => id,
  get: (key: string) => {
    if (key === 'type') return type;
    if (key === 'name') return name;
    if (key === 'label') return label;
    return options[key];
  },
});

vi.mock('@grapesjs/react', () => ({
  useEditor: () => mockEditor,
}));

describe('TraitsPanel', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders no traits message when no component is selected', () => {
    render(<TraitsPanel />);
    
    expect(screen.getByText('Select a component to edit its properties')).toBeInTheDocument();
  });

  it('renders traits when component is selected', () => {
    const traits = [
      createMockTrait('trait-1', 'text', 'content', 'Content'),
      createMockTrait('trait-2', 'number', 'width', 'Width'),
    ];
    const component = createMockComponent('comp-1', 'text', traits);
    
    // Mock component selection
    mockEditor.on.mockImplementation((event, handler) => {
      if (event === 'component:selected') {
        setTimeout(() => handler(component), 0);
      }
    });

    render(<TraitsPanel />);
    
    expect(screen.getByText('Content')).toBeInTheDocument();
    expect(screen.getByText('Width')).toBeInTheDocument();
  });

  describe('URL Validated Input', () => {
    it('validates URL on blur', async () => {
      const traits = [
        createMockTrait('trait-1', 'url-validated', 'href', 'Link URL', { placeholder: 'https://example.com' }),
      ];
      const component = createMockComponent('comp-1', 'link', traits);
      
      mockEditor.on.mockImplementation((event, handler) => {
        if (event === 'component:selected') {
          setTimeout(() => handler(component), 0);
        }
      });

      render(<TraitsPanel />);
      
      const input = screen.getByPlaceholderText('https://example.com');
      fireEvent.change(input, { target: { value: 'invalid-url' } });
      fireEvent.blur(input);
      
      await waitFor(() => {
        expect(input).toHaveClass('trait-input-error');
        expect(input).toHaveAttribute('title', 'Invalid URL format');
      });
    });

    it('accepts valid URLs', async () => {
      const traits = [
        createMockTrait('trait-1', 'url-validated', 'href', 'Link URL'),
      ];
      const component = createMockComponent('comp-1', 'link', traits);
      
      mockEditor.on.mockImplementation((event, handler) => {
        if (event === 'component:selected') {
          setTimeout(() => handler(component), 0);
        }
      });

      render(<TraitsPanel />);
      
      const input = screen.getByRole('textbox');
      fireEvent.change(input, { target: { value: 'https://example.com' } });
      fireEvent.blur(input);
      
      await waitFor(() => {
        expect(input).not.toHaveClass('trait-input-error');
      });
    });
  });

  describe('Email Validated Input', () => {
    it('validates email on blur', async () => {
      const traits = [
        createMockTrait('trait-1', 'email-validated', 'email', 'Email Address'),
      ];
      const component = createMockComponent('comp-1', 'input', traits);
      
      mockEditor.on.mockImplementation((event, handler) => {
        if (event === 'component:selected') {
          setTimeout(() => handler(component), 0);
        }
      });

      render(<TraitsPanel />);
      
      const input = screen.getByRole('textbox');
      fireEvent.change(input, { target: { value: 'invalid-email' } });
      fireEvent.blur(input);
      
      await waitFor(() => {
        expect(input).toHaveClass('trait-input-error');
        expect(input).toHaveAttribute('title', 'Invalid email format');
      });
    });

    it('accepts valid emails', async () => {
      const traits = [
        createMockTrait('trait-1', 'email-validated', 'email', 'Email Address'),
      ];
      const component = createMockComponent('comp-1', 'input', traits);
      
      mockEditor.on.mockImplementation((event, handler) => {
        if (event === 'component:selected') {
          setTimeout(() => handler(component), 0);
        }
      });

      render(<TraitsPanel />);
      
      const input = screen.getByRole('textbox');
      fireEvent.change(input, { target: { value: 'user@example.com' } });
      fireEvent.blur(input);
      
      await waitFor(() => {
        expect(input).not.toHaveClass('trait-input-error');
      });
    });
  });

  describe('Required Text Input', () => {
    it('validates required field on blur', async () => {
      const traits = [
        createMockTrait('trait-1', 'text-required', 'alt', 'Alt Text'),
      ];
      const component = createMockComponent('comp-1', 'image', traits);
      
      mockEditor.on.mockImplementation((event, handler) => {
        if (event === 'component:selected') {
          setTimeout(() => handler(component), 0);
        }
      });

      render(<TraitsPanel />);
      
      const input = screen.getByRole('textbox');
      fireEvent.change(input, { target: { value: '' } });
      fireEvent.blur(input);
      
      await waitFor(() => {
        expect(input).toHaveClass('trait-input-error');
        expect(input).toHaveAttribute('title', 'This field is required');
      });
    });

    it('accepts non-empty values', async () => {
      const traits = [
        createMockTrait('trait-1', 'text-required', 'alt', 'Alt Text'),
      ];
      const component = createMockComponent('comp-1', 'image', traits);
      
      mockEditor.on.mockImplementation((event, handler) => {
        if (event === 'component:selected') {
          setTimeout(() => handler(component), 0);
        }
      });

      render(<TraitsPanel />);
      
      const input = screen.getByRole('textbox');
      fireEvent.change(input, { target: { value: 'Image description' } });
      fireEvent.blur(input);
      
      await waitFor(() => {
        expect(input).not.toHaveClass('trait-input-error');
      });
    });
  });

  describe('Data Binding Input', () => {
    it('validates data binding syntax on blur', async () => {
      const traits = [
        createMockTrait('trait-1', 'data-binding', 'data-bind', 'Data Source'),
      ];
      const component = createMockComponent('comp-1', 'text', traits);
      
      mockEditor.on.mockImplementation((event, handler) => {
        if (event === 'component:selected') {
          setTimeout(() => handler(component), 0);
        }
      });

      render(<TraitsPanel />);
      
      const input = screen.getByPlaceholderText('{{ variable }}');
      fireEvent.change(input, { target: { value: 'invalid syntax' } });
      fireEvent.blur(input);
      
      await waitFor(() => {
        expect(input).toHaveClass('trait-input-error');
        expect(input).toHaveAttribute('title', 'Invalid data binding syntax. Use {{ variableName }} format');
      });
    });

    it('accepts valid data binding syntax', async () => {
      const traits = [
        createMockTrait('trait-1', 'data-binding', 'data-bind', 'Data Source'),
      ];
      const component = createMockComponent('comp-1', 'text', traits);
      
      mockEditor.on.mockImplementation((event, handler) => {
        if (event === 'component:selected') {
          setTimeout(() => handler(component), 0);
        }
      });

      render(<TraitsPanel />);
      
      const input = screen.getByPlaceholderText('{{ variable }}');
      fireEvent.change(input, { target: { value: '{{ user.name }}' } });
      fireEvent.blur(input);
      
      await waitFor(() => {
        expect(input).not.toHaveClass('trait-input-error');
      });
    });
  });

  describe('Source Dropdown Input', () => {
    it('renders predefined sources', () => {
      const traits = [
        createMockTrait('trait-1', 'source-dropdown', 'data-source', 'Data Source', {
          sources: [
            { id: 'user.firstName', name: 'User First Name' },
            { id: 'user.lastName', name: 'User Last Name' },
          ]
        }),
      ];
      const component = createMockComponent('comp-1', 'text', traits);
      
      mockEditor.on.mockImplementation((event, handler) => {
        if (event === 'component:selected') {
          setTimeout(() => handler(component), 0);
        }
      });

      render(<TraitsPanel />);
      
      expect(screen.getByText('User First Name')).toBeInTheDocument();
      expect(screen.getByText('User Last Name')).toBeInTheDocument();
      expect(screen.getByText('Custom...')).toBeInTheDocument();
    });

    it('shows custom input when custom option is selected', async () => {
      const traits = [
        createMockTrait('trait-1', 'source-dropdown', 'data-source', 'Data Source', {
          sources: [{ id: 'user.name', name: 'User Name' }]
        }),
      ];
      const component = createMockComponent('comp-1', 'text', traits);
      
      mockEditor.on.mockImplementation((event, handler) => {
        if (event === 'component:selected') {
          setTimeout(() => handler(component), 0);
        }
      });

      render(<TraitsPanel />);
      
      const select = screen.getByRole('combobox');
      fireEvent.change(select, { target: { value: 'custom' } });
      
      await waitFor(() => {
        expect(screen.getByPlaceholderText('{{ custom.variable }}')).toBeInTheDocument();
      });
    });
  });

  describe('Number Range Input', () => {
    it('renders with min/max labels', () => {
      const traits = [
        createMockTrait('trait-1', 'number-range', 'width', 'Width', {
          min: '0',
          max: '1000',
          step: '1'
        }),
      ];
      const component = createMockComponent('comp-1', 'image', traits);
      
      mockEditor.on.mockImplementation((event, handler) => {
        if (event === 'component:selected') {
          setTimeout(() => handler(component), 0);
        }
      });

      render(<TraitsPanel />);
      
      expect(screen.getByText('(0-1000)')).toBeInTheDocument();
      expect(screen.getByRole('spinbutton')).toHaveAttribute('min', '0');
      expect(screen.getByRole('spinbutton')).toHaveAttribute('max', '1000');
    });
  });

  describe('Color Preset Input', () => {
    it('renders color picker and preset buttons', () => {
      const traits = [
        createMockTrait('trait-1', 'color-preset', 'bg-color', 'Background Color', {
          presets: ['#ff0000', '#00ff00', '#0000ff']
        }),
      ];
      const component = createMockComponent('comp-1', 'button', traits);
      
      mockEditor.on.mockImplementation((event, handler) => {
        if (event === 'component:selected') {
          setTimeout(() => handler(component), 0);
        }
      });

      render(<TraitsPanel />);
      
      expect(screen.getByRole('textbox')).toHaveAttribute('type', 'color');
      expect(screen.getAllByRole('button')).toHaveLength(3); // Preset buttons
    });
  });

  describe('Component Model Updates', () => {
    it('updates component attributes when trait values change', async () => {
      const traits = [
        createMockTrait('trait-1', 'text', 'content', 'Content'),
      ];
      const component = createMockComponent('comp-1', 'text', traits);
      
      mockEditor.on.mockImplementation((event, handler) => {
        if (event === 'component:selected') {
          setTimeout(() => handler(component), 0);
        }
      });

      render(<TraitsPanel />);
      
      const input = screen.getByRole('textbox');
      fireEvent.change(input, { target: { value: 'New content' } });
      
      expect(component.addAttributes).toHaveBeenCalledWith({ content: 'New content' });
    });

    it('handles component deselection', () => {
      const traits = [
        createMockTrait('trait-1', 'text', 'content', 'Content'),
      ];
      const component = createMockComponent('comp-1', 'text', traits);
      
      mockEditor.on.mockImplementation((event, handler) => {
        if (event === 'component:selected') {
          setTimeout(() => handler(component), 0);
        } else if (event === 'component:deselected') {
          setTimeout(() => handler(), 0);
        }
      });

      const { rerender } = render(<TraitsPanel />);
      
      // First select component
      expect(screen.getByText('Content')).toBeInTheDocument();
      
      // Then deselect
      mockEditor.on.mockImplementation((event, handler) => {
        if (event === 'component:deselected') {
          setTimeout(() => handler(), 0);
        }
      });
      
      rerender(<TraitsPanel />);
      
      expect(screen.getByText('Select a component to edit its properties')).toBeInTheDocument();
    });
  });

  describe('Standard Trait Types', () => {
    it('renders text input for text traits', () => {
      const traits = [
        createMockTrait('trait-1', 'text', 'content', 'Content', { placeholder: 'Enter text' }),
      ];
      const component = createMockComponent('comp-1', 'text', traits);
      
      mockEditor.on.mockImplementation((event, handler) => {
        if (event === 'component:selected') {
          setTimeout(() => handler(component), 0);
        }
      });

      render(<TraitsPanel />);
      
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('type', 'text');
      expect(input).toHaveAttribute('placeholder', 'Enter text');
    });

    it('renders number input for number traits', () => {
      const traits = [
        createMockTrait('trait-1', 'number', 'width', 'Width', { min: '0', max: '100' }),
      ];
      const component = createMockComponent('comp-1', 'image', traits);
      
      mockEditor.on.mockImplementation((event, handler) => {
        if (event === 'component:selected') {
          setTimeout(() => handler(component), 0);
        }
      });

      render(<TraitsPanel />);
      
      const input = screen.getByRole('spinbutton');
      expect(input).toHaveAttribute('type', 'number');
      expect(input).toHaveAttribute('min', '0');
      expect(input).toHaveAttribute('max', '100');
    });

    it('renders checkbox for checkbox traits', () => {
      const traits = [
        createMockTrait('trait-1', 'checkbox', 'required', 'Required'),
      ];
      const component = createMockComponent('comp-1', 'input', traits);
      
      mockEditor.on.mockImplementation((event, handler) => {
        if (event === 'component:selected') {
          setTimeout(() => handler(component), 0);
        }
      });

      render(<TraitsPanel />);
      
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toHaveAttribute('type', 'checkbox');
    });

    it('renders select for select traits', () => {
      const traits = [
        createMockTrait('trait-1', 'select', 'type', 'Type', {
          options: [
            { id: 'button', name: 'Button' },
            { id: 'submit', name: 'Submit' }
          ]
        }),
      ];
      const component = createMockComponent('comp-1', 'button', traits);
      
      mockEditor.on.mockImplementation((event, handler) => {
        if (event === 'component:selected') {
          setTimeout(() => handler(component), 0);
        }
      });

      render(<TraitsPanel />);
      
      const select = screen.getByRole('combobox');
      expect(select).toHaveAttribute('tagName', 'SELECT');
      expect(screen.getByText('Button')).toBeInTheDocument();
      expect(screen.getByText('Submit')).toBeInTheDocument();
    });
  });
});
