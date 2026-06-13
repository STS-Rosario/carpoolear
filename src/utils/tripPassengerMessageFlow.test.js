import { describe, expect, it } from 'vitest';
import {
    resolveOpenConversationModalState,
    resolvePricingModalConfirm,
    resolveRequestSeatModalConfirm,
    shouldShowPricingHint
} from './tripPassengerMessageFlow.js';

describe('tripPassengerMessageFlow', () => {
    it('shows the pricing hint after confirming the request-seat carpoodatos modal', () => {
        const result = resolveRequestSeatModalConfirm({
            moduleCoordinateByMessage: true,
            user: { do_not_alert_pricing: false },
            config: { disable_user_hints: false }
        });

        expect(result.closeRequestSeatModal).toBe(true);
        expect(result.showPricingModal).toBe(true);
        expect(result.openConversation).toBe(false);
    });

    it('opens the conversation after confirming the pricing carpoodatos modal', () => {
        const result = resolvePricingModalConfirm();

        expect(result.closeRequestSeatModal).toBe(true);
        expect(result.closePricingModal).toBe(true);
        expect(result.openConversation).toBe(true);
    });

    it('skips the pricing hint and opens the conversation when hints were dismissed', () => {
        const result = resolveRequestSeatModalConfirm({
            moduleCoordinateByMessage: true,
            user: { do_not_alert_pricing: true },
            config: { disable_user_hints: false }
        });

        expect(result.closeRequestSeatModal).toBe(true);
        expect(result.showPricingModal).toBe(false);
        expect(result.openConversation).toBe(true);
    });

    it('closes all carpoodatos modals before opening the conversation', () => {
        expect(resolveOpenConversationModalState()).toEqual({
            showRequestSeatModal: false,
            showPricingModal: false
        });
    });

    it('does not show the pricing hint when force is true', () => {
        expect(
            shouldShowPricingHint({
                user: { do_not_alert_pricing: false },
                config: { disable_user_hints: false },
                force: true
            })
        ).toBe(false);
    });
});
