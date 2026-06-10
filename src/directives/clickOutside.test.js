/**
 * @vitest-environment happy-dom
 */
import { afterEach, describe, expect, it, vi } from 'vitest';
import clickOutside, { shouldInvokeClickOutside } from './clickOutside.js';

describe('clickOutside directive', () => {
    afterEach(() => {
        document.body.innerHTML = '';
    });

    it('identifies outside targets', () => {
        const root = document.createElement('div');
        const inside = document.createElement('span');
        const outside = document.createElement('button');
        root.appendChild(inside);

        expect(shouldInvokeClickOutside(root, inside)).toBe(false);
        expect(shouldInvokeClickOutside(root, outside)).toBe(true);
    });

    it('invokes handler on outside mousedown in capture phase', () => {
        const el = document.createElement('div');
        const inner = document.createElement('span');
        el.appendChild(inner);
        document.body.appendChild(el);

        const handler = vi.fn();
        clickOutside.mounted(el, { value: handler });

        const outside = document.createElement('button');
        document.body.appendChild(outside);
        outside.dispatchEvent(
            new MouseEvent('mousedown', { bubbles: true, cancelable: true })
        );

        expect(handler).toHaveBeenCalledTimes(1);

        inner.dispatchEvent(
            new MouseEvent('mousedown', { bubbles: true, cancelable: true })
        );
        expect(handler).toHaveBeenCalledTimes(1);

        clickOutside.unmounted(el);
    });
});
