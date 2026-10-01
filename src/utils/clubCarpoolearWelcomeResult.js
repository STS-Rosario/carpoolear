const ALLOWED_RESULTS = new Set(['success', 'failed', 'pending']);

export function normalizeClubCarpoolearWelcomeResult(value) {
    const normalized = String(value || 'success').toLowerCase();

    if (ALLOWED_RESULTS.has(normalized)) {
        return normalized;
    }

    if (normalized === 'failure') {
        return 'failed';
    }

    return 'success';
}
