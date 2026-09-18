import { describe, expect, it, beforeEach } from 'vitest';
import {
    APP_KEYBOARD_INSET_CSS_VAR,
    applyAppKeyboardInset,
    clearAppKeyboardInset,
    formatKeyboardInsetPx,
    installAppKeyboardInsetObserver,
    readKeyboardInset
} from './appKeyboardInset.js';

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

describe('appKeyboardInset', () => {
    let root;

    beforeEach(() => {
        root = createStyleRoot();
    });

    it('formats keyboard inset as whole pixels', () => {
        expect(formatKeyboardInsetPx(320.4)).toBe('320px');
        expect(formatKeyboardInsetPx(-12)).toBe('0px');
    });

    it('reads zero when visualViewport is missing or the layout already shrank', () => {
        expect(readKeyboardInset({ innerHeight: 800 })).toBe(0);
        expect(
            readKeyboardInset({
                innerHeight: 500,
                visualViewport: { height: 500, offsetTop: 0 }
            })
        ).toBe(0);
    });

    it('reads the overlay amount when the visual viewport shrinks under a full layout height', () => {
        expect(
            readKeyboardInset({
                innerHeight: 800,
                visualViewport: { height: 480, offsetTop: 0 }
            })
        ).toBe(320);
        expect(
            readKeyboardInset({
                innerHeight: 800,
                visualViewport: { height: 500, offsetTop: 40 }
            })
        ).toBe(260);
    });

    it('applies and clears the CSS variable on the document root', () => {
        applyAppKeyboardInset(320, root);
        expect(root.style.getPropertyValue(APP_KEYBOARD_INSET_CSS_VAR)).toBe(
            '320px'
        );

        applyAppKeyboardInset(0, root);
        expect(root.style.getPropertyValue(APP_KEYBOARD_INSET_CSS_VAR)).toBe('');

        applyAppKeyboardInset(180, root);
        clearAppKeyboardInset(root);
        expect(root.style.getPropertyValue(APP_KEYBOARD_INSET_CSS_VAR)).toBe('');
    });

    it('updates the CSS variable when the visual viewport resizes or scrolls', () => {
        const viewportListeners = {};
        const windowListeners = {};
        const win = {
            innerHeight: 800,
            visualViewport: {
                height: 800,
                offsetTop: 0,
                addEventListener(type, handler) {
                    viewportListeners[type] = handler;
                },
                removeEventListener(type) {
                    delete viewportListeners[type];
                }
            },
            addEventListener(type, handler) {
                windowListeners[type] = handler;
            },
            removeEventListener(type) {
                delete windowListeners[type];
            },
            document: { documentElement: root }
        };

        const stop = installAppKeyboardInsetObserver({ window: win, root });
        expect(root.style.getPropertyValue(APP_KEYBOARD_INSET_CSS_VAR)).toBe('');

        win.visualViewport.height = 480;
        viewportListeners.resize();
        expect(root.style.getPropertyValue(APP_KEYBOARD_INSET_CSS_VAR)).toBe(
            '320px'
        );

        win.visualViewport.height = 500;
        win.visualViewport.offsetTop = 40;
        viewportListeners.scroll();
        expect(root.style.getPropertyValue(APP_KEYBOARD_INSET_CSS_VAR)).toBe(
            '260px'
        );

        win.innerHeight = 700;
        win.visualViewport.height = 700;
        win.visualViewport.offsetTop = 0;
        windowListeners.resize();
        expect(root.style.getPropertyValue(APP_KEYBOARD_INSET_CSS_VAR)).toBe('');

        stop();
        expect(viewportListeners.resize).toBeUndefined();
        expect(viewportListeners.scroll).toBeUndefined();
        expect(windowListeners.resize).toBeUndefined();
        expect(root.style.getPropertyValue(APP_KEYBOARD_INSET_CSS_VAR)).toBe('');
    });

    it('measures once when visualViewport events are unavailable', () => {
        const win = {
            innerHeight: 800,
            visualViewport: { height: 500, offsetTop: 0 },
            document: { documentElement: root }
        };

        const stop = installAppKeyboardInsetObserver({ window: win, root });
        expect(root.style.getPropertyValue(APP_KEYBOARD_INSET_CSS_VAR)).toBe(
            '300px'
        );
        stop();
        expect(root.style.getPropertyValue(APP_KEYBOARD_INSET_CSS_VAR)).toBe('');
    });
});
