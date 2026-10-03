// @vitest-environment happy-dom
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
            plugins: [i18n]
        }
    });
}

describe('UnLitroInfoCard', () => {
    it('explains that the trip adds Un litro when sellado is charged', () => {
        const wrapper = mountCard({ charged: true });

        expect(wrapper.text()).toContain('Este viaje suma Un litro para Carpoolear');
        expect(wrapper.text()).toContain(
            'Es 1 litro de nafta que ayuda a mantener la plataforma'
        );
        expect(wrapper.text()).toContain('¿Qué es esto?');
        expect(wrapper.text()).not.toContain('Este viaje es bonificado');
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
            'Este viaje suma Un litro para Carpoolear'
        );
    });

    it('opens the explanation modal from Qué es esto', async () => {
        const wrapper = mountCard({ charged: true, freeTripsAmount: 2 });
        await wrapper.get('[data-testid="un-litro-what-is-this"]').trigger('click');

        expect(wrapper.find('[data-testid="un-litro-modal"]').exists()).toBe(true);
        expect(wrapper.text()).toContain('¿Qué es Un litro para Carpoolear?');
        expect(wrapper.text()).toContain(
            'Tenés 2 viajes bonificados para probar la plataforma'
        );
    });

    it('can show only Qué es esto for trip detail banners', () => {
        const wrapper = mountCard({ charged: true, linkOnly: true });

        expect(wrapper.text()).toContain('¿Qué es esto?');
        expect(wrapper.text()).not.toContain('Este viaje suma Un litro para Carpoolear');
        expect(wrapper.text()).not.toContain('Este viaje es bonificado');
    });
});
