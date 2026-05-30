import dayjs from '../dayjs';

/** Statuses where admins are expected to take action (excluding user-wait states). */
export const ADMIN_ATTENTION_STATUSES = new Set(['En revision', 'Necesita revisión']);

export const SUPPORT_TICKET_UPDATED_WARNING_DAYS = 2;
export const SUPPORT_TICKET_UPDATED_CRITICAL_DAYS = 4;

export const UPDATED_AGE_ATTENTION_CLASS_BY_LEVEL = {
    warning: 'support-tickets-table__updated--warning',
    critical: 'support-tickets-table__updated--critical'
};

export function hasUnreadAdminMessages(ticket) {
    return Number(ticket && ticket.unread_for_admin) > 0;
}

export function ticketNeedsAdminAttention(ticket) {
    if (!ticket) return false;
    if (hasUnreadAdminMessages(ticket)) return true;
    return ADMIN_ATTENTION_STATUSES.has(ticket.status);
}

export function getUpdatedAgeAttentionLevel(updatedAt, now = dayjs()) {
    if (!updatedAt) return null;
    const days = dayjs(now).diff(dayjs(updatedAt), 'day');
    if (days >= SUPPORT_TICKET_UPDATED_CRITICAL_DAYS) return 'critical';
    if (days >= SUPPORT_TICKET_UPDATED_WARNING_DAYS) return 'warning';
    return null;
}

export function getUpdatedAgeAttentionClass(ticket, now = dayjs()) {
    if (!ticketNeedsAdminAttention(ticket)) return '';
    const level = getUpdatedAgeAttentionLevel(ticket.updated_at, now);
    return UPDATED_AGE_ATTENTION_CLASS_BY_LEVEL[level] || '';
}
