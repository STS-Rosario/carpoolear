export const TRIP_CREATION_DRAFT_STORAGE_KEY = 'TRIP_CREATION_DRAFT';

function readStore() {
    if (typeof localStorage === 'undefined') {
        return {};
    }

    const raw = localStorage.getItem(TRIP_CREATION_DRAFT_STORAGE_KEY);
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
        localStorage.removeItem(TRIP_CREATION_DRAFT_STORAGE_KEY);
        return;
    }

    localStorage.setItem(TRIP_CREATION_DRAFT_STORAGE_KEY, JSON.stringify(store));
}

function normalizeUserId(userId) {
    if (userId == null || userId === '') {
        return null;
    }

    return String(userId);
}

export function saveTripCreationDraft(userId, draft) {
    const id = normalizeUserId(userId);
    if (!id || !draft) {
        return;
    }

    const store = readStore();
    store[id] = draft;
    writeStore(store);
}

export function loadTripCreationDraft(userId) {
    const id = normalizeUserId(userId);
    if (!id) {
        return null;
    }

    const store = readStore();
    const draft = store[id];
    return draft ? { ...draft } : null;
}

export function clearTripCreationDraft(userId) {
    const id = normalizeUserId(userId);
    if (!id) {
        return;
    }

    const store = readStore();
    if (!store[id]) {
        return;
    }

    delete store[id];
    writeStore(store);
}

export function hasTripCreationDraft(userId) {
    return loadTripCreationDraft(userId) != null;
}

export function clearTripCreationDraftForLogout(userId) {
    clearTripCreationDraft(userId);
}
