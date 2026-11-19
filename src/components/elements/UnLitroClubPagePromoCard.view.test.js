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
    it('shows a large join card for guests without the blue shell', () => {
        const wrapper = mountCard({ clubMemberExempt: false });

        expect(wrapper.find('[data-testid="un-litro-page-club-join"]').exists()).toBe(
            true
        );
        expect(wrapper.find('.un-litro-page-club-card').exists()).toBe(true);
        expect(wrapper.find('.un-litro-card').exists()).toBe(false);
        expect(wrapper.text()).toContain(
            'Si sos parte del Club Carpoolear, no pagás 1L para Carpoolear, ¡sumate!'
        );
        expect(wrapper.text()).not.toContain(
            'Por ser parte del Club Carpoolear no pagás Un litro para Carpoolear'
        );
    });

    it('shows a large thank-you card for Club members without the blue shell', () => {
        const wrapper = mountCard({ clubMemberExempt: true });

        expect(wrapper.find('[data-testid="un-litro-page-club-member"]').exists()).toBe(
            true
        );
        expect(wrapper.find('.un-litro-page-club-card').exists()).toBe(true);
        expect(wrapper.find('.un-litro-card').exists()).toBe(false);
        expect(wrapper.text()).toContain(
            'Por ser parte del Club Carpoolear no pagás Un litro para Carpoolear'
        );
        expect(wrapper.text()).toContain(
            '¡Gracias por ser parte del Club Carpoolear!'
        );
        expect(wrapper.find('[data-testid="un-litro-page-club-join"]').exists()).toBe(
            false
        );
    });
});