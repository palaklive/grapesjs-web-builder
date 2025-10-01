import React, { useEffect, useState } from "react";
import { SelectorsProvider, StylesProvider, WithEditor, useEditor } from "@grapesjs/react";
import { usePanel } from "@/contexts/PanelContext";
import { EnhancedLayersPanel } from "./EnhancedLayersPanel";
import { isValidUrl, isValidEmail, isRequiredFieldValid, isValidDataBinding } from "@/config/customTraits";
import "./RightPanel.css";

export function RightPanel() {
  const { activeTab, setActiveTab } = usePanel();

  // Listen for canvas toolbar events to open styles panel
  useEffect(() => {
    const handleOpenStylesPanel = () => {
      setActiveTab("styles");
    };

    window.addEventListener('gjs:open-styles-panel', handleOpenStylesPanel);

    return () => {
      window.removeEventListener('gjs:open-styles-panel', handleOpenStylesPanel);
    };
  }, [setActiveTab]);

  return (
    <div className="right-panel">
      <div className="panel-tabs">
        <button
          className={`panel-tab ${activeTab === "layers" ? "active" : ""}`}
          onClick={() => setActiveTab("layers")}
          aria-label="Layers Panel"
        >
          Layers
        </button>
        <button
          className={`panel-tab ${activeTab === "styles" ? "active" : ""}`}
          onClick={() => setActiveTab("styles")}
          aria-label="Styles Panel"
        >
          Styles
        </button>
        <button
          className={`panel-tab ${activeTab === "traits" ? "active" : ""}`}
          onClick={() => setActiveTab("traits")}
          aria-label="Properties Panel"
        >
          Properties
        </button>
      </div>

      <div className="panel-content">
      {activeTab === "layers" && (
        <WithEditor>
          <EnhancedLayersPanel />
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

function StylesPanel() {
  const editor = useEditor();
  
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
                <option value="">Normal</option>
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
                    aria-label="Remove selector"
                  >×</button>
                </div>
              ))}
            </div>
            {targets.length > 0 && (
              <div className="selector-add">
                <input 
                  type="text" 
                  placeholder="Add class..."
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                      addSelector({ name: e.currentTarget.value.trim(), label: e.currentTarget.value.trim() });
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
        {({ sectors }) => {
          // Get selected component to determine which properties are applicable
          const selectedComponent = editor?.getSelected();
          const componentType = selectedComponent?.get('type') || '';
          
          // Helper function to check if a property is visible/applicable
          const isPropertyVisible = (prop: {
            isVisible?: () => boolean;
            get?: (key: string) => unknown;
          }) => {
            // First check if isVisible method exists and use it
            if (typeof prop.isVisible === 'function') {
              try {
                const visible = prop.isVisible();
                if (visible === false) {
                  return false; // Explicitly hidden
                }
              } catch (e) {
                console.warn('Error checking property visibility:', e);
              }
            }
            
            // Check if property is explicitly hidden via attributes
            const visible = prop.get?.('visible');
            if (visible === false) {
              return false;
            }
            
            // Check if property is applicable to this component type
            const requires = prop.get?.('requires');
            if (requires && selectedComponent) {
              // If property has requirements, check if component meets them
              if (Array.isArray(requires)) {
                const hasRequirement = requires.some(req => {
                  if (typeof req === 'string') {
                    return componentType === req;
                  }
                  return false;
                });
                if (!hasRequirement) {
                  return false;
                }
              }
            }
            
            // Default: show the property
            return true;
          };

          // Filter out sectors with no visible properties
          const visibleSectors = sectors.filter(sector => {
            const properties = sector.getProperties();
            if (!properties || properties.length === 0) return false;
            
            return properties.some(prop => isPropertyVisible(prop));
          });

          return (
            <div className="styles-sectors">
              {visibleSectors.map((sector) => {
                // Only show properties that are visible for the selected element
                const allProperties = sector.getProperties();
                const visibleProperties = allProperties.filter(prop => isPropertyVisible(prop));
                
                if (visibleProperties.length === 0) return null;

                return (
                  <div key={sector.getId()} className="style-sector">
                    <div 
                      className="sector-title"
                      onClick={() => sector.set('open', !sector.get('open'))}
                      style={{ cursor: 'pointer' }}
                    >
                      <span>{sector.isOpen() ? '▼' : '▶'}</span> {sector.getName()}
                      <span className="sector-count">({visibleProperties.length})</span>
                    </div>
                    {sector.isOpen() && (
                      <div className="sector-properties">
                        {visibleProperties.map((prop) => (
                          <StyleProperty key={prop.getId()} prop={prop} />
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
              {visibleSectors.length === 0 && (
                <div className="no-styles">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" style={{opacity: 0.3, marginBottom: '8px'}}>
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <p>Select a component to edit styles</p>
                </div>
              )}
            </div>
          );
        }}
      </StylesProvider>
    </div>
  );
}

interface StylePropertyProps {
  prop: {
    getId: () => string;
    getType: () => string;
    getValue: () => string;
    getLabel: () => string;
    get: (key: string) => unknown;
    upValue: (value: string) => void;
    isVisible?: () => boolean;
    getProperties?: () => StylePropertyProps['prop'][];
  };
}

function StyleProperty({ prop }: StylePropertyProps) {
  const type = prop.getType();
  const value = prop.getValue();
  const label = prop.getLabel();
  const options = prop.get('options') as { id: string; label?: string; title?: string; name?: string }[] | undefined;

  const renderInput = () => {
    switch (type) {
      case 'radio': {
        return (
          <div className="property-radio-group">
            {options?.map((opt) => (
              <button
                key={opt.id}
                className={`property-radio-btn ${value === opt.id ? 'active' : ''}`}
                onClick={() => prop.upValue(opt.id)}
                title={opt.title || opt.label || opt.id}
                aria-label={opt.label || opt.id}
              >
                {getRadioIcon(opt.id, opt.label)}
              </button>
            ))}
          </div>
        );
      }

      case 'slider': {
        const min = (prop.get('min') as number) || 0;
        const max = (prop.get('max') as number) || 100;
        const step = (prop.get('step') as number) || 1;
        const unit = (prop.get('unit') as string) || '';
        return (
          <div className="property-slider-group">
            <input
              type="range"
              min={min}
              max={max}
              step={step}
              value={parseFloat(value) || min}
              onChange={(e) => prop.upValue(e.target.value + unit)}
              className="property-slider"
            />
            <input
              type="number"
              min={min}
              max={max}
              step={step}
              value={parseFloat(value) || ''}
              onChange={(e) => prop.upValue(e.target.value + unit)}
              className="property-slider-number"
            />
          </div>
        );
      }

      case 'select': {
        return (
          <select
            value={value || ''}
            onChange={(e) => prop.upValue(e.target.value)}
            className="property-select"
          >
            <option value="">Default</option>
            {options?.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {opt.label || opt.name || opt.id}
              </option>
            ))}
          </select>
        );
      }

      case 'color': {
        return (
          <div className="property-color-group">
            <input
              type="color"
              value={value || '#000000'}
              onChange={(e) => prop.upValue(e.target.value)}
              className="property-color-picker"
            />
            <input
              type="text"
              value={value || ''}
              onChange={(e) => prop.upValue(e.target.value)}
              placeholder="#000000"
              className="property-color-text"
              pattern="^#[0-9A-Fa-f]{6}$"
            />
          </div>
        );
      }

      case 'number':
      case 'integer': {
        const numUnit = (prop.get('unit') as string) || '';
        return (
          <div className="property-number-group">
            <input
              type="number"
              value={parseFloat(value) || ''}
              onChange={(e) => prop.upValue(e.target.value + numUnit)}
              className="property-number"
              step={type === 'integer' ? 1 : 0.1}
            />
            {numUnit && <span className="property-unit">{numUnit}</span>}
          </div>
        );
      }

      case 'stack': {
        return (
          <div className="property-stack">
            {prop.getProperties?.().map((subProp) => (
              <StyleProperty key={subProp.getId()} prop={subProp} />
            ))}
          </div>
        );
      }

      case 'composite': {
        return (
          <div className="property-composite">
            {prop.getProperties?.().map((subProp) => (
              <div key={subProp.getId()} className="composite-item">
                <label className="composite-label">{subProp.getLabel()}</label>
                <StyleProperty prop={subProp} />
              </div>
            ))}
          </div>
        );
      }

      default: {
        return (
          <input
            type="text"
            value={value || ''}
            onChange={(e) => prop.upValue(e.target.value)}
            className="property-text"
            placeholder="Enter value"
          />
        );
      }
    }
  };

  return (
    <div className="style-property">
      <label className="property-label">{label}</label>
      <div className="property-input">
        {renderInput()}
      </div>
    </div>
  );
}

function getRadioIcon(id: string, label?: string): React.ReactNode {
  const iconMap: Record<string, React.ReactNode> = {
    left: <svg width="14" height="14" viewBox="0 0 16 16"><path d="M2 4h8M2 8h8M2 12h8" stroke="currentColor" strokeWidth="1.5"/></svg>,
    center: <svg width="14" height="14" viewBox="0 0 16 16"><path d="M4 4h8M4 8h8M4 12h8" stroke="currentColor" strokeWidth="1.5"/></svg>,
    right: <svg width="14" height="14" viewBox="0 0 16 16"><path d="M6 4h8M6 8h8M6 12h8" stroke="currentColor" strokeWidth="1.5"/></svg>,
    justify: <svg width="14" height="14" viewBox="0 0 16 16"><path d="M2 4h12M2 8h12M2 12h12" stroke="currentColor" strokeWidth="1.5"/></svg>,
  };
  
  return iconMap[id] || <span>{label || id}</span>;
}

// Custom trait input components
interface UrlValidatedInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

function UrlValidatedInput({ value, onChange, placeholder }: UrlValidatedInputProps) {
  const [isValid, setIsValid] = useState(true);

  const handleBlur = () => {
    const valid = !value || isValidUrl(value);
    setIsValid(valid);
  };

  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onBlur={handleBlur}
      className={`trait-input ${!isValid ? 'trait-input-error' : ''}`}
      placeholder={placeholder || 'https://example.com'}
      title={!isValid ? 'Invalid URL format' : ''}
    />
  );
}

interface EmailValidatedInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

function EmailValidatedInput({ value, onChange, placeholder }: EmailValidatedInputProps) {
  const [isValid, setIsValid] = useState(true);

  const handleBlur = () => {
    const valid = !value || isValidEmail(value);
    setIsValid(valid);
  };

  return (
    <input
      type="email"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onBlur={handleBlur}
      className={`trait-input ${!isValid ? 'trait-input-error' : ''}`}
      placeholder={placeholder || 'user@example.com'}
      title={!isValid ? 'Invalid email format' : ''}
    />
  );
}

interface RequiredTextInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

function RequiredTextInput({ value, onChange, placeholder }: RequiredTextInputProps) {
  const [isValid, setIsValid] = useState(true);

  const handleBlur = () => {
    const valid = isRequiredFieldValid(value);
    setIsValid(valid);
  };

  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onBlur={handleBlur}
      className={`trait-input ${!isValid ? 'trait-input-error' : ''}`}
      placeholder={placeholder || ''}
      title={!isValid ? 'This field is required' : ''}
      required
    />
  );
}

interface NumberRangeInputProps {
  value: string;
  onChange: (value: string) => void;
  min?: string;
  max?: string;
  step?: string;
  default?: string;
}

function NumberRangeInput({ value, onChange, min = '0', max = '100', step = '1', default: defaultValue }: NumberRangeInputProps) {
  return (
    <div className="trait-number-range">
      <input
        type="number"
        value={value || defaultValue || ''}
        onChange={(e) => onChange(e.target.value)}
        className="trait-input"
        min={min}
        max={max}
        step={step}
      />
      <span className="trait-range-label">({min}-{max})</span>
    </div>
  );
}

interface DataBindingInputProps {
  value: string;
  onChange: (value: string) => void;
}

function DataBindingInput({ value, onChange }: DataBindingInputProps) {
  const [isValid, setIsValid] = useState(true);

  const handleBlur = () => {
    const valid = !value || isValidDataBinding(value);
    setIsValid(valid);
  };

  return (
    <div className="trait-data-binding">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={handleBlur}
        className={`trait-input ${!isValid ? 'trait-input-error' : ''}`}
        placeholder="{{ variable }}"
        title={!isValid ? 'Invalid data binding syntax. Use {{ variableName }} format' : ''}
      />
      <small className="trait-hint">Use {`{{ variableName }}`} for dynamic content</small>
    </div>
  );
}

interface SourceDropdownInputProps {
  value: string;
  onChange: (value: string) => void;
  sources: Array<{ id: string; name: string }>;
}

function SourceDropdownInput({ value, onChange, sources }: SourceDropdownInputProps) {
  const [showCustom, setShowCustom] = useState(false);
  const [customValue, setCustomValue] = useState('');
  const [isValid, setIsValid] = useState(true);

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value === 'custom') {
      setShowCustom(true);
      setCustomValue(value);
    } else {
      setShowCustom(false);
      onChange(e.target.value);
    }
  };

  const handleCustomBlur = () => {
    const valid = !customValue || isValidDataBinding(customValue);
    setIsValid(valid);
    if (valid) {
      onChange(customValue);
    }
  };

  return (
    <div className="trait-source-dropdown">
      <select
        value={showCustom ? 'custom' : value}
        onChange={handleSelectChange}
        className="trait-select"
      >
        <option value="">- Select Data Source -</option>
        {sources.map((source) => (
          <option key={source.id} value={`{{ ${source.id} }}`}>
            {source.name}
          </option>
        ))}
        <option value="custom">Custom...</option>
      </select>
      {showCustom && (
        <input
          type="text"
          value={customValue}
          onChange={(e) => setCustomValue(e.target.value)}
          onBlur={handleCustomBlur}
          className={`trait-input ${!isValid ? 'trait-input-error' : ''}`}
          placeholder="{{ custom.variable }}"
          title={!isValid ? 'Invalid data binding syntax. Use {{ variableName }} format' : ''}
          style={{ marginTop: '8px' }}
        />
      )}
    </div>
  );
}

interface ColorPresetInputProps {
  value: string;
  onChange: (value: string) => void;
  presets: string[];
}

function ColorPresetInput({ value, onChange, presets }: ColorPresetInputProps) {
  return (
    <div className="trait-color-preset">
      <input
        type="color"
        value={value || '#000000'}
        onChange={(e) => onChange(e.target.value)}
        className="trait-color-input"
      />
      <div className="color-presets">
        {presets.map((color) => (
          <button
            key={color}
            type="button"
            className="color-preset-btn"
            style={{ backgroundColor: color }}
            title={color}
            onClick={() => onChange(color)}
          />
        ))}
      </div>
    </div>
  );
}

interface Component {
  get: (key: string) => unknown;
  addAttributes: (attrs: Record<string, unknown>) => void;
}

interface Trait {
  get: (key: string) => unknown;
  getId: () => string;
}

export function TraitsPanel() {
  const editor = useEditor();
  const [selectedComponent, setSelectedComponent] = React.useState<Component | null>(null);
  const [traits, setTraits] = React.useState<Trait[]>([]);

  // Listen for component selection changes
  React.useEffect(() => {
    if (!editor) return;

    const handleComponentSelect = (component: Component) => {
      setSelectedComponent(component);
      if (component) {
        const componentTraits = (component.get('traits') as Trait[]) || [];
        setTraits(componentTraits);
      } else {
        setTraits([]);
      }
    };

    editor.on('component:selected', handleComponentSelect);
    editor.on('component:deselected', () => {
      setSelectedComponent(null);
      setTraits([]);
    });

    return () => {
      editor.off('component:selected', handleComponentSelect);
      editor.off('component:deselected', () => {});
    };
  }, [editor]);

  const handleTraitChange = (trait: Trait, value: unknown) => {
    if (!selectedComponent) return;
    
    const traitName = trait.get('name') as string;
    if (traitName) {
      selectedComponent.addAttributes({ [traitName]: value });
    }
  };

  const getTraitValue = (trait: Trait) => {
    if (!selectedComponent) return '';
    const traitName = trait.get('name') as string;
    const attributes = selectedComponent.get('attributes') as Record<string, unknown>;
    return (attributes[traitName] as string) || '';
  };

  const renderTraitInput = (trait: Trait) => {
    const type = trait.get('type') as string;
    const value = getTraitValue(trait);
    const placeholder = (trait.get('placeholder') as string) || '';

    switch (type) {
      case 'url-validated':
        return (
          <UrlValidatedInput
            value={value}
            onChange={(val) => handleTraitChange(trait, val)}
            placeholder={placeholder}
          />
        );
      
      case 'email-validated':
        return (
          <EmailValidatedInput
            value={value}
            onChange={(val) => handleTraitChange(trait, val)}
            placeholder={placeholder}
          />
        );
      
      case 'text-required':
        return (
          <RequiredTextInput
            value={value}
            onChange={(val) => handleTraitChange(trait, val)}
            placeholder={placeholder}
          />
        );
      
      case 'number-range':
        return (
          <NumberRangeInput
            value={value}
            onChange={(val) => handleTraitChange(trait, val)}
            min={trait.get('min') as string}
            max={trait.get('max') as string}
            step={trait.get('step') as string}
            default={trait.get('default') as string}
          />
        );
      
      case 'data-binding':
        return (
          <DataBindingInput
            value={value}
            onChange={(val) => handleTraitChange(trait, val)}
          />
        );
      
      case 'source-dropdown':
        return (
          <SourceDropdownInput
            value={value}
            onChange={(val) => handleTraitChange(trait, val)}
            sources={(trait.get('sources') as Array<{ id: string; name: string }>) || []}
          />
        );
      
      case 'color-preset':
        return (
          <ColorPresetInput
            value={value}
            onChange={(val) => handleTraitChange(trait, val)}
            presets={(trait.get('presets') as string[]) || []}
          />
        );
      
      case 'text':
        return (
          <input
            type="text"
            value={value}
            onChange={(e) => handleTraitChange(trait, e.target.value)}
            className="trait-input"
            placeholder={placeholder}
          />
        );
      
      case 'number':
        return (
          <input
            type="number"
            value={value}
            onChange={(e) => handleTraitChange(trait, e.target.value)}
            className="trait-input"
            min={trait.get('min') as string}
            max={trait.get('max') as string}
            step={trait.get('step') as string}
          />
        );
      
      case 'checkbox':
        return (
          <input
            type="checkbox"
            checked={!!value}
            onChange={(e) => handleTraitChange(trait, e.target.checked)}
            className="trait-checkbox"
          />
        );
      
      case 'select':
        return (
          <select
            value={value}
            onChange={(e) => handleTraitChange(trait, e.target.value)}
            className="trait-select"
          >
            <option value="">- Select -</option>
            {(trait.get('options') as Array<{ id?: string; value?: string; label?: string; name?: string }>)?.map((option) => (
              <option 
                key={option.id || option.value} 
                value={option.value || option.id}
              >
                {option.name || option.label || option.value || option.id}
              </option>
            ))}
          </select>
        );
      
      default:
        return (
          <input
            type="text"
            value={value}
            onChange={(e) => handleTraitChange(trait, e.target.value)}
            className="trait-input"
            placeholder={placeholder}
          />
        );
    }
  };

  return (
    <div className="traits-panel">
      <div className="traits-list">
        {traits.length > 0 ? (
          traits.map((trait) => (
            <div key={trait.getId()} className="trait-item">
              <label className="trait-label">{trait.get('label') as string}</label>
              <div className="trait-value">
                {renderTraitInput(trait)}
              </div>
            </div>
          ))
        ) : (
          <div className="no-traits">Select a component to edit its properties</div>
        )}
      </div>
    </div>
  );
}