import { describe, expect, it } from 'vitest';
import {
    buildTripReportSupportTicketMessage,
    buildTripReportSupportTicketRoute,
    resolveWebAppBaseUrl
} from './supportTicketTripReport.js';

describe('buildTripReportSupportTicketMessage', () => {
    it('leaves room to type above a separator before trip context', () => {
        const message = buildTripReportSupportTicketMessage({
            tripId: 42,
            tripUrl: 'https://carpoolear.com.ar/app/trips/42',
            driverName: 'Juan Pérez',
            driverProfileUrl: 'https://carpoolear.com.ar/app/profile/8'
        });

        expect(message.startsWith('\n====\n\n')).toBe(true);
        expect(message).toContain('Viaje ID: 42');
    });

    it('includes trip id, trip link, driver name and driver profile link', () => {
        const message = buildTripReportSupportTicketMessage({
            tripId: 42,
            tripUrl: 'https://carpoolear.com.ar/app/trips/42',
            driverName: 'Juan Pérez',
            driverProfileUrl: 'https://carpoolear.com.ar/app/profile/8'
        });

        expect(message).toContain('Viaje ID: 42');
        expect(message).toContain('https://carpoolear.com.ar/app/trips/42');
        expect(message).toContain('Juan Pérez');
        expect(message).toContain('https://carpoolear.com.ar/app/profile/8');
    });

    it('omits driver lines when driver data is missing', () => {
        const message = buildTripReportSupportTicketMessage({
            tripId: 7,
            tripUrl: 'https://carpoolear.com.ar/app/trips/7'
        });

        expect(message).toContain('Viaje ID: 7');
        expect(message).toContain('https://carpoolear.com.ar/app/trips/7');
        expect(message).not.toContain('Conductor:');
        expect(message).not.toContain('Perfil conductor:');
    });
});

describe('buildTripReportSupportTicketRoute', () => {
    it('routes to a report ticket prefilled with trip context', () => {
        const route = buildTripReportSupportTicketRoute({
            trip: {
                id: 99,
                user: { id: 8, name: 'Ana García' }
            },
            webAppBaseUrl: 'https://carpoolear.com.ar/app'
        });

        expect(route).toEqual({
            name: 'ticket-new',
            query: {
                category: 'report',
                message: buildTripReportSupportTicketMessage({
                    tripId: 99,
                    tripUrl: 'https://carpoolear.com.ar/app/trips/99',
                    driverName: 'Ana García',
                    driverProfileUrl: 'https://carpoolear.com.ar/app/profile/8'
                })
            }
        });
    });
});

describe('resolveWebAppBaseUrl', () => {
    it('prefers VITE_WEB_URL when available', () => {
        expect(
            resolveWebAppBaseUrl({
                VITE_WEB_URL: 'https://carpoolear.com.ar/app/'
            })
        ).toBe('https://carpoolear.com.ar/app');
    });
});
