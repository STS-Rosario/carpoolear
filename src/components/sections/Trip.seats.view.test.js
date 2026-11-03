// @vitest-environment happy-dom
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { flushPromises, mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import i18n from '../../i18n';

vi.mock('../../services/dialogs.js', () => ({
    default: { message: vi.fn() }
}));

const changeSeatsMock = vi.fn();

vi.mock('../../stores/trips', async (importOriginal) => {
    const actual = await importOriginal();
    return {
        ...actual,
        useTripsStore: () => ({
            changeSeats: changeSeatsMock,
            remove: vi.fn()
        })
    };
});

vi.mock('../../stores/conversations', async (importOriginal) => {
    const actual = await importOriginal();
    return {
        ...actual,
        useConversationsStore: () => ({
            openTripGroupChat: vi.fn()
        })
    };
});

function ownerTrip(overrides = {}) {
    return {
        id: 42,
        is_passenger: false,
        seats_available: 1,
        total_seats: 0,
        user: { id: 7, name: 'Emilio', image: '' },
        from_town: 'Carro Quemado',
        to_town: 'Don Torcuato',
        trip_date: '2026-11-10 12:00:00',
        ...overrides
    };
}

async function mountOwnerCard(tripOverrides = {}) {
    const pinia = createPinia();
    setActivePinia(pinia);
    const { useAuthStore } = await import('../../stores/auth');
    useAuthStore().$patch({
        user: { id: 7, name: 'Emilio' },
        appConfig: { max_cards_per_row: 2 }
    });

    const { default: Trip } = await import('./Trip.vue');
    return mount(Trip, {
        props: {
            trip: ownerTrip(tripOverrides),
            user: { id: 7, name: 'Emilio' },
            enableChangeSeats: true
        },
        global: {
            plugins: [pinia, i18n],
            stubs: {
                TripCardShell: {
                    template: '<div><slot name="footer-extra" /></div>'
                },
                AppButton: true,
                tripDisplay: true,
                WeeklySchedule: true
            },
            mocks: {
                $router: { push: vi.fn() }
            }
        }
    });
}

describe('Trip card quick free seats stepper', () => {
    beforeEach(() => {
        changeSeatsMock.mockReset();
        changeSeatsMock.mockResolvedValue({
            seats_available: 0,
            total_seats: 0
        });
    });

    it('keeps decrease enabled at one free seat so 0 is allowed even if total_seats is out of sync', async () => {
        const wrapper = await mountOwnerCard();
        const minus = wrapper.get(
            'button[aria-label="Disminuir en uno la cantidad de asientos"]'
        );

        expect(minus.element.disabled).toBe(false);
        wrapper.unmount();
    });

    it('sends a decrement when one free seat remains', async () => {
        const wrapper = await mountOwnerCard({
            total_seats: 1,
            seats_available: 1
        });
        const minus = wrapper.get(
            'button[aria-label="Disminuir en uno la cantidad de asientos"]'
        );

        await minus.trigger('click');
        await flushPromises();

        expect(changeSeatsMock).toHaveBeenCalledWith({
            id: 42,
            increment: -1
        });
        expect(wrapper.get('.trip_seats-available_value').text()).toBe('0');
        wrapper.unmount();
    });
});
