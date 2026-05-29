/** Statuses where admins are expected to take action (excluding user-wait states). */
export const ADMIN_ATTENTION_STATUSES = ['En revision', 'Necesita revisión'];

export function ticketNeedsAdminAttention(ticket) {
    if (!ticket) return false;
    if (Number(ticket.unread_for_admin) > 0) return true;
    return ADMIN_ATTENTION_STATUSES.includes(ticket.status);
}
