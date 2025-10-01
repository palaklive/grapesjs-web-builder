import { describe, it, expect } from 'vitest';
import { isValidUrl, isValidEmail, isRequiredFieldValid, isValidDataBinding } from '../customTraits';

describe('Custom Traits Validation', () => {
  describe('isValidUrl', () => {
    it('validates absolute URLs', () => {
      expect(isValidUrl('https://example.com')).toBe(true);
      expect(isValidUrl('http://example.com')).toBe(true);
      expect(isValidUrl('https://example.com/path')).toBe(true);
    });

    it('validates relative URLs', () => {
      expect(isValidUrl('/path')).toBe(true);
      expect(isValidUrl('/path/to/page')).toBe(true);
      expect(isValidUrl('#anchor')).toBe(true);
    });

    it('validates special protocols', () => {
      expect(isValidUrl('mailto:test@example.com')).toBe(true);
      expect(isValidUrl('tel:+1234567890')).toBe(true);
    });

    it('allows empty values', () => {
      expect(isValidUrl('')).toBe(true);
      expect(isValidUrl('   ')).toBe(true);
    });

    it('rejects invalid URLs', () => {
      expect(isValidUrl('not a url')).toBe(false);
      expect(isValidUrl('ht!tp://invalid')).toBe(false);
    });
  });

  describe('isValidEmail', () => {
    it('validates correct email addresses', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
      expect(isValidEmail('user.name@domain.co.uk')).toBe(true);
      expect(isValidEmail('user+tag@example.com')).toBe(true);
    });

    it('allows empty values', () => {
      expect(isValidEmail('')).toBe(true);
      expect(isValidEmail('   ')).toBe(true);
    });

    it('rejects invalid email addresses', () => {
      expect(isValidEmail('invalid')).toBe(false);
      expect(isValidEmail('invalid@')).toBe(false);
      expect(isValidEmail('@example.com')).toBe(false);
      expect(isValidEmail('invalid@domain')).toBe(false);
    });
  });

  describe('isRequiredFieldValid', () => {
    it('validates non-empty values', () => {
      expect(isRequiredFieldValid('some text')).toBe(true);
      expect(isRequiredFieldValid('a')).toBe(true);
      expect(isRequiredFieldValid('123')).toBe(true);
    });

    it('rejects empty values', () => {
      expect(isRequiredFieldValid('')).toBe(false);
      expect(isRequiredFieldValid('   ')).toBe(false);
      expect(isRequiredFieldValid('\t\n')).toBe(false);
    });
  });

  describe('isValidDataBinding', () => {
    it('validates correct data binding syntax', () => {
      expect(isValidDataBinding('{{ variable }}')).toBe(true);
      expect(isValidDataBinding('{{ user.name }}')).toBe(true);
      expect(isValidDataBinding('{{ product.price }}')).toBe(true);
      expect(isValidDataBinding('{{ order.total }}')).toBe(true);
    });

    it('allows empty values', () => {
      expect(isValidDataBinding('')).toBe(true);
      expect(isValidDataBinding('   ')).toBe(true);
    });

    it('rejects invalid data binding syntax', () => {
      expect(isValidDataBinding('invalid')).toBe(false);
      expect(isValidDataBinding('{ variable }')).toBe(false);
      expect(isValidDataBinding('{{ variable')).toBe(false);
      expect(isValidDataBinding('variable }}')).toBe(false);
      expect(isValidDataBinding('{{ 123variable }}')).toBe(false);
      expect(isValidDataBinding('{{ variable-name }}')).toBe(false);
    });

    it('validates complex nested properties', () => {
      expect(isValidDataBinding('{{ user.profile.firstName }}')).toBe(true);
      expect(isValidDataBinding('{{ product.category.name }}')).toBe(true);
      expect(isValidDataBinding('{{ order.items.0.name }}')).toBe(false); // Numbers not allowed
    });
  });
});

