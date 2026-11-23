export const DEFAULT_SUPPORT_TICKET_MAX_ATTACHMENTS = 6;

export function getSupportTicketMaxAttachments(config) {
    const fromConfig = config && config.support_ticket_max_attachments;
    const parsed = parseInt(fromConfig, 10);
    if (Number.isFinite(parsed) && parsed > 0) {
        return Math.min(20, parsed);
    }

    return DEFAULT_SUPPORT_TICKET_MAX_ATTACHMENTS;
}
