import { isEmptyUserTicketMessage } from './supportInfo';

export const DEFAULT_FEEDBACK_TAB_TICKET_TYPE = 'feedback';

export const SUPPORT_FEEDBACK_TAB_HIDDEN_ROUTES = [
    'tickets',
    'ticket-new',
    'ticket-detail'
];

export function shouldShowSupportFeedbackTab({
    isLoggedIn,
    onboardingVisible,
    customSplashVisible,
    routeName
} = {}) {
    if (!isLoggedIn || onboardingVisible || customSplashVisible) {
        return false;
    }

    return !SUPPORT_FEEDBACK_TAB_HIDDEN_ROUTES.includes(routeName);
}

export function isSupportFeedbackFormValid({ type, subject, message } = {}, allowedTypes = []) {
    if (!allowedTypes.includes(type)) {
        return false;
    }

    const trimmedSubject = String(subject || '').trim();
    if (trimmedSubject.length < 3 || trimmedSubject.length > 160) {
        return false;
    }

    return !isEmptyUserTicketMessage(message);
}
