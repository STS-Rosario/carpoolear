import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import {
    APP_HEADER_OFFSET_CSS_VAR,
    applyAppHeaderOffset,
    clearAppHeaderOffset,
    formatHeaderOffsetPx,
    installAppHeaderOffsetObserver,
    readHeaderOffsetHeight
} from './appHeaderOffset.js';

function createStyleRoot() {
    const styles = new Map();
    return {
        style: {
            setProperty(name, value) {
                styles.set(name, value);
            },
            getPropertyValue(name) {
                return styles.get(name) || '';
            },
            removeProperty(name) {
                styles.delete(name);
            }
        }
    };
}

describe('appHeaderOffset', () => {
    let root;

    beforeEach(() => {
        root = createStyleRoot();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('formats header offset as whole pixels', () => {
        expect(formatHeaderOffsetPx(51.2)).toBe('52px');
        expect(formatHeaderOffsetPx(110.01)).toBe('111px');
    });

    it('applies and clears the CSS variable on the document root', () => {
        applyAppHeaderOffset(120, root);
        expect(root.style.getPropertyValue(APP_HEADER_OFFSET_CSS_VAR)).toBe(
            '120px'
        );

        clearAppHeaderOffset(root);
        expect(root.style.getPropertyValue(APP_HEADER_OFFSET_CSS_VAR)).toBe('');
    });

    it('reads border box height from ResizeObserver entries when available', () => {
        const height = readHeaderOffsetHeight({
            borderBoxSize: [{ blockSize: 118.4 }],
            contentRect: { height: 100 }
        });
        expect(height).toBe(118.4);
    });

    it('updates the CSS variable when the header is resized', () => {
        const headerEl = {
            getBoundingClientRect: () => ({ height: 51 })
        };

        let callback;
        const observer = {
            observe: vi.fn(),
            disconnect: vi.fn()
        };
        global.ResizeObserver = class {
            constructor(cb) {
                callback = cb;
            }

            observe() {
                observer.observe();
            }

            disconnect() {
                observer.disconnect();
            }
        };

        const stop = installAppHeaderOffsetObserver(headerEl, { root });
        expect(root.style.getPropertyValue(APP_HEADER_OFFSET_CSS_VAR)).toBe(
            '51px'
        );

        const resizeEntries = [
            {
                borderBoxSize: [{ blockSize: 112 }],
                contentRect: { height: 112 }
            }
        ];
        callback(resizeEntries);
        expect(root.style.getPropertyValue(APP_HEADER_OFFSET_CSS_VAR)).toBe(
            '112px'
        );

        stop();
        expect(observer.disconnect).toHaveBeenCalled();
        expect(root.style.getPropertyValue(APP_HEADER_OFFSET_CSS_VAR)).toBe('');
    });

    it('falls back to a one-time measurement when ResizeObserver is unavailable', () => {
        const previous = global.ResizeObserver;
        delete global.ResizeObserver;

        const headerEl = {
            getBoundingClientRect: () => ({ height: 88 })
        };

        const stop = installAppHeaderOffsetObserver(headerEl, { root });
        expect(root.style.getPropertyValue(APP_HEADER_OFFSET_CSS_VAR)).toBe(
            '88px'
        );

        stop();
        global.ResizeObserver = previous;
    });
});
