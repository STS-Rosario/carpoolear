/** User-facing support ticket categories (value + i18n label key). */
export const USER_TICKET_TYPE_OPTIONS = [
    { value: 'account_recovery', labelKey: 'ticketTypeAccountRecovery' },
    { value: 'bug_report', labelKey: 'ticketTypeBug' },
    { value: 'contact', labelKey: 'ticketTypeContact' },
    { value: 'feedback', labelKey: 'ticketTypeSuggestion' },
    { value: 'report', labelKey: 'ticketTypeReport' },
    { value: 'account_verification', labelKey: 'ticketTypeAccountVerification' }
];

export const DEFAULT_USER_TICKET_TYPE = 'account_recovery';

export const USER_TICKET_TYPE_VALUES = USER_TICKET_TYPE_OPTIONS.map((option) => option.value);
