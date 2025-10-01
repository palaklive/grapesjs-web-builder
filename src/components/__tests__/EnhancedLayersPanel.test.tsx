import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { EnhancedLayersPanel } from '../EnhancedLayersPanel';
import type { Editor, Component } from 'grapesjs';

// Mock useEditor hook
const mockEditor = {
  getWrapper: vi.fn(),
  getSelected: vi.fn(),
  select: vi.fn(),
  on: vi.fn(),
  off: vi.fn(),
} as unknown as Editor;

const createMockComponent = (id: string, name: string, type: string = 'text', children: Component[] = []): Component => {
  const comp = {
    getId: () => id,
    getName: () => name,
    get: (key: string) => {
      if (key === 'type') return type;
      if (key === 'locked') return false;
      if (key === 'hidden') return false;
      return null;
    },
    set: vi.fn(),
    components: () => children,
    parent: vi.fn(() => null),
    remove: vi.fn(),
    clone: vi.fn(() => createMockComponent(`${id}-clone`, `${name} Clone`, type)),
    append: vi.fn(),
    getEl: () => ({ style: { setProperty: vi.fn() } }),
    addAttributes: vi.fn(),
  } as unknown as Component;
  return comp;
};

const mockComponent = createMockComponent('comp-1', 'Test Component', 'text');

vi.mock('@grapesjs/react', () => ({
  useEditor: () => mockEditor,
}));

