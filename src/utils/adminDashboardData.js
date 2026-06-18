export function normalizeAdminDashboardResponse(response) {
    const payload = response?.data?.data ?? response?.data ?? response ?? {};

    return {
        manualIdentityValidations: payload.manual_identity_validations || [],
        supportTickets: payload.support_tickets || []
    };
}
