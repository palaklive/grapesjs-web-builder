import { describe, it, expect, vi, beforeEach } from 'vitest';
import { enhanceComponentTraits } from '../componentTraits';
import type { Editor } from 'grapesjs';

describe('Component Traits Integration', () => {
  let mockEditor: Editor;

  beforeEach(() => {
    mockEditor = {
      DomComponents: {
        addType: vi.fn(),
      },
    } as unknown as Editor;
  });

  it('enhances image component with custom traits', () => {
    enhanceComponentTraits(mockEditor);

    expect(mockEditor.DomComponents.addType).toHaveBeenCalledWith('image', {
      model: {
        defaults: {
          traits: expect.arrayContaining([
            expect.objectContaining({
              type: 'text',
              label: 'Image Source',
              name: 'src',
            }),
            expect.objectContaining({
              type: 'text-required',
              label: 'Alt Text',
              name: 'alt',
            }),
            expect.objectContaining({
              type: 'number',
              label: 'Width',
              name: 'width',
            }),
            expect.objectContaining({
              type: 'number',
              label: 'Height',
              name: 'height',
            }),
          ]),
        },
      },
    });
  });

  it('enhances link component with URL validation', () => {
    enhanceComponentTraits(mockEditor);

    expect(mockEditor.DomComponents.addType).toHaveBeenCalledWith('link', {
      model: {
        defaults: {
          traits: expect.arrayContaining([
            expect.objectContaining({
              type: 'url-validated',
              label: 'Link URL',
              name: 'href',
            }),
            expect.objectContaining({
              type: 'select',
              label: 'Link Target',
              name: 'target',
            }),
          ]),
        },
      },
    });
  });

  it('enhances text component with data source dropdown', () => {
    enhanceComponentTraits(mockEditor);

    expect(mockEditor.DomComponents.addType).toHaveBeenCalledWith('text', {
      model: {
        defaults: {
          traits: expect.arrayContaining([
            expect.objectContaining({
              type: 'text',
              label: 'Content',
              name: 'content',
            }),
            expect.objectContaining({
              type: 'source-dropdown',
              label: 'Data Source',
              name: 'data-source',
            }),
          ]),
        },
      },
    });
  });

  it('enhances button component with comprehensive traits', () => {
    enhanceComponentTraits(mockEditor);

    expect(mockEditor.DomComponents.addType).toHaveBeenCalledWith('button', {
      extend: 'link',
      isComponent: expect.any(Function),
      model: {
        defaults: {
          tagName: 'button',
          attributes: { type: 'button' },
          traits: expect.arrayContaining([
            expect.objectContaining({
              type: 'text-required',
              label: 'Button Text',
              name: 'text',
            }),
            expect.objectContaining({
              type: 'select',
              label: 'Button Type',
              name: 'type',
            }),
            expect.objectContaining({
              type: 'url-validated',
              label: 'Link URL',
              name: 'href',
            }),
            expect.objectContaining({
              type: 'color-preset',
              label: 'Background Color',
              name: 'data-bg-color',
            }),
          ]),
        },
      },
    });
  });

  it('enhances input component with validation traits', () => {
    enhanceComponentTraits(mockEditor);

    expect(mockEditor.DomComponents.addType).toHaveBeenCalledWith('input', {
      isComponent: expect.any(Function),
      model: {
        defaults: {
          tagName: 'input',
          droppable: false,
          traits: expect.arrayContaining([
            expect.objectContaining({
              type: 'select',
              label: 'Type',
              name: 'type',
            }),
            expect.objectContaining({
              type: 'text',
              label: 'Name',
              name: 'name',
            }),
            expect.objectContaining({
              type: 'text',
              label: 'Placeholder',
              name: 'placeholder',
            }),
            expect.objectContaining({
              type: 'checkbox',
              label: 'Required',
              name: 'required',
            }),
          ]),
        },
      },
    });
  });

  it('registers all component types', () => {
    enhanceComponentTraits(mockEditor);

    expect(mockEditor.DomComponents.addType).toHaveBeenCalledTimes(5);
    expect(mockEditor.DomComponents.addType).toHaveBeenCalledWith('image', expect.any(Object));
    expect(mockEditor.DomComponents.addType).toHaveBeenCalledWith('link', expect.any(Object));
    expect(mockEditor.DomComponents.addType).toHaveBeenCalledWith('text', expect.any(Object));
    expect(mockEditor.DomComponents.addType).toHaveBeenCalledWith('button', expect.any(Object));
    expect(mockEditor.DomComponents.addType).toHaveBeenCalledWith('input', expect.any(Object));
  });
});
