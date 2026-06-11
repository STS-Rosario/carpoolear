import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
    clearTripCreationDraft,
    clearTripCreationDraftForLogout,
    hasTripCreationDraft,
    loadTripCreationDraft,
    saveTripCreationDraft,
    TRIP_CREATION_DRAFT_STORAGE_KEY
} from './tripCreationDraft.js';

function createStorage() {
    const store = new Map();
    return {
        getItem: vi.fn((key) => store.get(key) ?? null),
        setItem: vi.fn((key, value) => {
            store.set(key, String(value));
        }),
        removeItem: vi.fn((key) => {
            store.delete(key);
        }),
        clear: vi.fn(() => {
            store.clear();
        })
    };
}

describe('tripCreationDraft', () => {
    let storage;

    beforeEach(() => {
        storage = createStorage();
        vi.stubGlobal('localStorage', storage);
    });

    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it('uses a stable storage key', () => {
        expect(TRIP_CREATION_DRAFT_STORAGE_KEY).toBe('TRIP_CREATION_DRAFT');
    });

    it('saves and loads a draft for one user', () => {
        const draft = {
            currentStep: 3,
            maxVisitedStep: 3,
            trip: { is_passenger: 0 },
            points: [{ name: 'A' }, { name: 'B' }],
            updatedAt: '2026-06-10T12:00:00.000Z'
        };

        saveTripCreationDraft(42, draft);
        expect(loadTripCreationDraft(42)).toEqual(draft);
    });

    it('keeps only one draft per user and isolates users', () => {
        saveTripCreationDraft(1, { currentStep: 2, maxVisitedStep: 2 });
        saveTripCreationDraft(2, { currentStep: 5, maxVisitedStep: 5 });

        expect(loadTripCreationDraft(1)).toEqual({
            currentStep: 2,
            maxVisitedStep: 2
        });
        expect(loadTripCreationDraft(2)).toEqual({
            currentStep: 5,
            maxVisitedStep: 5
        });
    });

    it('overwrites the existing draft for the same user', () => {
        saveTripCreationDraft(9, { currentStep: 1, maxVisitedStep: 1 });
        saveTripCreationDraft(9, { currentStep: 4, maxVisitedStep: 4 });

        expect(loadTripCreationDraft(9)).toEqual({
            currentStep: 4,
            maxVisitedStep: 4
        });
    });

    it('returns null when no draft exists', () => {
        expect(loadTripCreationDraft(99)).toBeNull();
    });

    it('returns null for invalid user id', () => {
        expect(loadTripCreationDraft(null)).toBeNull();
        expect(loadTripCreationDraft(undefined)).toBeNull();
    });

    it('handles corrupt storage gracefully', () => {
        storage.setItem(TRIP_CREATION_DRAFT_STORAGE_KEY, '{not-json');
        expect(loadTripCreationDraft(1)).toBeNull();
    });

    it('clears a user draft', () => {
        saveTripCreationDraft(3, { currentStep: 2, maxVisitedStep: 2 });
        clearTripCreationDraft(3);
        expect(loadTripCreationDraft(3)).toBeNull();
        expect(hasTripCreationDraft(3)).toBe(false);
    });

    it('clearTripCreationDraftForLogout clears the given user draft', () => {
        saveTripCreationDraft(7, { currentStep: 1, maxVisitedStep: 1 });
        clearTripCreationDraftForLogout(7);
        expect(hasTripCreationDraft(7)).toBe(false);
    });

    it('hasTripCreationDraft returns true when draft exists', () => {
        saveTripCreationDraft(5, { currentStep: 1, maxVisitedStep: 1 });
        expect(hasTripCreationDraft(5)).toBe(true);
    });
});
