import axios from 'axios';
import { useAuthStore } from '../stores/auth';

export function resolveApiBaseUrl() {
    const legacyBase = (typeof process !== 'undefined' && process.env && process.env.API_URL
        ? String(process.env.API_URL)
        : ''
    ).replace(/\/$/, '');
    const viteBase = (import.meta.env && import.meta.env.VITE_API_URL
        ? String(import.meta.env.VITE_API_URL)
        : ''
    ).replace(/\/$/, '');

    return legacyBase || viteBase;
}

export function supportTicketAttachmentImagePath(ticketId, attachmentId, { admin = false } = {}) {
    const prefix = admin ? '/api/admin/support/tickets/' : '/api/support/tickets/';

    return `${prefix}${ticketId}/attachments/${attachmentId}/image`;
}

export function fetchSupportTicketAttachmentBlob(ticketId, attachmentId, { admin = false } = {}) {
    const baseUrl = resolveApiBaseUrl();
    if (!baseUrl) {
        return Promise.reject(new Error('API base URL is not configured'));
    }

    const authHeader = useAuthStore().authHeader;
    const path = supportTicketAttachmentImagePath(ticketId, attachmentId, { admin });

    return axios.get(baseUrl + path, {
        responseType: 'blob',
        headers: authHeader
    }).then((res) => res.data);
}
