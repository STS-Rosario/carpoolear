import { describe, expect, it } from 'vitest';
import {
    buildFuelAbuseSupportTicketMessage,
    buildFuelAbuseSupportTicketRoute,
    shouldShowFuelAbuseReport
} from './supportTicketFuelAbuse.js';
import { TRIP_REPORT_MESSAGE_SEPARATOR } from './supportTicketTripReport.js';

const trip = {
    id: 42,
    user: { id: 8, name: 'Juan Pérez' },
    fuel_type: 'nafta_super',
    fuel_consumption: 'high'
};

describe('buildFuelAbuseSupportTicketMessage', () => {
    it('starts with the shared separator and includes trip id and url', () => {
        const message = buildFuelAbuseSupportTicketMessage({
            tripId: 42,
            tripUrl: 'https://carpoolear.com.ar/app/trips/42',
            fuelType: 'nafta_super',
            fuelConsumption: 'high'
        });

        expect(message.startsWith(`${TRIP_REPORT_MESSAGE_SEPARATOR}\n\n`)).toBe(
            true
        );
        expect(message).toContain('Viaje ID: 42');
        expect(message).toContain('https://carpoolear.com.ar/app/trips/42');
    });

    it('includes the claimed fuel type and consumption with its rate', () => {
        const message = buildFuelAbuseSupportTicketMessage({
            tripId: 42,
            fuelType: 'gnc',
            fuelConsumption: 'medium'
        });

        expect(message).toContain('Combustible declarado: gnc');
        expect(message).toContain('Consumo declarado: medium (9 m³/100km)');
    });

    it('omits fuel lines when no fuel profile is available', () => {
        const message = buildFuelAbuseSupportTicketMessage({ tripId: 7 });

        expect(message).toContain('Viaje ID: 7');
        expect(message).not.toContain('Combustible declarado');
        expect(message).not.toContain('Consumo declarado');
    });
});

describe('buildFuelAbuseSupportTicketRoute', () => {
    it('routes to ticket-new with fuel_abuse category and prefilled message', () => {
        const route = buildFuelAbuseSupportTicketRoute({
            trip,
            webAppBaseUrl: 'https://carpoolear.com.ar/app/'
        });

        expect(route.name).toBe('ticket-new');
        expect(route.query.category).toBe('fuel_abuse');
        expect(route.query.message).toContain('Viaje ID: 42');
        expect(route.query.message).toContain(
            'https://carpoolear.com.ar/app/trips/42'
        );
        expect(route.query.message).toContain(
            'Combustible declarado: nafta_super'
        );
        expect(route.query.message).toContain(
            'Consumo declarado: high (12 L/100km)'
        );
    });

    it('uses the car fuel profile when the trip has no snapshot', () => {
        const route = buildFuelAbuseSupportTicketRoute({
            trip: {
                id: 5,
                user: { id: 1 },
                car: { fuel_type: 'diesel', fuel_consumption: 'low' }
            },
            webAppBaseUrl: ''
        });

        expect(route.query.message).toContain('Combustible declarado: diesel');
        expect(route.query.message).toContain(
            'Consumo declarado: low (6 L/100km)'
        );
    });
});

describe('shouldShowFuelAbuseReport', () => {
    it('shows for a logged-in viewer who is not the driver', () => {
        expect(shouldShowFuelAbuseReport({ trip, user: { id: 99 } })).toBe(true);
    });

    it('hides for the driver', () => {
        expect(shouldShowFuelAbuseReport({ trip, user: { id: 8 } })).toBe(false);
        expect(shouldShowFuelAbuseReport({ trip, user: { id: '8' } })).toBe(
            false
        );
    });

    it('hides when logged out or trip is missing', () => {
        expect(shouldShowFuelAbuseReport({ trip, user: null })).toBe(false);
        expect(shouldShowFuelAbuseReport({ trip, user: {} })).toBe(false);
        expect(shouldShowFuelAbuseReport({ trip: null, user: { id: 1 } })).toBe(
            false
        );
    });
});
