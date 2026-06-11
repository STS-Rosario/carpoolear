import { STEP } from './tripCreationSteps.js';

export const TRIP_CREATION_TEMPLATES_STORAGE_KEY = 'TRIP_CREATION_TEMPLATES';

function readStore() {
    if (typeof localStorage === 'undefined') {
        return {};
    }

    const raw = localStorage.getItem(TRIP_CREATION_TEMPLATES_STORAGE_KEY);
    if (!raw) {
        return {};
    }

    try {
        const parsed = JSON.parse(raw);
        return parsed && typeof parsed === 'object' ? parsed : {};
    } catch {
        return {};
    }
}

function writeStore(store) {
    if (typeof localStorage === 'undefined') {
        return;
    }

    const keys = Object.keys(store);
    if (keys.length === 0) {
        localStorage.removeItem(TRIP_CREATION_TEMPLATES_STORAGE_KEY);
        return;
    }

    localStorage.setItem(TRIP_CREATION_TEMPLATES_STORAGE_KEY, JSON.stringify(store));
}

function normalizeUserId(userId) {
    if (userId == null || userId === '') {
        return null;
    }

    return String(userId);
}

function normalizeTemplateName(name) {
    if (typeof name !== 'string') {
        return '';
    }

    return name.trim();
}

function getUserTemplates(store, userId) {
    const templates = store[userId];
    return templates && typeof templates === 'object' ? templates : {};
}

export function saveTripCreationTemplate(userId, name, data) {
    const id = normalizeUserId(userId);
    const templateName = normalizeTemplateName(name);
    if (!id || !templateName || !data) {
        return;
    }

    const store = readStore();
    const userTemplates = getUserTemplates(store, id);
    userTemplates[templateName] = { ...data };
    store[id] = userTemplates;
    writeStore(store);
}

export function loadTripCreationTemplate(userId, name) {
    const id = normalizeUserId(userId);
    const templateName = normalizeTemplateName(name);
    if (!id || !templateName) {
        return null;
    }

    const store = readStore();
    const userTemplates = getUserTemplates(store, id);
    const template = userTemplates[templateName];
    return template ? { ...template } : null;
}

export function listTripCreationTemplates(userId) {
    const id = normalizeUserId(userId);
    if (!id) {
        return [];
    }

    const store = readStore();
    const userTemplates = getUserTemplates(store, id);

    return Object.keys(userTemplates).map((templateName) => ({
        name: templateName,
        data: { ...userTemplates[templateName] }
    }));
}

export function hasTripCreationTemplates(userId) {
    return listTripCreationTemplates(userId).length > 0;
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
