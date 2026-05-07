/**
 * Interpolate known placeholders for support replies using the ticket user's name.
 * @param {string} markdown
 * @param {{ name?: string } | null | undefined} user
 * @returns {string}
 */
export function interpolateSupportTemplateVariables(markdown, user) {
    const raw = markdown == null ? '' : String(markdown);
    const name = user && user.name != null ? String(user.name).trim() : '';
    const firstWord = name ? name.split(/\s+/).filter(Boolean)[0] || '' : '';

    return raw
        .replaceAll('{{nombreCompleto}}', name)
        .replaceAll('{{nombre}}', firstWord);
}
