import { useState, useMemo } from "react";
import type { JSX } from "react";
import { useEditor } from "@grapesjs/react";
import type { Component } from "grapesjs";
import "./EnhancedLayersPanel.css";

interface LayerState {
  locked: Set<string>;
  hidden: Set<string>;
}

interface DragState {
  draggedComponent: Component | null;
  dropTarget: Component | null;
  dropPosition: "before" | "after" | "inside" | null;
}

export function EnhancedLayersPanel() {
  const editor = useEditor();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [, setUpdate] = useState(0);
  const [layerState, setLayerState] = useState<LayerState>({
    locked: new Set(),
    hidden: new Set(),
  });
  const [expandedLayers, setExpandedLayers] = useState<Set<string>>(new Set());
  const [dragState, setDragState] = useState<DragState>({
    draggedComponent: null,
    dropTarget: null,
    dropPosition: null,
  });

  // Force re-render when selection changes
  editor?.on('component:selected', () => setUpdate(u => u + 1));
  editor?.on('component:add', () => setUpdate(u => u + 1));
  editor?.on('component:remove', () => setUpdate(u => u + 1));
  editor?.on('component:update', () => setUpdate(u => u + 1));

  const toggleLock = (component: Component) => {
    const id = component.getId();
    const newLocked = new Set(layerState.locked);
    
    if (newLocked.has(id)) {
      newLocked.delete(id);
      component.set('locked', false);
    } else {
      newLocked.add(id);
      component.set('locked', true);
    }
    
    setLayerState({ ...layerState, locked: newLocked });
  };

  const toggleVisibility = (component: Component) => {
    const id = component.getId();
    const newHidden = new Set(layerState.hidden);
    
    if (newHidden.has(id)) {
      newHidden.delete(id);
      component.set('hidden', false);
      component.getEl()?.style.setProperty('opacity', '1');
    } else {
      newHidden.add(id);
      component.set('hidden', true);
      component.getEl()?.style.setProperty('opacity', '0.3');
    }
    
    setLayerState({ ...layerState, hidden: newHidden });
  };

  const toggleExpand = (componentId: string) => {
    const newExpanded = new Set(expandedLayers);
    if (newExpanded.has(componentId)) {
      newExpanded.delete(componentId);
    } else {
      newExpanded.add(componentId);
    }
    setExpandedLayers(newExpanded);
  };

  const deleteComponent = (component: Component) => {
    if (confirm(`Delete ${component.getName() || component.get('type')}?`)) {
      component.remove();
    }
  };

  const duplicateComponent = (component: Component) => {
    const parent = component.parent();
    if (parent) {
      const clone = component.clone();
      parent.append(clone);
    }
  };

  const handleDragStart = (component: Component, e: React.DragEvent) => {
    e.stopPropagation();
    setDragState({
      draggedComponent: component,
      dropTarget: null,
      dropPosition: null,
    });
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (component: Component, e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!dragState.draggedComponent || dragState.draggedComponent === component) {
      return;
    }

    // Don't allow dropping a parent into its own child
    let parent = component.parent();
    while (parent) {
      if (parent === dragState.draggedComponent) {
        return;
      }
      parent = parent.parent();
    }

    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const y = e.clientY - rect.top;
    const height = rect.height;

    let position: "before" | "after" | "inside" = "before";
    if (y > height * 0.66) {
      position = "after";
    } else if (y > height * 0.33 && component.components().length > 0) {
      position = "inside";
    }

    setDragState({
      ...dragState,
      dropTarget: component,
      dropPosition: position,
    });
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.stopPropagation();
  };

  const handleDrop = (component: Component, e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!dragState.draggedComponent || dragState.draggedComponent === component) {
      setDragState({ draggedComponent: null, dropTarget: null, dropPosition: null });
      return;
    }

    const draggedComp = dragState.draggedComponent;
    const targetComp = component;

    try {
      if (dragState.dropPosition === "inside") {
        targetComp.append(draggedComp);
      } else if (dragState.dropPosition === "before") {
        const parent = targetComp.parent();
        if (parent) {
          const index = parent.components().indexOf(targetComp);
          parent.components().add(draggedComp, { at: index });
        }
      } else if (dragState.dropPosition === "after") {
        const parent = targetComp.parent();
        if (parent) {
          const index = parent.components().indexOf(targetComp);
          parent.components().add(draggedComp, { at: index + 1 });
        }
      }
      
      editor?.select(draggedComp);
    } catch (error) {
      console.error("Error during drop:", error);
    }

    setDragState({ draggedComponent: null, dropTarget: null, dropPosition: null });
  };

  const handleDragEnd = () => {
    setDragState({ draggedComponent: null, dropTarget: null, dropPosition: null });
  };

  const matchesSearch = (component: Component, query: string): boolean => {
    if (!query) return true;
    
    const name = (component.getName() || component.get('type') || '').toLowerCase();
    const type = (component.get('type') || '').toLowerCase();
    const id = component.getId().toLowerCase();
    const searchLower = query.toLowerCase();
    
    return name.includes(searchLower) || type.includes(searchLower) || id.includes(searchLower);
  };

  const matchesFilter = (component: Component, filter: string): boolean => {
    if (filter === 'all') return true;
    const type = component.get('type');
    return type === filter;
  };

  const filterComponent = (component: Component): boolean => {
    return matchesSearch(component, searchQuery) && matchesFilter(component, filterType);
  };

  const renderLayer = (component: Component, level: number = 0): JSX.Element | null => {
    const components = component.components();
    const hasChildren = components.length > 0;
    const selected = editor?.getSelected();
    const isSelected = selected === component;
    const componentId = component.getId();
    const isLocked = layerState.locked.has(componentId);
    const isHidden = layerState.hidden.has(componentId);
    const isExpanded = expandedLayers.has(componentId);
    const componentType = component.get('type') || 'element';
    const isDragging = dragState.draggedComponent === component;
    const isDropTarget = dragState.dropTarget === component;
    
    // Filter check
    const passesFilter = filterComponent(component);
    const childrenPassFilter = components.some((child: Component) => filterComponent(child));
    
    if (!passesFilter && !childrenPassFilter) {
      return null;
    }

    return (
      <div key={componentId} className="enhanced-layer-item">
        <div
          className={`enhanced-layer-header ${isSelected ? 'selected' : ''} ${isLocked ? 'locked' : ''} ${isDragging ? 'dragging' : ''} ${isDropTarget ? `drop-target drop-${dragState.dropPosition}` : ''}`}
          style={{ paddingLeft: `${level * 16 + 8}px` }}
          draggable={!isLocked}
          onDragStart={(e) => handleDragStart(component, e)}
          onDragOver={(e) => handleDragOver(component, e)}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(component, e)}
          onDragEnd={handleDragEnd}
        >
          {hasChildren && (
            <button
              className={`layer-expand-btn ${isExpanded ? 'expanded' : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                toggleExpand(componentId);
              }}
              aria-label={isExpanded ? "Collapse" : "Expand"}
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M3 5l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          )}
          
          <div
            className="layer-main-content"
            onClick={() => !isLocked && editor?.select(component)}
          >
            <span className="layer-icon" title={componentType}>
              {getLayerIcon(componentType)}
            </span>
            <span className="layer-name">{component.getName() || component.get('type') || 'Element'}</span>
          </div>

          <div className="layer-actions">
            <button
              className={`layer-action-btn ${isHidden ? 'active' : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                toggleVisibility(component);
              }}
              title={isHidden ? "Show" : "Hide"}
              aria-label={isHidden ? "Show" : "Hide"}
            >
              {isHidden ? (
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <path d="M1 1l14 14M7 4.07A3 3 0 0111.93 9M4.07 9A3 3 0 019 11.93" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  <path d="M2 8s2-4 6-4m4 1.5c1.5 1 2.5 2.5 2.5 2.5s-2 4-6 4a6 6 0 01-2-.34" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M2 8s2-4 6-4 6 4 6 4-2 4-6 4-6-4-6-4z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              )}
            </button>
            
            <button
              className={`layer-action-btn ${isLocked ? 'active' : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                toggleLock(component);
              }}
              title={isLocked ? "Unlock" : "Lock"}
              aria-label={isLocked ? "Unlock" : "Lock"}
            >
              {isLocked ? (
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <rect x="4" y="7" width="8" height="6" rx="1" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M6 7V5a2 2 0 014 0v2" stroke="currentColor" strokeWidth="1.5"/>
                </svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <rect x="4" y="7" width="8" height="6" rx="1" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M6 7V5a2 2 0 012-2" stroke="currentColor" strokeWidth="1.5"/>
                </svg>
              )}
            </button>

            <button
              className="layer-action-btn"
              onClick={(e) => {
                e.stopPropagation();
                duplicateComponent(component);
              }}
              title="Duplicate"
              aria-label="Duplicate"
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <rect x="5" y="5" width="8" height="8" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                <path d="M3 11V3h8" stroke="currentColor" strokeWidth="1.5" fill="none"/>
              </svg>
            </button>

            <button
              className="layer-action-btn danger"
              onClick={(e) => {
                e.stopPropagation();
                deleteComponent(component);
              }}
              title="Delete"
              aria-label="Delete"
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M3 4h10M6 4V3a1 1 0 011-1h2a1 1 0 011 1v1M5 4v9a1 1 0 001 1h4a1 1 0 001-1V4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>
          </div>
        </div>
        
        {hasChildren && isExpanded && (
          <div className="layer-children">
            {components.map((child: Component) => renderLayer(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  const availableTypes = useMemo(() => {
    if (!editor) return [];
    const types = new Set<string>();
    
    const collectTypes = (component: Component) => {
      types.add(component.get('type') || 'element');
      component.components().forEach(collectTypes);
    };
    
    const wrapper = editor.getWrapper();
    if (wrapper) {
      collectTypes(wrapper);
    }
    
    return Array.from(types).sort();
  }, [editor, searchQuery]);

  const rootComponent = editor?.getWrapper();

  return (
    <div className="enhanced-layers-panel">
      <div className="layers-header">
        <input
          type="text"
          className="layer-search"
          placeholder="Search layers..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <select
          className="layer-filter"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        >
          <option value="all">All Types</option>
          {availableTypes.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>

      <div className="layers-content">
        {rootComponent ? (
          renderLayer(rootComponent)
        ) : (
          <div className="no-layers">No components</div>
        )}
      </div>
    </div>
  );
}

function getLayerIcon(type: string): JSX.Element {
  const icons: Record<string, JSX.Element> = {
    'text': (
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
        <path d="M4 4h8M8 4v8M6 12h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    'image': (
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
        <rect x="2" y="2" width="12" height="12" rx="1" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M2 11l3-3 2 2 3-3 3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    'default': (
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
        <rect x="3" y="3" width="10" height="10" rx="1" stroke="currentColor" strokeWidth="1.5"/>
      </svg>
    ),
  };

  return icons[type] || icons['default'];
}

