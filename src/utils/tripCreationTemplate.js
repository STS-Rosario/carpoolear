import { STEP } from './tripCreationSteps.js';
import dayjs from '../dayjs.js';
import TripCreationTemplateApi from '../services/api/TripCreationTemplate.js';

const tripCreationTemplateApi = new TripCreationTemplateApi();

function assertSaveTripCreationTemplateInput(name, data) {
    if (typeof name !== 'string' || !name.trim()) {
        throw new Error('Trip creation template name is required');
    }

    if (!data) {
        throw new Error('Trip creation template data is required');
    }
}

function serializeTripCreationTemplateData(data) {
    return JSON.parse(JSON.stringify(data));
}

export function resolveTripCreationTemplateSaveName({ newName, replaceName }) {
    const trimmedReplace =
        typeof replaceName === 'string' ? replaceName.trim() : '';
    if (trimmedReplace) {
        return trimmedReplace;
    }

    const trimmedNew = typeof newName === 'string' ? newName.trim() : '';
    return trimmedNew || null;
}

export function canSaveTripCreationTemplateName({ newName, replaceName }) {
    return resolveTripCreationTemplateSaveName({ newName, replaceName }) != null;
}

export async function saveTripCreationTemplate(userId, name, data) {
    if (userId == null || userId === '') {
        throw new Error('Trip creation template user is required');
    }

    assertSaveTripCreationTemplateInput(name, data);

    await tripCreationTemplateApi.store({
        name: name.trim(),
        data: serializeTripCreationTemplateData(data)
    });
}

export async function loadTripCreationTemplate(userId, name) {
    if (userId == null || userId === '' || typeof name !== 'string' || !name.trim()) {
        return null;
    }

    try {
        const response = await tripCreationTemplateApi.show(name.trim());
        const payload = response?.data;
        return payload?.data != null ? { ...payload.data } : null;
    } catch {
        return null;
    }
}

export async function listTripCreationTemplates(userId) {
    if (userId == null || userId === '') {
        return [];
    }

    try {
        const response = await tripCreationTemplateApi.index();
        const templates = response?.data;
        if (!Array.isArray(templates)) {
            return [];
        }

        return templates.map((template) => ({
            name: template.name,
            data: { ...template.data }
        }));
    } catch {
        return [];
    }
}

export async function hasTripCreationTemplates(userId) {
    const templates = await listTripCreationTemplates(userId);
    return templates.length > 0;
}

export function getDefaultTripCreationTime(now = dayjs()) {
    return now.add(1, 'hour').format('HH:00');
}

function resolveTemplateScheduleTime(templateData, defaultTime) {
    if (typeof templateData.time === 'string' && templateData.time.trim()) {
        return templateData.time.trim();
    }

    return defaultTime;
}

export function applyTripCreationTemplateToForm(form, templateData, options = {}) {
    if (!form || !templateData) {
        return false;
    }

    if (templateData.trip) {
        Object.assign(form.trip, templateData.trip);
    }
    if (Array.isArray(templateData.points)) {
        form.points = templateData.points.map((point) => ({
            ...point,
            error: { state: false, message: '' }
        }));
    }
    form.dateAnswer = 'dateAnswer' in templateData
        ? templateData.dateAnswer
        : form.dateAnswer;
    form.date = 'date' in templateData ? templateData.date : form.date;
    const defaultTime = getDefaultTripCreationTime(options.now ?? dayjs());
    if (options.useDefaultScheduleTime) {
        form.time = defaultTime;
        form.weeklyScheduleTime = defaultTime;
    } else {
        form.time = resolveTemplateScheduleTime(templateData, defaultTime);
        form.weeklyScheduleTime =
            templateData.weeklyScheduleTime || form.weeklyScheduleTime;
    }
    form.price = templateData.price || form.price;
    form.no_lucrar = templateData.no_lucrar || false;
    form.selectedCarId = templateData.selectedCarId;
    form.allowForeignPoints = templateData.allowForeignPoints || false;
    form.wantsIntermediateStops = templateData.wantsIntermediateStops || false;
    form.useWeeklySchedule = templateData.useWeeklySchedule || false;
    form.weeklySchedule = templateData.weeklySchedule || 0;

    return true;
}

export function getWizardNavigationAfterTemplateApply() {
    return {
        currentStep: STEP.SCHEDULE,
        maxVisitedStep: STEP.LAST_DETAILS
    };
}

export function buildTripCreationTemplateFromSnapshot(snapshot) {
    if (!snapshot) {
        return null;
    }

    const trip = snapshot.trip || {};

    return {
        trip: {
            is_passenger: trip.is_passenger,
            total_seats: trip.total_seats,
            description: trip.description,
            allow_kids: trip.allow_kids,
            allow_smoking: trip.allow_smoking,
            allow_animals: trip.allow_animals,
            rear_max_two_passengers: trip.rear_max_two_passengers,
            autoaccept_friends_requests: trip.autoaccept_friends_requests,
            friendship_type_id: trip.friendship_type_id
        },
        points: (snapshot.points || []).map((point) => ({
            name: point.name,
            place: point.place,
            json: point.json,
            location: point.location
                ? { lat: point.location.lat, lng: point.location.lng }
                : null,
            id: point.id
        })),
        date: '',
        dateAnswer: '',
        time: '',
        price: snapshot.price || '',
        no_lucrar: snapshot.no_lucrar ?? false,
        selectedCarId: snapshot.selectedCarId,
        allowForeignPoints: snapshot.allowForeignPoints || false,
        wantsIntermediateStops: snapshot.wantsIntermediateStops || false,
        useWeeklySchedule: snapshot.useWeeklySchedule || false,
        weeklySchedule: snapshot.weeklySchedule || 0,
        weeklyScheduleTime: snapshot.weeklyScheduleTime || '12:00'
    };
}
