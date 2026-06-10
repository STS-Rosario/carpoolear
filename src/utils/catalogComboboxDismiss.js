export function isOutsideCatalogCombobox(rootEl, target) {
    if (!rootEl || !target) {
        return false;
    }

    return !rootEl.contains(target);
}

export function createCatalogComboboxOutsideDismiss(rootEl, onDismiss) {
    const handler = (event) => {
        if (isOutsideCatalogCombobox(rootEl, event.target)) {
            onDismiss();
        }
    };

    document.addEventListener('mousedown', handler, true);

    return () => {
        document.removeEventListener('mousedown', handler, true);
    };
}