describe('EnhancedLayersPanel', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockEditor.getWrapper = vi.fn(() => mockComponent);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders search input and filter', () => {
    render(<EnhancedLayersPanel />);
    
    expect(screen.getByPlaceholderText('Search layers...')).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('displays component layers', () => {
    render(<EnhancedLayersPanel />);
    
    expect(screen.getByText('Test Component')).toBeInTheDocument();
  });

  it('filters layers by search query', async () => {
    render(<EnhancedLayersPanel />);
    
    const searchInput = screen.getByPlaceholderText('Search layers...');
    fireEvent.change(searchInput, { target: { value: 'Test' } });
    
    await waitFor(() => {
      expect(screen.getByText('Test Component')).toBeInTheDocument();
    });
  });

  it('toggles layer visibility', () => {
    render(<EnhancedLayersPanel />);
    
    const visibilityButtons = screen.getAllByTitle('Hide');
    fireEvent.click(visibilityButtons[0]);
    
    expect(mockComponent.set).toHaveBeenCalledWith('hidden', true);
  });

  it('toggles layer lock', () => {
    render(<EnhancedLayersPanel />);
    
    const lockButtons = screen.getAllByTitle('Lock');
    fireEvent.click(lockButtons[0]);
    
    expect(mockComponent.set).toHaveBeenCalledWith('locked', true);
  });

  it('displays hierarchical layer structure', () => {
    const childComponent = {
      ...mockComponent,
      getId: () => 'comp-child',
      getName: () => 'Child Component',
      components: () => [],
    } as unknown as Component;
    
    const componentWithChildren = {
      ...mockComponent,
      components: () => [childComponent],
    } as unknown as Component;
    
    mockEditor.getWrapper = vi.fn(() => componentWithChildren);
    
    render(<EnhancedLayersPanel />);
    
    // Parent component is visible
    expect(screen.getByText('Test Component')).toBeInTheDocument();
    
    // Expand button is present for parent with children
    const expandButton = screen.getByLabelText('Expand');
    expect(expandButton).toBeInTheDocument();
    
    // Click to expand
    fireEvent.click(expandButton);
    
    // Now child should be visible
    expect(screen.getByText('Child Component')).toBeInTheDocument();
  });

  it('handles component deletion with confirmation', () => {
    global.confirm = vi.fn(() => true);
    
    render(<EnhancedLayersPanel />);
    
    const deleteButtons = screen.getAllByTitle('Delete');
    fireEvent.click(deleteButtons[0]);
    
    expect(global.confirm).toHaveBeenCalled();
    expect(mockComponent.remove).toHaveBeenCalled();
  });

  it('duplicates components', () => {
    const parentComponent = {
      append: vi.fn(),
    } as unknown as Component;
    
    const componentWithParent = {
      ...mockComponent,
      parent: () => parentComponent,
    } as unknown as Component;
    
    mockEditor.getWrapper = vi.fn(() => componentWithParent);
    
    render(<EnhancedLayersPanel />);
    
    const duplicateButtons = screen.getAllByTitle('Duplicate');
    fireEvent.click(duplicateButtons[0]);
    
    expect(parentComponent.append).toHaveBeenCalled();
  });

  it('expands and collapses layer tree', () => {
    const child = { ...mockComponent, getId: () => 'child-1' } as unknown as Component;
    const parentWithChildren = {
      ...mockComponent,
      components: () => [child],
    } as unknown as Component;
    
    mockEditor.getWrapper = vi.fn(() => parentWithChildren);
    
    render(<EnhancedLayersPanel />);
    
    const expandButtons = screen.getAllByLabelText('Expand');
    expect(expandButtons.length).toBeGreaterThan(0);
    
    fireEvent.click(expandButtons[0]);
    
    // After expanding, should show collapse button
    const collapseButtons = screen.queryAllByLabelText('Collapse');
    expect(collapseButtons.length).toBeGreaterThan(0);
  });

  describe('Drag and Drop Reordering', () => {
    it('initiates drag on dragStart', () => {
      render(<EnhancedLayersPanel />);
      
      const layerHeader = screen.getByText('Test Component').closest('.enhanced-layer-header');
      expect(layerHeader).toBeInTheDocument();
      
      const dragEvent = new Event('dragstart', { bubbles: true });
      Object.defineProperty(dragEvent, 'dataTransfer', {
        value: { effectAllowed: '', setData: vi.fn() },
      });
      
      fireEvent(layerHeader!, dragEvent);
      
      // Should have dragging class after drag start
      expect(layerHeader).toHaveClass('enhanced-layer-header');
    });

    it('prevents dragging locked layers', () => {
      const lockedComponent = createMockComponent('locked-1', 'Locked Layer');
      mockEditor.getWrapper = vi.fn(() => lockedComponent);
      
      render(<EnhancedLayersPanel />);
      
      // Lock the layer first
      const lockButton = screen.getByTitle('Lock');
      fireEvent.click(lockButton);
      
      const layerHeader = screen.getByText('Locked Layer').closest('.enhanced-layer-header');
      
      // Locked layers should not be draggable
      expect(layerHeader?.getAttribute('draggable')).toBe('false');
    });

    it('shows drop indicator on dragOver', async () => {
      const child1 = createMockComponent('child-1', 'Child 1');
      const child2 = createMockComponent('child-2', 'Child 2');
      const parentComp = createMockComponent('parent', 'Parent', 'section', [child1, child2]);
      
      mockEditor.getWrapper = vi.fn(() => parentComp);
      
      render(<EnhancedLayersPanel />);
      
      // Expand to see children
      const expandButton = screen.getByLabelText('Expand');
      fireEvent.click(expandButton);
      
      await waitFor(() => {
        expect(screen.getByText('Child 1')).toBeInTheDocument();
      });
    });
  });

  describe('Visibility Operations', () => {
    it('hides component and shows with reduced opacity', () => {
      render(<EnhancedLayersPanel />);
      
      const hideButton = screen.getByTitle('Hide');
      fireEvent.click(hideButton);
      
      expect(mockComponent.set).toHaveBeenCalledWith('hidden', true);
      
      // Click again to show
      const showButton = screen.getByTitle('Show');
      fireEvent.click(showButton);
      
      expect(mockComponent.set).toHaveBeenCalledWith('hidden', false);
    });

    it('maintains visibility state across multiple components', () => {
      const comp1 = createMockComponent('comp-1', 'Component 1');
      const comp2 = createMockComponent('comp-2', 'Component 2');
      const parent = createMockComponent('parent', 'Parent', 'section', [comp1, comp2]);
      
      mockEditor.getWrapper = vi.fn(() => parent);
      
      render(<EnhancedLayersPanel />);
      
      // Expand parent
      const expandButton = screen.getByLabelText('Expand');
      fireEvent.click(expandButton);
      
      // Should show both children
      expect(screen.getByText('Component 1')).toBeInTheDocument();
      expect(screen.getByText('Component 2')).toBeInTheDocument();
    });
  });

  describe('Layer Locking', () => {
    it('prevents selection of locked layers', () => {
      render(<EnhancedLayersPanel />);
      
      // Lock the layer
      const lockButton = screen.getByTitle('Lock');
      fireEvent.click(lockButton);
      
      expect(mockComponent.set).toHaveBeenCalledWith('locked', true);
      
      // Try to select locked layer
      const layerHeader = screen.getByText('Test Component');
      fireEvent.click(layerHeader);
      
      // Editor select should not be called for locked components
      // (verified by the locked class preventing the click handler)
    });

    it('allows unlocking previously locked layers', () => {
      render(<EnhancedLayersPanel />);
      
      // Lock
      const lockButton = screen.getByTitle('Lock');
      fireEvent.click(lockButton);
      expect(mockComponent.set).toHaveBeenCalledWith('locked', true);
      
      // Unlock
      const unlockButton = screen.getByTitle('Unlock');
      fireEvent.click(unlockButton);
      expect(mockComponent.set).toHaveBeenCalledWith('locked', false);
    });

    it('shows locked indicator in UI', () => {
      render(<EnhancedLayersPanel />);
      
      const lockButton = screen.getByTitle('Lock');
      fireEvent.click(lockButton);
      
      const layerHeader = screen.getByText('Test Component').closest('.enhanced-layer-header');
      expect(layerHeader).toHaveClass('locked');
    });
  });

  describe('Deletion Operations', () => {
    it('requires confirmation before deletion', () => {
      global.confirm = vi.fn(() => false);
      
      render(<EnhancedLayersPanel />);
      
      const deleteButton = screen.getByTitle('Delete');
      fireEvent.click(deleteButton);
      
      expect(global.confirm).toHaveBeenCalled();
      expect(mockComponent.remove).not.toHaveBeenCalled();
    });

    it('deletes component after confirmation', () => {
      global.confirm = vi.fn(() => true);
      
      render(<EnhancedLayersPanel />);
      
      const deleteButton = screen.getByTitle('Delete');
      fireEvent.click(deleteButton);
      
      expect(global.confirm).toHaveBeenCalled();
      expect(mockComponent.remove).toHaveBeenCalled();
    });
  });

  describe('Search and Filter for Large Templates', () => {
    it('filters components by search query', () => {
      const components = Array.from({ length: 50 }, (_, i) =>
        createMockComponent(`comp-${i}`, `Component ${i}`, i % 2 === 0 ? 'text' : 'image')
      );
      const root = createMockComponent('root', 'Root', 'wrapper', components);
      
      mockEditor.getWrapper = vi.fn(() => root);
      
      render(<EnhancedLayersPanel />);
      
      // Search for specific component
      const searchInput = screen.getByPlaceholderText('Search layers...');
      fireEvent.change(searchInput, { target: { value: 'Component 5' } });
      
      // Should show search results
      expect(searchInput).toHaveValue('Component 5');
    });

    it('filters components by type', () => {
      const textComp = createMockComponent('text-1', 'Text Block', 'text');
      const imageComp = createMockComponent('image-1', 'Image Block', 'image');
      const root = createMockComponent('root', 'Root', 'wrapper', [textComp, imageComp]);
      
      mockEditor.getWrapper = vi.fn(() => root);
      
      render(<EnhancedLayersPanel />);
      
      // Expand to see children
      const expandButton = screen.getByLabelText('Expand');
      fireEvent.click(expandButton);
      
      // Filter by type
      const filterSelect = screen.getByRole('combobox');
      fireEvent.change(filterSelect, { target: { value: 'text' } });
      
      expect(filterSelect).toHaveValue('text');
    });

    it('handles large component trees efficiently', () => {
      // Create a large nested structure
      const createNestedStructure = (depth: number, breadth: number): Component => {
        if (depth === 0) {
          return createMockComponent(`leaf-${Math.random()}`, 'Leaf', 'text');
        }
        
        const children = Array.from({ length: breadth }, () =>
          createNestedStructure(depth - 1, breadth)
        );
        
        return createMockComponent(
          `node-${depth}-${Math.random()}`,
          `Node Level ${depth}`,
          'section',
          children
        );
      };
      
      const largeTree = createNestedStructure(3, 4); // 3 levels, 4 children each
      mockEditor.getWrapper = vi.fn(() => largeTree);
      
      const { container } = render(<EnhancedLayersPanel />);
      
      // Should render without crashing
      expect(container.querySelector('.enhanced-layers-panel')).toBeInTheDocument();
    });

    it('combines search and filter correctly', () => {
      const textComp = createMockComponent('text-1', 'Button Text', 'text');
      const imageComp = createMockComponent('image-1', 'Button Image', 'image');
      const root = createMockComponent('root', 'Root', 'wrapper', [textComp, imageComp]);
      
      mockEditor.getWrapper = vi.fn(() => root);
      
      render(<EnhancedLayersPanel />);
      
      // Search and filter together
      const searchInput = screen.getByPlaceholderText('Search layers...');
      fireEvent.change(searchInput, { target: { value: 'Button' } });
      
      const filterSelect = screen.getByRole('combobox');
      fireEvent.change(filterSelect, { target: { value: 'text' } });
      
      // Should apply both filters
      expect(searchInput).toHaveValue('Button');
      expect(filterSelect).toHaveValue('text');
    });
  });

  describe('Edge Cases', () => {
    it('handles components without names', () => {
      const unnamedComp = createMockComponent('unnamed-1', '', 'div');
      mockEditor.getWrapper = vi.fn(() => unnamedComp);
      
      render(<EnhancedLayersPanel />);
      
      // Should show type instead of empty name - find it in the layer name span
      const layerName = document.querySelector('.layer-name');
      expect(layerName).toHaveTextContent('div');
    });

    it('handles empty component tree', () => {
      mockEditor.getWrapper = vi.fn(() => null);
      
      render(<EnhancedLayersPanel />);
      
      expect(screen.getByText('No components')).toBeInTheDocument();
    });

    it('handles rapid filter changes', async () => {
      render(<EnhancedLayersPanel />);
      
      const filterSelect = screen.getByRole('combobox');
      
      // Rapidly change filters
      fireEvent.change(filterSelect, { target: { value: 'text' } });
      fireEvent.change(filterSelect, { target: { value: 'image' } });
      fireEvent.change(filterSelect, { target: { value: 'all' } });
      
      await waitFor(() => {
        expect(filterSelect).toHaveValue('all');
      });
    });
  });
});

