export function getManualIdentityValidationStatusLabel(item, t) {
    if (!item.paid) return t('estadoPendientePago');
    const status = item.review_status;
    if (status === 'pending') return t('estadoPendienteRevision');
    if (status === 'approved' || status === 'approve') return t('estadoAprobado');
    if (status === 'rejected' || status === 'reject') return t('estadoRechazado');
    return status || '-';
}

export function getManualIdentityValidationStatusBadgeClass(item) {
    const status = item.review_status;
    if (status === 'approved' || status === 'approve') return 'label label-success';
    if (status === 'rejected' || status === 'reject') return 'label label-danger';
    if (!item.paid) return 'label label-default';
    return 'label label-warning';
}

export function formatManualIdentityValidationWaitingTime(item, t, now = Date.now()) {
    const submitted = item.submitted_at ? new Date(item.submitted_at).getTime() : null;
    if (!submitted) return '-';
    const end = item.manual_validation_started_at
        ? new Date(item.manual_validation_started_at).getTime()
        : now;
    let diffMs = Math.max(0, end - submitted);
    const days = Math.floor(diffMs / 86400000);
    diffMs %= 86400000;
    const hours = Math.floor(diffMs / 3600000);
    diffMs %= 3600000;
    const minutes = Math.floor(diffMs / 60000);
    const parts = [];
    if (days > 0) parts.push(`${days} ${t('tiempoEsperaDias')}`);
    if (hours > 0) parts.push(`${hours} ${t('tiempoEsperaHoras')}`);
    parts.push(`${minutes} ${t('tiempoEsperaMinutos')}`);
    return parts.join(' ');
}
