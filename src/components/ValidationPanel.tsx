import { useState, useEffect, useCallback } from 'react';
import { useEditor } from '@grapesjs/react';
import { validateAllComponents, type ValidationResult, type ValidationError } from '@/utils/validationTriggers';

interface ValidationPanelProps {
  isVisible: boolean;
  onClose: () => void;
}

export function ValidationPanel({ isVisible, onClose }: ValidationPanelProps) {
  const editor = useEditor();
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [isValidating, setIsValidating] = useState(false);

  const runValidation = useCallback(async () => {
    if (!editor) return;
    
    setIsValidating(true);
    try {
      const result = validateAllComponents(editor);
      setValidationResult(result);
    } catch (error) {
      console.error('Validation error:', error);
    } finally {
      setIsValidating(false);
    }
  }, [editor]);

  // Auto-validate when panel opens
  useEffect(() => {
    if (isVisible && editor) {
      runValidation();
    }
  }, [isVisible, editor, runValidation]);

  if (!isVisible) return null;

  return (
    <div className="validation-panel">
      <div className="validation-header">
        <h3 className="validation-title">Code Validation</h3>
        <div className="validation-actions">
          <button
            onClick={runValidation}
            disabled={isValidating}
            className="validation-refresh-btn"
          >
            {isValidating ? 'Validating...' : 'Refresh'}
          </button>
          <button
            onClick={onClose}
            className="validation-close-btn"
            aria-label="Close validation panel"
          >
            ×
          </button>
        </div>
      </div>

      <div className="validation-content">
        {validationResult ? (
          <>
            <div className="validation-summary">
              <div className={`validation-status ${validationResult.isValid ? 'valid' : 'invalid'}`}>
                {validationResult.isValid ? '✅' : '❌'}
                <span>
                  {validationResult.isValid 
                    ? 'All validations passed!' 
                    : `${validationResult.errors.length} error${validationResult.errors.length > 1 ? 's' : ''}, ${validationResult.warnings.length} warning${validationResult.warnings.length > 1 ? 's' : ''}`
                  }
                </span>
              </div>
            </div>

            {(validationResult.errors.length > 0 || validationResult.warnings.length > 0) && (
              <div className="validation-details">
                <h4 className="validation-details-title">Issues Found:</h4>
                
                {validationResult.errors.length > 0 && (
                  <div className="validation-section">
                    <h5 className="validation-section-title">Errors ({validationResult.errors.length})</h5>
                    <div className="validation-list">
                      {validationResult.errors.map((error, index) => (
                        <ValidationErrorItem key={index} error={error} />
                      ))}
                    </div>
                  </div>
                )}

                {validationResult.warnings.length > 0 && (
                  <div className="validation-section">
                    <h5 className="validation-section-title">Warnings ({validationResult.warnings.length})</h5>
                    <div className="validation-list">
                      {validationResult.warnings.map((warning, index) => (
                        <ValidationErrorItem key={index} error={warning} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {validationResult.isValid && (
              <div className="validation-success">
                <div className="validation-success-icon">🎉</div>
                <p>Your email template is ready! All validations have passed.</p>
              </div>
            )}
          </>
        ) : (
          <div className="validation-loading">
            <div className="validation-spinner"></div>
            <p>Running validation...</p>
          </div>
        )}
      </div>
    </div>
  );
}

interface ValidationErrorItemProps {
  error: ValidationError;
}

function ValidationErrorItem({ error }: ValidationErrorItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const getSeverityIcon = (severity: 'error' | 'warning') => {
    return severity === 'error' ? '❌' : '⚠️';
  };

  const getSeverityColor = (severity: 'error' | 'warning') => {
    return severity === 'error' ? 'text-red-600' : 'text-yellow-600';
  };

  const getSeverityBgColor = (severity: 'error' | 'warning') => {
    return severity === 'error' ? 'bg-red-50 border-red-200' : 'bg-yellow-50 border-yellow-200';
  };

  return (
    <div className={`validation-item ${getSeverityBgColor(error.severity)}`}>
      <div 
        className="validation-item-header"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="validation-item-icon">
          {getSeverityIcon(error.severity)}
        </div>
        <div className="validation-item-content">
          <div className="validation-item-title">
            {error.componentType} &gt; {error.traitLabel}
          </div>
          <div className={`validation-item-message ${getSeverityColor(error.severity)}`}>
            {error.error}
          </div>
        </div>
        <div className="validation-item-toggle">
          {isExpanded ? '▼' : '▶'}
        </div>
      </div>
      
      {isExpanded && (
        <div className="validation-item-details">
          <div className="validation-detail-row">
            <strong>Component ID:</strong> {error.componentId}
          </div>
          <div className="validation-detail-row">
            <strong>Field Name:</strong> {error.traitName}
          </div>
          <div className="validation-detail-row">
            <strong>Current Value:</strong> 
            <code className="validation-value">{error.value || '(empty)'}</code>
          </div>
          <div className="validation-detail-row">
            <strong>Severity:</strong> 
            <span className={`validation-severity ${getSeverityColor(error.severity)}`}>
              {error.severity.toUpperCase()}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
