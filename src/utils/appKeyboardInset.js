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
