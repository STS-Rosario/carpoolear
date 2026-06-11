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
