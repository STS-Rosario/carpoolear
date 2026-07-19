const ADMIN_ACTION_STATUSES = ['Open', 'En revision', 'Necesita revisión'];
const TERMINAL_STATUSES = ['Resuelto', 'Cerrado'];

export function isTicketAssignableByAdmin(ticket) {
    if (!ticket) {
        return false;
    }
    if (TERMINAL_STATUSES.includes(ticket.status)) {
        return false;
    }
    if (Number(ticket.unread_for_admin) > 0) {
        return true;
    }
    return ADMIN_ACTION_STATUSES.includes(ticket.status);
}

export function isTicketAssignedToAdmin(ticket, adminUserId) {
    if (!ticket || adminUserId == null) {
        return false;
    }
    return Number(ticket.assigned_to_user_id) === Number(adminUserId);
}

export function assignedAdminDisplayName(ticket) {
    const assigned = ticket && ticket.assigned_to;
    if (!assigned) {
        return '';
    }
    const name = assigned.name != null ? String(assigned.name).trim() : '';
    return name || '';
}

export function hasActiveTicketAssignment(ticket) {
    return Boolean(ticket && ticket.assigned_to_user_id != null);
}

export function isReplyBlockedByOtherAdminAssignment(ticket, adminUserId) {
    return hasActiveTicketAssignment(ticket) &&
        !isTicketAssignedToAdmin(ticket, adminUserId);
}
