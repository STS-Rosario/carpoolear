export function formatAdminUserNavLabel(label, count) {
    if (typeof count === 'number') {
        return `${label} (${count})`;
    }
    return label;
}

export function formatAdminUserNavLabelFromKey(translate, labelKey, count) {
    return formatAdminUserNavLabel(translate(labelKey), count);
}
