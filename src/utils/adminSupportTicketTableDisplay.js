import dayjs from '../dayjs';
import { TICKET_TYPE_LABEL_KEYS, TICKET_PRIORITY_LABEL_KEYS } from './supportTicketLabels';
import {
    TICKET_STATUS_CLASS_MAP,
    TICKET_STATUS_LABEL_KEYS as STATUS_LABEL_KEYS
} from './supportTicketStatusLabels';
import { getUpdatedAgeAttentionClass, hasUnreadUserReplyIndicator } from './supportTicketUpdatedAgeAttention';

export function capitalizeFirst(value) {
    if (!value) return '';
    return value.charAt(0).toUpperCase() + value.slice(1);
}

export function ticketCategoryLabel(type, t) {
    const key = TICKET_TYPE_LABEL_KEYS[type];
    if (key) return t(key);
    return capitalizeFirst(type || '');
}

export function supportTicketFullDate(value) {
    if (!value) return '-';
    return dayjs(value).format('YYYY-MM-DD HH:mm:ss');
}

export function supportTicketRelativeDate(value) {
    if (!value) return '-';
    return dayjs(value).fromNow();
}

export function supportTicketStatusLabel(status, t) {
    if (STATUS_LABEL_KEYS[status]) return t(STATUS_LABEL_KEYS[status]);
    return status || '-';
}

export function supportTicketStatusClass(status) {
    return TICKET_STATUS_CLASS_MAP[status] || 'label label-primary';
}

export function supportTicketPriorityLabel(priority, t) {
    const key = (priority || '').toLowerCase();
    if (TICKET_PRIORITY_LABEL_KEYS[key]) return t(TICKET_PRIORITY_LABEL_KEYS[key]);
    return capitalizeFirst(priority || '');
}

export function supportTicketPriorityClass(priority) {
    const key = (priority || '').toLowerCase();
    return {
        high: 'label label-danger',
        normal: 'label label-info',
        low: 'label label-default'
    }[key] || 'label label-default';
}

export function supportTicketUpdatedAgeAttentionClass(ticket, now) {
    return getUpdatedAgeAttentionClass(ticket, now);
}

export function supportTicketHasUserLastReply(ticket) {
    return hasUnreadUserReplyIndicator(ticket);
}

export function supportTicketOwnerDisplayName(ticket) {
    const user = ticket && ticket.user;
    if (!user) return '';
    const name = user.name != null && String(user.name).trim();
    if (name) return name;
    const username = user.username != null && String(user.username).trim();
    if (username) return username;
    return '';
}

export function supportTicketCanLinkOwnerProfile(ticket) {
    return Boolean(ticket && ticket.user && ticket.user.id);
}
