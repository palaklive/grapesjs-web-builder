import { isValidUrl, isValidEmail, isRequiredFieldValid, isValidDataBinding } from '@/config/customTraits';

export interface ValidationError {
  componentId: string;
  componentType: string;
  traitName: string;
  traitLabel: string;
  value: string;
  error: string;
  severity: 'error' | 'warning';
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationError[];
}

/**
 * Validates all components in the editor and returns validation results
 */
export const validateAllComponents = (editor: any): ValidationResult => {
  const errors: ValidationError[] = [];
  const warnings: ValidationError[] = [];
  
  const wrapper = editor.getWrapper();
  if (!wrapper) {
    return { isValid: true, errors, warnings };
  }

  // Recursively validate all components
  const validateComponent = (component: any, path: string = '') => {
    const componentId = component.getId();
    const componentType = component.get('type');
    const traits = component.get('traits') || [];
    const attributes = component.get('attributes') || {};
    const currentPath = path ? `${path} > ${componentType}` : componentType;

    // Validate each trait
    traits.forEach((trait: any) => {
      const traitName = trait.get('name');
      const traitLabel = trait.get('label');
      const traitType = trait.get('type');
      const value = attributes[traitName] || '';

      // Skip validation for empty optional fields
      if (!value && !trait.get('required')) {
        return;
      }

      const validation = validateTraitValue(traitType, value, trait);
      if (validation.error) {
        const error: ValidationError = {
          componentId,
          componentType,
          traitName,
          traitLabel,
          value: String(value),
          error: validation.error,
          severity: validation.severity || 'error'
        };

        if (validation.severity === 'warning') {
          warnings.push(error);
        } else {
          errors.push(error);
        }
      }
    });

    // Recursively validate child components
    const children = component.components();
    if (children) {
      children.forEach((child: any) => validateComponent(child, currentPath));
    }
  };

  validateComponent(wrapper);

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
};

/**
 * Validates a single trait value based on its type
 */
export const validateTraitValue = (
  traitType: string, 
  value: string, 
  trait: any
): { error?: string; severity?: 'error' | 'warning' } => {
  if (!value && !trait.get('required')) {
    return {}; // Empty optional field is valid
  }

  switch (traitType) {
    case 'url-validated':
      if (value && !isValidUrl(value)) {
        return { error: 'Invalid URL format. Please enter a valid URL.', severity: 'error' };
      }
      break;

    case 'email-validated':
      if (value && !isValidEmail(value)) {
        return { error: 'Invalid email format. Please enter a valid email address.', severity: 'error' };
      }
      break;

    case 'text-required':
      if (!isRequiredFieldValid(value)) {
        return { error: 'This field is required and cannot be empty.', severity: 'error' };
      }
      break;

    case 'data-binding':
      if (value && !isValidDataBinding(value)) {
        return { error: 'Invalid data binding syntax. Use {{ variableName }} format.', severity: 'error' };
      }
      break;

    case 'number-range':
      const min = parseFloat(trait.get('min') || '0');
      const max = parseFloat(trait.get('max') || '100');
      const numValue = parseFloat(value);
      
      if (value && (isNaN(numValue) || numValue < min || numValue > max)) {
        return { 
          error: `Value must be between ${min} and ${max}.`, 
          severity: 'error' 
        };
      }
      break;

    case 'text':
      // Basic text validation - check for required fields
      if (trait.get('required') && !isRequiredFieldValid(value)) {
        return { error: 'This field is required.', severity: 'error' };
      }
      break;

    case 'select':
      // Check if selected value is valid
      const options = trait.get('options') || [];
      if (value && options.length > 0) {
        const validOptions = options.map((opt: any) => opt.id || opt.value);
        if (!validOptions.includes(value)) {
          return { error: 'Invalid selection. Please choose from the available options.', severity: 'warning' };
        }
      }
      break;

    default:
      // For unknown trait types, just check if required fields are filled
      if (trait.get('required') && !isRequiredFieldValid(value)) {
        return { error: 'This field is required.', severity: 'error' };
      }
  }

  return {}; // No validation errors
};

/**
 * Validates a specific component
 */
export const validateComponent = (component: any): ValidationResult => {
  const errors: ValidationError[] = [];
  const warnings: ValidationError[] = [];
  
  const componentId = component.getId();
  const componentType = component.get('type');
  const traits = component.get('traits') || [];
  const attributes = component.get('attributes') || {};

  traits.forEach((trait: any) => {
    const traitName = trait.get('name');
    const traitLabel = trait.get('label');
    const traitType = trait.get('type');
    const value = attributes[traitName] || '';

    const validation = validateTraitValue(traitType, value, trait);
    if (validation.error) {
      const error: ValidationError = {
        componentId,
        componentType,
        traitName,
        traitLabel,
        value: String(value),
        error: validation.error,
        severity: validation.severity || 'error'
      };

      if (validation.severity === 'warning') {
        warnings.push(error);
      } else {
        errors.push(error);
      }
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
};

/**
 * Gets validation summary for display
 */
export const getValidationSummary = (result: ValidationResult): string => {
  const { errors, warnings } = result;
  
  if (errors.length === 0 && warnings.length === 0) {
    return '✅ All validations passed!';
  }
  
  let summary = '';
  if (errors.length > 0) {
    summary += `❌ ${errors.length} error${errors.length > 1 ? 's' : ''}`;
  }
  if (warnings.length > 0) {
    if (summary) summary += ', ';
    summary += `⚠️ ${warnings.length} warning${warnings.length > 1 ? 's' : ''}`;
  }
  
  return summary;
};

/**
 * Formats validation errors for display
 */
export const formatValidationErrors = (result: ValidationResult): string[] => {
  const messages: string[] = [];
  
  result.errors.forEach(error => {
    messages.push(`❌ ${error.componentType} > ${error.traitLabel}: ${error.error}`);
  });
  
  result.warnings.forEach(warning => {
    messages.push(`⚠️ ${warning.componentType} > ${warning.traitLabel}: ${warning.error}`);
  });
  
  return messages;
};
