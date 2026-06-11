import { STEP } from './tripCreationSteps.js';

export function buildOutboundTripCreationSnapshot(form) {
    return {
        trip: { ...form.trip },
        points: (form.points || []).map((point) => ({
            name: point.name,
            place: point.place,
            json: point.json,
            location: point.location,
            id: point.id
        })),
        date: form.date,
        dateAnswer: form.dateAnswer,
        time: form.time,
        price: form.price,
        no_lucrar: form.no_lucrar,
        selectedCarId: form.selectedCarId,
        allowForeignPoints: form.allowForeignPoints,
        wantsIntermediateStops: form.wantsIntermediateStops,
        useWeeklySchedule: form.useWeeklySchedule,
        weeklySchedule: form.weeklySchedule,
        weeklyScheduleTime: form.weeklyScheduleTime
    };
}

export function invertTripPointsForReturn(points) {
    if (!Array.isArray(points) || points.length < 2) {
        return points;
    }

    return points
        .slice()
        .reverse()
        .map((point, index) => ({
            id: point.id ?? index,
            name: point.name || '',
            place: point.place,
            json: point.json,
            location: point.location
                ? { lat: point.location.lat, lng: point.location.lng }
                : null
        }));
}

export function buildReturnTripCreationDraftFromSnapshot(snapshot, parentTripId) {
    if (!snapshot) {
        return null;
    }

    return {
        currentStep: STEP.ORIGIN,
        maxVisitedStep: STEP.LAST_DETAILS,
        trip: { ...snapshot.trip },
        points: invertTripPointsForReturn(snapshot.points),
        date: '',
        dateAnswer: '',
        time: '',
        price: snapshot.price || '',
        no_lucrar: snapshot.no_lucrar ?? false,
        selectedCarId: snapshot.selectedCarId,
        allowForeignPoints: snapshot.allowForeignPoints || false,
        wantsIntermediateStops: false,
        useWeeklySchedule: false,
        weeklySchedule: 0,
        weeklyScheduleTime: snapshot.weeklyScheduleTime || '12:00',
        parentTripId,
        updatedAt: new Date().toISOString()
    };
}
