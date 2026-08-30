import { describe, expect, it, vi } from 'vitest';
import { clearSearchBox } from './searchBox.js';

describe('clearSearchBox', () => {
    it('does nothing when the search box is missing', () => {
        expect(() => clearSearchBox(undefined)).not.toThrow();
        expect(() => clearSearchBox(null)).not.toThrow();
        expect(() => clearSearchBox({})).not.toThrow();
    });

    it('calls clear when the search box is present', () => {
        const searchBox = { clear: vi.fn() };
        clearSearchBox(searchBox);
        expect(searchBox.clear).toHaveBeenCalledOnce();
    });
});
