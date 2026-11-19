import { fuelConsumptionRateLabel, resolveTripFuelProfile } from './carFields.js';
import {
    TRIP_REPORT_MESSAGE_SEPARATOR,
    buildTripDetailUrlFromBase
} from './supportTicketTripReport.js';

export const FUEL_ABUSE_TICKET_CATEGORY = 'fuel_abuse';

export function buildFuelAbuseSupportTicketMessage({
    tripId,
    tripUrl,
    fuelType,
    fuelConsumption
}) {
    const lines = [`Viaje ID: ${tripId}`];

    if (tripUrl) {
        lines.push(`Viaje: ${tripUrl}`);
    }

    if (fuelType && fuelConsumption) {
        const rate = fuelConsumptionRateLabel(fuelType, fuelConsumption);
        lines.push(`Combustible declarado: ${fuelType}`);
        lines.push(
            `Consumo declarado: ${fuelConsumption}${rate ? ` (${rate})` : ''}`
        );
    }

    return `${TRIP_REPORT_MESSAGE_SEPARATOR}\n\n${lines.join('\n')}`;
}

export function buildFuelAbuseSupportTicketRoute({ trip, webAppBaseUrl }) {
    const tripId = trip && trip.id;
    const fuelProfile = resolveTripFuelProfile(trip);

    return {
        name: 'ticket-new',
        query: {
            category: FUEL_ABUSE_TICKET_CATEGORY,
            message: buildFuelAbuseSupportTicketMessage({
                tripId,
                tripUrl: buildTripDetailUrlFromBase(tripId, webAppBaseUrl),
                fuelType: fuelProfile && fuelProfile.fuel_type,
                fuelConsumption: fuelProfile && fuelProfile.fuel_consumption
            })
        }
    };
}

export function shouldShowFuelAbuseReport({ trip, user }) {
    if (!trip || !user || user.id == null || user.id === '') {
        return false;
    }

    const driverId = trip.user && trip.user.id;

    return String(driverId) !== String(user.id);
}
