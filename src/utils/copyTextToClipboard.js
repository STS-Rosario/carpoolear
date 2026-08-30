export async function copyTextToClipboard(text) {
    if (!text) {
        return false;
    }
    if (
        typeof navigator === 'undefined' ||
        !navigator.clipboard ||
        typeof navigator.clipboard.writeText !== 'function'
    ) {
        return false;
    }
    await navigator.clipboard.writeText(text);
    return true;
}
