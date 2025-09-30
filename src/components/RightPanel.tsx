import { useState } from "react";
import type { JSX } from "react";
import { LayersProvider, SelectorsProvider, StylesProvider, TraitsProvider, WithEditor, useEditor } from "@grapesjs/react";
import type { Component } from "grapesjs";
import "./RightPanel.css";

type PanelTab = "layers" | "styles" | "traits";

export function RightPanel() {
  const [activeTab, setActiveTab] = useState<PanelTab>("layers");

  return (
    <div className="right-panel">
      <div className="panel-tabs">
        <button
          className={`panel-tab ${activeTab === "layers" ? "active" : ""}`}
          onClick={() => setActiveTab("layers")}
        >
          Layers
        </button>
        <button
          className={`panel-tab ${activeTab === "styles" ? "active" : ""}`}
          onClick={() => setActiveTab("styles")}
        >
          Styles
        </button>
        <button
          className={`panel-tab ${activeTab === "traits" ? "active" : ""}`}
          onClick={() => setActiveTab("traits")}
        >
          Properties
        </button>
      </div>

      <div className="panel-content">
      {activeTab === "layers" && (
        <WithEditor>
          <LayersPanel />
        </WithEditor>
      )}
      {activeTab === "styles" && (
        <WithEditor>
          <StylesPanel />
        </WithEditor>
      )}
      {activeTab === "traits" && (
        <WithEditor>
          <TraitsPanel />
        </WithEditor>
      )}
      </div>
    </div>
  );
}

function LayersPanel() {
  const editor = useEditor();
  const [, setUpdate] = useState(0);

  // Force re-render when selection changes
  editor?.on('component:selected', () => setUpdate(u => u + 1));

  const renderLayer = (component: Component, level: number = 0): JSX.Element => {
    const components = component.components();
    const hasChildren = components.length > 0;
    const selected = editor?.getSelected();
    const isSelected = selected === component;

    return (
      <div key={component.getId()} className="layer-item">
        <div
          className={`layer-header ${isSelected ? 'selected' : ''}`}
          style={{ paddingLeft: `${level * 15 + 8}px` }}
          onClick={() => editor?.select(component)}
        >
          {hasChildren && (
            <span className="layer-toggle">▼</span>
          )}
          <span className="layer-name">{component.getName() || component.get('type') || 'Element'}</span>
        </div>
        {hasChildren && (
          <div className="layer-children">
            {components.map((child: Component) => renderLayer(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="layers-panel">
      <LayersProvider>
        {({ root }) => {
          return root ? renderLayer(root) : <div className="no-layers">No components</div>;
        }}
      </LayersProvider>
    </div>
  );
}

function StylesPanel() {
  return (
    <div className="styles-panel">
      <SelectorsProvider>
        {({ selectors, selectedState, states, targets, setState, addSelector, removeSelector }) => (
          <div className="selectors-section">
            <div className="section-header">
              <div className="section-title">Selectors</div>
              <select 
                className="state-select"
                value={selectedState}
                onChange={(e) => setState(e.target.value)}
              >
                <option value="">- State -</option>
                {states.map((state) => (
                  <option key={state.id} value={state.id}>{state.getName()}</option>
                ))}
              </select>
            </div>
            <div className="selectors-list">
              {selectors.map((selector) => (
                <div key={selector.toString()} className="selector-item">
                  <span>{selector.getLabel()}</span>
                  <button 
                    className="selector-remove"
                    onClick={() => removeSelector(selector)}
                  >×</button>
                </div>
              ))}
            </div>
            {targets.length > 0 && (
              <div className="selector-add">
                <input 
                  type="text" 
                  placeholder="Add selector..."
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      addSelector({ name: e.currentTarget.value, label: e.currentTarget.value });
                      e.currentTarget.value = '';
                    }
                  }}
                />
              </div>
            )}
          </div>
        )}
      </SelectorsProvider>

      <StylesProvider>
        {({ sectors }) => (
          <div className="styles-sectors">
            {sectors.map((sector) => (
              <div key={sector.getId()} className="style-sector">
                <div className="sector-title">{sector.getName()}</div>
                <div className="sector-properties">
                  {sector.getProperties().map((prop) => {
                    const type = prop.getType();
                    const value = prop.getValue();
                    const label = prop.getLabel();

                    return (
                      <div key={prop.getId()} className="style-property">
                        <label className="property-label">{label}</label>
                        <div className="property-input">
                          {type === 'slider' || type === 'integer' ? (
                            <input
                              type="number"
                              value={value || ''}
                              onChange={(e) => prop.upValue(e.target.value)}
                              className="property-number"
                            />
                          ) : type === 'select' ? (
                            <select
                              value={value || ''}
                              onChange={(e) => prop.upValue(e.target.value)}
                              className="property-select"
                            >
                              <option value="">- Select -</option>
                              {prop.get('options')?.map((opt: { id: string; label?: string }) => (
                                <option key={opt.id} value={opt.id}>{opt.label || opt.id}</option>
                              ))}
                            </select>
                          ) : type === 'color' ? (
                            <input
                              type="color"
                              value={value || '#000000'}
                              onChange={(e) => prop.upValue(e.target.value)}
                              className="property-color"
                            />
                          ) : (
                            <input
                              type="text"
                              value={value || ''}
                              onChange={(e) => prop.upValue(e.target.value)}
                              className="property-text"
                            />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
            {sectors.length === 0 && (
              <div className="no-styles">Select a component to edit styles</div>
            )}
          </div>
        )}
      </StylesProvider>
    </div>
  );
}

function TraitsPanel() {
  return (
    <div className="traits-panel">
      <TraitsProvider>
        {({ traits }) => (
          <div className="traits-list">
            {traits.length > 0 ? (
              traits.map((trait) => {
                const type = trait.getType();
                const value = trait.getValue();
                const label = trait.getLabel();

                return (
                  <div key={trait.getId()} className="trait-item">
                    <label className="trait-label">{label}</label>
                    <div className="trait-value">
                      {type === 'text' ? (
                        <input
                          type="text"
                          value={value || ''}
                          onChange={(e) => trait.setValue(e.target.value)}
                          className="trait-input"
                        />
                      ) : type === 'number' ? (
                        <input
                          type="number"
                          value={value || ''}
                          onChange={(e) => trait.setValue(e.target.value)}
                          className="trait-input"
                        />
                      ) : type === 'checkbox' ? (
                        <input
                          type="checkbox"
                          checked={!!value}
                          onChange={(e) => trait.setValue(e.target.checked)}
                          className="trait-checkbox"
                        />
                      ) : type === 'select' ? (
                        <select
                          value={value || ''}
                          onChange={(e) => trait.setValue(e.target.value)}
                          className="trait-select"
                        >
                          <option value="">- Select -</option>
                          {trait.get('options')?.map((option: { id?: string; value?: string; label?: string; name?: string }) => (
                            <option 
                              key={option.id || option.value} 
                              value={option.value || option.id}
                            >
                              {option.name || option.label || option.value || option.id}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type="text"
                          value={value || ''}
                          onChange={(e) => trait.setValue(e.target.value)}
                          className="trait-input"
                        />
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="no-traits">Select a component to edit its properties</div>
            )}
          </div>
        )}
      </TraitsProvider>
    </div>
  );
}