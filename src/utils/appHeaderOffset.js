export const APP_HEADER_OFFSET_CSS_VAR = '--app-header-offset';

export function formatHeaderOffsetPx(heightPx) {
    return `${Math.ceil(heightPx)}px`;
}

export function readHeaderOffsetHeight(entry) {
    if (entry?.borderBoxSize?.[0]?.blockSize != null) {
        return entry.borderBoxSize[0].blockSize;
    }
    if (entry?.contentRect?.height != null) {
        return entry.contentRect.height;
    }
    return 0;
}

export function applyAppHeaderOffset(heightPx, root = document.documentElement) {
    if (!root || typeof heightPx !== 'number' || heightPx <= 0) {
        return;
    }
    root.style.setProperty(
        APP_HEADER_OFFSET_CSS_VAR,
        formatHeaderOffsetPx(heightPx)
    );
}

export function clearAppHeaderOffset(root = document.documentElement) {
    if (!root) {
        return;
    }
    root.style.removeProperty(APP_HEADER_OFFSET_CSS_VAR);
}

export function installAppHeaderOffsetObserver(headerEl, options = {}) {
    const root = options.root ?? document.documentElement;

    if (!headerEl) {
        return () => clearAppHeaderOffset(root);
    }

    const measure = () => {
        applyAppHeaderOffset(headerEl.getBoundingClientRect().height, root);
    };

    if (typeof ResizeObserver === 'undefined') {
        measure();
        return () => clearAppHeaderOffset(root);
    }

    const observer = new ResizeObserver((entries) => {
        const entry = entries[0];
        const height =
            readHeaderOffsetHeight(entry) ||
            headerEl.getBoundingClientRect().height;
        applyAppHeaderOffset(height, root);
    });

    observer.observe(headerEl);
    measure();

    return () => {
        observer.disconnect();
        clearAppHeaderOffset(root);
    };
}
