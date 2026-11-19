import { describe, it, expect } from 'vitest';
import messages from './i18n.js';

const LOCALES = ['arg', 'chl', 'en'];

const CAR_FORM_KEYS = [
    'fuelInfoSubtitle',
    'fuelType',
    'fuelConsumption',
    'combustible',
    'consumo',
    'seleccionarCombustible',
    'seleccionarConsumo',
    'fuelTypeGnc',
    'fuelTypeDiesel',
    'fuelTypeDieselPremium',
    'fuelTypeNaftaSuper',
    'fuelTypeNaftaPremium',
    'fuelConsumptionLow',
    'fuelConsumptionMedium',
    'fuelConsumptionHigh',
    'fuelFormExplainer',
    'fuelConsumptionRateHint'
];

const FUEL_GATE_KEYS = ['fuelGateTitle'];

const EXPLAINER_ES =
    'Para hacer más justo el cálculo ahora tenés que decirnos qué tipo de combustible usa tu vehículo y qué consumo tiene. Elegir un consumo mayor al debido resultará en una suspensión.';

describe('fuel i18n', () => {
    describe.each(LOCALES)('%s car form keys', (locale) => {
        it.each(CAR_FORM_KEYS)('defines %s', (key) => {
            expect(typeof messages[locale][key]).toBe('string');
            expect(messages[locale][key].length).toBeGreaterThan(0);
        });
    });

    describe.each(LOCALES)('%s fuel gate keys', (locale) => {
        it.each(FUEL_GATE_KEYS)('defines %s', (key) => {
            expect(typeof messages[locale][key]).toBe('string');
            expect(messages[locale][key].length).toBeGreaterThan(0);
        });
    });

    it('uses the approved Spanish fuel gate title', () => {
        expect(messages.arg.fuelGateTitle).toBe(
            'Necesitamos unos datos más de tu vehículo'
        );
        expect(messages.chl.fuelGateTitle).toBe(
            'Necesitamos unos datos más de tu vehículo'
        );
        expect(messages.en.fuelGateTitle).not.toBe(messages.arg.fuelGateTitle);
    });

    it('uses the approved Spanish copy', () => {
        for (const locale of ['arg', 'chl']) {
            expect(messages[locale].fuelInfoSubtitle).toBe(
                'Información del combustible'
            );
            expect(messages[locale].fuelFormExplainer).toBe(EXPLAINER_ES);
            expect(messages[locale].fuelConsumptionRateHint).toContain(
                '{rate}'
            );
        }
    });

    it('mentions fuel in incomplete car messages', () => {
        expect(messages.arg.autosDatosIncompletos).toContain('combustible');
        expect(messages.chl.autosDatosIncompletos).toContain('combustible');
        expect(messages.en.autosDatosIncompletos).toContain('fuel');
        expect(messages.arg.autosCompletarPendientes).toContain('combustible');
        expect(messages.en.autosCompletarPendientes).toContain('fuel');
    });

    it('translates the english form copy', () => {
        expect(messages.en.fuelInfoSubtitle).not.toBe(
            messages.arg.fuelInfoSubtitle
        );
        expect(messages.en.fuelFormExplainer).not.toBe(EXPLAINER_ES);
        expect(messages.en.fuelConsumptionRateHint).toContain('{rate}');
    });
});
