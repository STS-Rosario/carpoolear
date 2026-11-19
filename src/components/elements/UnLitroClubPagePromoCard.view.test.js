// @vitest-environment happy-dom
import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import i18n from '../../i18n';
import UnLitroClubPagePromoCard from './UnLitroClubPagePromoCard.vue';

function mountCard(props = {}) {
    return mount(UnLitroClubPagePromoCard, {
        props,
        global: {
            plugins: [i18n],
            stubs: {
                RouterLink: {
                    template: '<a><slot /></a>'
                }
            }
        }
    });
}

describe('UnLitroClubPagePromoCard', () => {
    it('shows only the large join pill for guests', () => {
        const wrapper = mountCard({ clubMemberExempt: false });

        expect(wrapper.find('[data-testid="un-litro-page-club-join"]').exists()).toBe(
            true
        );
        expect(wrapper.find('[data-testid="un-litro-club-promo"]').exists()).toBe(
            true
        );
        expect(wrapper.find('.un-litro-card--large').exists()).toBe(false);
        expect(wrapper.text()).toContain(
            'Si sos parte del Club Carpoolear, no pagás 1L para Carpoolear, ¡sumate!'
        );
        expect(wrapper.text()).not.toContain(
            'Por ser parte del Club Carpoolear no pagás Un litro para Carpoolear'
        );
    });

    it('shows the large blue thank-you card for Club members', () => {
        const wrapper = mountCard({ clubMemberExempt: true });

        expect(wrapper.find('.un-litro-card--large').exists()).toBe(true);
        expect(wrapper.find('[data-testid="un-litro-club-thanks"]').exists()).toBe(
            true
        );
        expect(wrapper.text()).toContain(
            'Por ser parte del Club Carpoolear no pagás Un litro para Carpoolear'
        );
        expect(wrapper.text()).toContain(
            '¡Gracias por ser parte del Club Carpoolear!'
        );
        expect(wrapper.find('[data-testid="un-litro-club-promo"]').exists()).toBe(
            false
        );
    });
});