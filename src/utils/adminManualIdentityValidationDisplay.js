import dayjs from '../dayjs';
import { getIdentityValidationMethodLabelKey } from './adminUserIdentityVerification.js';

export function getManualIdentityValidationVerifiedLabel(item, t) {
    if (!item || !item.identity_validated) {
        return t('no');
    }

    const methodLabelKey = getIdentityValidationMethodLabelKey(
        item.identity_validation_type
    );

    if (!methodLabelKey) {
        return t('si');
    }

    return `${t('si')} (${t(methodLabelKey)})`;
}

export function isManualIdentityValidationAwaitingPhotos(item) {
    if (!item?.paid) {
        return false;
    }

    if (item.submitted_at) {
        return false;
    }

    return item.review_status === 'awaiting_photos' || item.review_status === 'pending';
}

export function getManualIdentityValidationStatusLabel(item, t) {
    if (item.review_status === 'closed') return t('estadoCerrado');
    if (!item.paid) return t('estadoPendientePago');
    if (isManualIdentityValidationAwaitingPhotos(item)) return t('estadoEsperandoFotos');
    const status = item.review_status;
    if (status === 'pending') return t('estadoPendienteRevision');
    if (status === 'approved' || status === 'approve') return t('estadoAprobado');
    if (status === 'rejected' || status === 'reject') return t('estadoRechazado');
    return status || '-';
}

export function getManualIdentityValidationStatusBadgeClass(item) {
    if (isManualIdentityValidationAwaitingPhotos(item)) return 'label label-info';
    const status = item.review_status;
    if (status === 'approved' || status === 'approve') return 'label label-success';
    if (status === 'rejected' || status === 'reject') return 'label label-danger';
    if (status === 'closed') return 'label label-default';
    if (!item.paid) return 'label label-default';
    return 'label label-warning';
}

export {
    getReviewActionAdminLabelKey as getManualIdentityValidationReviewActionAdminLabelKey,
    shouldShowReviewAdminAction as shouldShowManualIdentityValidationReviewAdminAction
} from './adminReviewActionDisplay.js';

export const ADMIN_DISPLAY_TIMEZONE = 'America/Argentina/Buenos_Aires';

/**
 * Backend timestamps come as naive UTC strings ("YYYY-MM-DD HH:mm:ss"); parse them
 * as UTC and show them in Argentina time, independent of the browser timezone.
 */
export function formatManualIdentityValidationDateTime(value) {
    if (!value) return '-';
    const parsed = dayjs.utc(value);
    if (!parsed.isValid()) return '-';
    return parsed.tz(ADMIN_DISPLAY_TIMEZONE).format('DD/MM/YYYY HH:mm');
}

export function formatManualIdentityValidationWaitingTime(item, t, now = Date.now()) {
    const submitted = item.submitted_at ? dayjs.utc(item.submitted_at).valueOf() : null;
    if (!submitted) return '-';
    const end = item.manual_validation_started_at
        ? dayjs.utc(item.manual_validation_started_at).valueOf()
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
