export function formatAdminUserNavLabel(label, count) {
    if (typeof count === 'number') {
        return `${label} (${count})`;
    }
    return label;
}
