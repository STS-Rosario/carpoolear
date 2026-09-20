import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
    dismissIdentityPromptPermanently,
    identityPromptDismissStorageKey,
    isIdentityPromptDismissed,
    isIdentityValidationCountdownScenario,
    isIdentityValidationPromptScenario,
    isIdentityValidationUiEnabled
} from './identityValidationPrompt.js';

function makeConfig(overrides = {}) {
    return {
        identity_validation_enabled: true,
        identity_validation_mercado_pago_enabled: false,
        identity_validation_manual_enabled: false,
        identity_validation_days_for_current_users: 30,
        identity_validation_optional: false,
        ...overrides
    };
}

function makeUser(overrides = {}) {
    return {
        identity_validated: false,
        validate_by_date: '2026-01-01',
        identity_validation_required_for_user: false,
        ...overrides
    };
}

const fakeStorage = () => {
    const values = new Map();
    return {
        getItem: (key) => (values.has(key) ? values.get(key) : null),
        setItem: (key, value) => values.set(key, String(value))
    };
};

describe('isIdentityValidationUiEnabled', () => {
    it('is disabled without config or sub-providers', () => {
        expect(isIdentityValidationUiEnabled(null)).toBe(false);
        expect(isIdentityValidationUiEnabled({})).toBe(false);
        expect(isIdentityValidationUiEnabled(makeConfig())).toBe(false);
    });

    it('is enabled when any provider is on and the feature flag is set', () => {
        expect(isIdentityValidationUiEnabled(makeConfig({ identity_validation_mercado_pago_enabled: true }))).toBe(true);
        expect(isIdentityValidationUiEnabled(makeConfig({ identity_validation_manual_enabled: true }))).toBe(true);
    });
});

describe('isIdentityValidationCountdownScenario', () => {
    it('is false for anonymous users or missing UI config', () => {
        expect(isIdentityValidationCountdownScenario(null, makeConfig())).toBe(false);
        expect(isIdentityValidationCountdownScenario(makeUser(), {})).toBe(false);
    });

    it('is false without enabled days, for validated users, or without a deadline', () => {
        expect(
            isIdentityValidationCountdownScenario(makeUser(), makeConfig({ identity_validation_days_for_current_users: 0 }))
        ).toBe(false);
        expect(
            isIdentityValidationCountdownScenario(makeUser({ identity_validated: true }), makeConfig())
        ).toBe(false);
        expect(
            isIdentityValidationCountdownScenario(makeUser({ validate_by_date: null }), makeConfig())
        ).toBe(false);
    });

    it('is true within the countdown window', () => {
        const config = makeConfig({ identity_validation_manual_enabled: true });
        expect(isIdentityValidationCountdownScenario(makeUser(), config)).toBe(true);
    });
});

describe('isIdentityValidationPromptScenario', () => {
    it('is false when the UI is disabled', () => {
        expect(isIdentityValidationPromptScenario(makeUser(), {})).toBe(false);
    });

    it('is false for validated users', () => {
        expect(isIdentityValidationPromptScenario(makeUser({ identity_validated: true }), makeConfig())).toBe(false);
    });

    it('shows for optional campaigns even without a deadline', () => {
        const config = makeConfig({
            identity_validation_optional: true,
            identity_validation_manual_enabled: true
        });
        expect(isIdentityValidationPromptScenario(makeUser({ validate_by_date: null }), config)).toBe(true);
    });

    it('shows when the user is required to validate', () => {
        const config = makeConfig({
            identity_validation_manual_enabled: true,
            identity_validation_days_for_current_users: 0
        });
        expect(
            isIdentityValidationPromptScenario(makeUser({ identity_validation_required_for_user: true }), config)
        ).toBe(true);
    });

    it('falls back to the countdown scenario', () => {
        const config = makeConfig({ identity_validation_manual_enabled: true });
        expect(isIdentityValidationPromptScenario(makeUser(), config)).toBe(true);
        expect(isIdentityValidationPromptScenario(makeUser({ validate_by_date: null }), config)).toBe(false);
    });
});

describe('identity prompt dismissal storage', () => {
    let storage;

    beforeEach(() => {
        storage = fakeStorage();
        vi.stubGlobal('localStorage', storage);
    });

    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it('builds a per-user storage key', () => {
        expect(identityPromptDismissStorageKey(42)).toBe('carpoolear_identity_validation_prompt_dismissed_42');
    });

    it('dismisses and detects dismissal per user id', () => {
        expect(isIdentityPromptDismissed(42)).toBe(false);
        dismissIdentityPromptPermanently(42);
        expect(isIdentityPromptDismissed(42)).toBe(true);
        expect(isIdentityPromptDismissed(7)).toBe(false);
    });

    it('ignores missing user ids', () => {
        dismissIdentityPromptPermanently(null);
        expect(isIdentityPromptDismissed(null)).toBe(false);
    });
});
