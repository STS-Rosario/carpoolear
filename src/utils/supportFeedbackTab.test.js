import { describe, expect, it } from 'vitest';
import { USER_TICKET_TYPE_VALUES } from './supportTicketTypeOptions';
import {
    DEFAULT_FEEDBACK_TAB_TICKET_TYPE,
    SUPPORT_FEEDBACK_TAB_HIDDEN_ROUTES,
    isSupportFeedbackFormValid,
    shouldShowSupportFeedbackTab
} from './supportFeedbackTab';

describe('shouldShowSupportFeedbackTab', () => {
    const visible = {
        isLoggedIn: true,
        onboardingVisible: false,
        customSplashVisible: false,
        routeName: 'trips'
    };

    it('shows the tab for a logged-in user on trips', () => {
        expect(shouldShowSupportFeedbackTab(visible)).toBe(true);
    });

    it('hides the tab when the user is logged out', () => {
        expect(shouldShowSupportFeedbackTab({ ...visible, isLoggedIn: false })).toBe(false);
    });

    it('hides the tab during onboarding', () => {
        expect(shouldShowSupportFeedbackTab({ ...visible, onboardingVisible: true })).toBe(false);
    });

    it('hides the tab during the custom splash', () => {
        expect(shouldShowSupportFeedbackTab({ ...visible, customSplashVisible: true })).toBe(false);
    });

    it.each(SUPPORT_FEEDBACK_TAB_HIDDEN_ROUTES)(
        'hides the tab on the %s route',
        (routeName) => {
            expect(shouldShowSupportFeedbackTab({ ...visible, routeName })).toBe(false);
        }
    );
});

describe('isSupportFeedbackFormValid', () => {
    const valid = {
        type: 'feedback',
        subject: 'Need help',
        message: 'The search page is blank'
    };

    it('accepts a complete payload', () => {
        expect(isSupportFeedbackFormValid(valid, USER_TICKET_TYPE_VALUES)).toBe(true);
    });

    it('rejects an unknown type', () => {
        expect(isSupportFeedbackFormValid(
            { ...valid, type: 'excess_contribution' },
            USER_TICKET_TYPE_VALUES
        )).toBe(false);
    });

    it('rejects a subject shorter than 3 characters', () => {
        expect(isSupportFeedbackFormValid({ ...valid, subject: 'Hi' }, USER_TICKET_TYPE_VALUES)).toBe(false);
    });

    it('rejects a subject longer than 160 characters', () => {
        expect(isSupportFeedbackFormValid(
            { ...valid, subject: 'x'.repeat(161) },
            USER_TICKET_TYPE_VALUES
        )).toBe(false);
    });

    it('rejects an empty message', () => {
        expect(isSupportFeedbackFormValid({ ...valid, message: '   ' }, USER_TICKET_TYPE_VALUES)).toBe(false);
    });
});

describe('feedback tab defaults', () => {
    it('defaults the modal category to feedback', () => {
        expect(DEFAULT_FEEDBACK_TAB_TICKET_TYPE).toBe('feedback');
    });

    it('hides the tab on ticket list, create, and detail routes', () => {
        expect(SUPPORT_FEEDBACK_TAB_HIDDEN_ROUTES).toEqual([
            'tickets',
            'ticket-new',
            'ticket-detail'
        ]);
    });
});
