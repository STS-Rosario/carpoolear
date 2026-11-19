// @vitest-environment happy-dom
import { createPinia } from 'pinia';
import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import i18n from '../../i18n';
import UnLitroInfoCard from './UnLitroInfoCard.vue';

function mountCard(props = {}) {
    return mount(UnLitroInfoCard, {
        props: {
            charged: true,
            remainingFreeTrips: 0,
            ...props
        },
        global: {
            plugins: [i18n, createPinia()],
            mocks: {
                $publicImg: (name) => `/img/${name}`
            },
            stubs: {
                RouterLink: {
                    template: '<a><slot /></a>'
                }
            },
            directives: {
                clickoutside: {}
            }
        }
    });
}

describe('UnLitroInfoCard', () => {
    it('explains that the trip adds Un litro when sellado is charged', () => {
        const wrapper = mountCard({ charged: true });

        expect(wrapper.text()).toContain('Este viaje aporta Un litro para Carpoolear');
        expect(wrapper.text()).toContain(
            'Es el equivalente a 1 litro de nafta que ayuda a mantener la plataforma'
        );
        expect(wrapper.text()).toContain('¿Qué es esto?');
        expect(wrapper.text()).not.toContain('Este viaje es bonificado');
    });

    it('promotes Club Carpoolear after Qué es esto when Un litro is charged', () => {
        const wrapper = mountCard({ charged: true });

        expect(wrapper.text()).toContain(
            'Si sos parte del Club Carpoolear, no pagás 1L para Carpoolear, ¡sumate!'
        );
        const promo = wrapper.get('[data-testid="un-litro-club-promo"]');
        expect(promo.find('img').attributes('src')).toContain(
            'badges/club-carpoolear.png'
        );
    });

    it('thanks Club members instead of charging Un litro', () => {
        const wrapper = mountCard({
            charged: false,
            clubMemberExempt: true
        });

        expect(wrapper.text()).toContain(
            'Por ser parte del Club Carpoolear no pagás Un litro para Carpoolear'
        );
        expect(wrapper.text()).toContain(
            '¡Gracias por ser parte del Club Carpoolear!'
        );
        expect(wrapper.text()).not.toContain(
            'Si sos parte del Club Carpoolear, no pagás 1L para Carpoolear, ¡sumate!'
        );
        expect(wrapper.find('[data-testid="un-litro-club-promo"]').exists()).toBe(
            false
        );
        const thanks = wrapper.get('[data-testid="un-litro-club-thanks"]');
        expect(thanks.find('img').attributes('src')).toContain(
            'badges/club-carpoolear.png'
        );
    });

    it('does not show the Club Carpoolear promo on bonificado cards', () => {
        const wrapper = mountCard({
            charged: false,
            remainingFreeTrips: 1
        });

        expect(wrapper.text()).not.toContain('Si sos parte del Club Carpoolear');
        expect(wrapper.find('[data-testid="un-litro-club-promo"]').exists()).toBe(
            false
        );
    });

    it('shows Bonificado when sellado is enabled but this trip does not pay it', () => {
        const wrapper = mountCard({
            charged: false,
            remainingFreeTrips: 1
        });

        expect(wrapper.text()).toContain('Bonificado');
        expect(wrapper.text()).toContain('Este viaje es bonificado');
        expect(wrapper.text()).toContain(
            'Te queda 1 viaje sin Un litro para Carpoolear'
        );
        expect(wrapper.text()).not.toContain(
            'Este viaje aporta Un litro para Carpoolear'
        );
    });

    it('does not show Bonificado when the user has no remaining free trips', () => {
        const wrapper = mountCard({
            charged: false,
            remainingFreeTrips: 0
        });

        expect(wrapper.text()).not.toContain('Bonificado');
        expect(wrapper.text()).not.toContain('Este viaje es bonificado');
    });

    it('shows Bonificado for a created waived trip even without remaining free trips', () => {
        const wrapper = mountCard({
            charged: false,
            bonificado: true,
            remainingFreeTrips: 0
        });

        expect(wrapper.text()).toContain('Bonificado');
        expect(wrapper.text()).toContain('Este viaje es bonificado');
        expect(wrapper.text()).not.toContain(
            'Este viaje aporta Un litro para Carpoolear'
        );
    });

    it('opens the explanation modal from Qué es esto', async () => {
        const wrapper = mountCard({ charged: true, freeTripsAmount: 2 });
        await wrapper.get('[data-testid="un-litro-what-is-this"]').trigger('click');

        expect(wrapper.find('[data-testid="un-litro-modal"]').exists()).toBe(true);
        expect(wrapper.text()).toContain('¿Qué es 1 litro para Carpoolear?');
        expect(wrapper.text()).toContain('Así funciona');
        expect(wrapper.text()).toContain('Un peaje más, para la comunidad');
        expect(wrapper.text()).toContain('Cerrar');
        expect(wrapper.find('.modal-container--large').exists()).toBe(true);
    });

    it('can show only Qué es esto for trip detail banners', () => {
        const wrapper = mountCard({ charged: true, linkOnly: true });

        expect(wrapper.text()).toContain('¿Qué es esto?');
        expect(wrapper.text()).not.toContain('Este viaje aporta Un litro para Carpoolear');
        expect(wrapper.text()).not.toContain('Este viaje es bonificado');
    });

    it('explains that Carpoolear invites this trip after an empty paid sellado', () => {
        const wrapper = mountCard({
            charged: false,
            complimentary: true
        });

        expect(wrapper.text()).toContain('Esta vez invita Carpoolear.');
        expect(wrapper.text()).toContain(
            'Tuviste un viaje donde aportaste 1L para Carpoolear'
        );
        expect(wrapper.text()).not.toContain('Este viaje es bonificado');
        expect(wrapper.text()).not.toContain(
            'Este viaje aporta Un litro para Carpoolear'
        );
    });

    it('tells the driver the next trip is waived after a finished empty paid sellado', () => {
        const wrapper = mountCard({
            charged: false,
            nextTripComplimentary: true
        });

        expect(wrapper.text()).toContain('El próximo viaje invita Carpoolear.');
        expect(wrapper.text()).toContain(
            'En este viaje aportaste 1L para Carpoolear'
        );
        expect(wrapper.text()).not.toContain('Esta vez invita Carpoolear.');
    });

    it('includes the page Club promo inside the explanation modal', async () => {
        const wrapper = mountCard({ charged: true });
        await wrapper.get('[data-testid="un-litro-what-is-this"]').trigger('click');

        expect(wrapper.text()).toContain('¿Qué es 1 litro para Carpoolear?');
        expect(wrapper.find('[data-testid="un-litro-page-club-join"]').exists()).toBe(
            true
        );
    });
});
