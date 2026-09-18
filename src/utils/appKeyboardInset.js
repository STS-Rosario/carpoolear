export const APP_KEYBOARD_INSET_CSS_VAR = '--app-keyboard-inset';

export function formatKeyboardInsetPx(insetPx) {
    return `${Math.max(0, Math.round(insetPx))}px`;
}

export function readKeyboardInset(win = window) {
    const visualViewport = win.visualViewport;
    if (!visualViewport) {
        return 0;
    }
    const overlay =
        win.innerHeight -
        visualViewport.height -
        (visualViewport.offsetTop || 0);
    return Math.max(0, Math.round(overlay));
}

export function applyAppKeyboardInset(insetPx, root = document.documentElement) {
    if (!root) {
        return;
    }
    if (typeof insetPx !== 'number' || insetPx <= 0) {
        clearAppKeyboardInset(root);
        return;
    }
    root.style.setProperty(
        APP_KEYBOARD_INSET_CSS_VAR,
        formatKeyboardInsetPx(insetPx)
    );
}

export function clearAppKeyboardInset(root = document.documentElement) {
    if (!root) {
        return;
    }
    root.style.removeProperty(APP_KEYBOARD_INSET_CSS_VAR);
}

function listen(target, type, handler) {
    if (!target || typeof target.addEventListener !== 'function') {
        return () => {};
    }
    target.addEventListener(type, handler);
    return () => {
        if (typeof target.removeEventListener === 'function') {
            target.removeEventListener(type, handler);
        }
    };
}

export function installAppKeyboardInsetObserver(options = {}) {
    const win = options.window ?? window;
    const root = options.root ?? win.document?.documentElement;
    const measure = () => {
        applyAppKeyboardInset(readKeyboardInset(win), root);
    };
    const visualViewport = win.visualViewport;

    if (!visualViewport || typeof visualViewport.addEventListener !== 'function') {
        measure();
        return () => clearAppKeyboardInset(root);
    }

    const stopListening = [
        listen(visualViewport, 'resize', measure),
        listen(visualViewport, 'scroll', measure),
        listen(win, 'resize', measure)
    ];

    measure();

    return () => {
        stopListening.forEach((stop) => stop());
        clearAppKeyboardInset(root);
    };
}
