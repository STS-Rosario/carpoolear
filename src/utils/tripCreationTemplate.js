import { STEP } from './tripCreationSteps.js';
import tripCreationTemplateApi from '../services/api/TripCreationTemplate.js';

export async function saveTripCreationTemplate(userId, name, data) {
    if (userId == null || userId === '' || typeof name !== 'string' || !name.trim() || !data) {
        return;
    }

    await tripCreationTemplateApi.store({
        name: name.trim(),
        data
    });
}

export async function loadTripCreationTemplate(userId, name) {
    if (userId == null || userId === '' || typeof name !== 'string' || !name.trim()) {
        return null;
    }

    try {
        const response = await tripCreationTemplateApi.show(name.trim());
        const payload = response?.data?.data;
        return payload?.data ? { ...payload.data } : null;
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
        const templates = response?.data?.data;
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

export function applyTripCreationTemplateToForm(form, templateData) {
    if (!form || !templateData) {
        return false;
    }

    if (templateData.trip) {
        Object.assign(form.trip, templateData.trip);
    }
    if (templateData.points) {
        form.points = templateData.points.map((point) => ({
            ...point,
            error: { state: false, message: '' }
        }));
    }
    form.dateAnswer = 'dateAnswer' in templateData
        ? templateData.dateAnswer
        : form.dateAnswer;
    form.date = 'date' in templateData ? templateData.date : form.date;
    form.time = 'time' in templateData ? templateData.time : form.time;
    form.price = templateData.price || form.price;
    form.no_lucrar = templateData.no_lucrar || false;
    form.selectedCarId = templateData.selectedCarId;
    form.allowForeignPoints = templateData.allowForeignPoints || false;
    form.wantsIntermediateStops = templateData.wantsIntermediateStops || false;
    form.useWeeklySchedule = templateData.useWeeklySchedule || false;
    form.weeklySchedule = templateData.weeklySchedule || 0;
    form.weeklyScheduleTime = templateData.weeklyScheduleTime || form.weeklyScheduleTime;

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

    return {
        trip: { ...snapshot.trip },
        points: (snapshot.points || []).map((point) => ({
            name: point.name,
            place: point.place,
            json: point.json,
            location: point.location,
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
