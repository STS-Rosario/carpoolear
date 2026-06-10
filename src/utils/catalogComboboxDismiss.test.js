/**
 * @vitest-environment happy-dom
 */
import { afterEach, describe, expect, it, vi } from 'vitest';
import {
    createCatalogComboboxOutsideDismiss,
    isOutsideCatalogCombobox
} from './catalogComboboxDismiss.js';

describe('catalogComboboxDismiss', () => {
    afterEach(() => {
        document.body.innerHTML = '';
    });

    it('detects pointer targets outside the combobox root', () => {
        const root = document.createElement('div');
        const input = document.createElement('input');
        root.appendChild(input);
        const outside = document.createElement('button');

        expect(isOutsideCatalogCombobox(root, input)).toBe(false);
        expect(isOutsideCatalogCombobox(root, outside)).toBe(true);
    });

    it('dismisses on outside mousedown using capture phase', () => {
        const root = document.createElement('div');
        const input = document.createElement('input');
        root.appendChild(input);
        document.body.appendChild(root);

        const onDismiss = vi.fn();
        const removeListener = createCatalogComboboxOutsideDismiss(root, onDismiss);

        const outside = document.createElement('button');
        document.body.appendChild(outside);
        outside.dispatchEvent(
            new MouseEvent('mousedown', { bubbles: true, cancelable: true })
        );

        expect(onDismiss).toHaveBeenCalledTimes(1);

        input.dispatchEvent(
            new MouseEvent('mousedown', { bubbles: true, cancelable: true })
        );
        expect(onDismiss).toHaveBeenCalledTimes(1);

        removeListener();
    });

    it('dismisses when clicking another field inside a modal container', () => {
        const modal = document.createElement('div');
        const combobox = document.createElement('div');
        const input = document.createElement('input');
        const otherField = document.createElement('input');

        combobox.appendChild(input);
        modal.appendChild(combobox);
        modal.appendChild(otherField);
        document.body.appendChild(modal);

        const onDismiss = vi.fn();
        const removeListener = createCatalogComboboxOutsideDismiss(
            combobox,
            onDismiss
        );

        otherField.dispatchEvent(
            new MouseEvent('mousedown', { bubbles: true, cancelable: true })
        );

        expect(onDismiss).toHaveBeenCalledTimes(1);
        removeListener();
    });
});
