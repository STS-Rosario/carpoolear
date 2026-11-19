import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const formPath = path.resolve(__dirname, 'CarForm.vue');
const formSource = fs.readFileSync(formPath, 'utf8').replace(/\r\n/g, '\n');
const fuelFieldsPath = path.resolve(__dirname, 'CarFuelFields.vue');
const fuelFieldsSource = fs
    .readFileSync(fuelFieldsPath, 'utf8')
    .replace(/\r\n/g, '\n');

describe('CarForm DS inputs', () => {
    it('supports disabling the patente field for complete-car modal', () => {
        expect(formSource).toContain('patenteDisabled');
        expect(formSource).toMatch(
            /<AppInput[\s\S]*?patente[\s\S]*?:disabled="patenteDisabled"/
        );
    });
});

describe('CarForm fuel section', () => {
    it('renders the shared fuel fields inside the car form', () => {
        expect(formSource).toContain("import CarFuelFields from './CarFuelFields.vue'");
        expect(formSource).toMatch(/<CarFuelFields[\s\S]*?:entry="entry"/);
    });

    it('shows the fuel subtitle and explainer', () => {
        expect(fuelFieldsSource).toContain("$t('fuelInfoSubtitle')");
        expect(fuelFieldsSource).toContain("$t('fuelFormExplainer')");
    });

    it('offers required fuel type and consumption selects', () => {
        expect(fuelFieldsSource).toContain('v-model="entry.fuel_type"');
        expect(fuelFieldsSource).toContain('v-model="entry.fuel_consumption"');
        expect(fuelFieldsSource).toContain("$t('fuelType')");
        expect(fuelFieldsSource).toContain("$t('fuelConsumption')");
        expect(fuelFieldsSource).toContain('v-for="type in fuelTypes"');
        expect(fuelFieldsSource).toContain('v-for="level in consumptionLevels"');
        expect(fuelFieldsSource).toContain('fuelTypeI18nKey');
        expect(fuelFieldsSource).toContain('fuelConsumptionI18nKey');
    });

    it('shows the resolved rate and unit for the selection', () => {
        expect(fuelFieldsSource).toContain('fuelConsumptionRateLabel');
        expect(fuelFieldsSource).toContain("$t('fuelConsumptionRateHint'");
        expect(fuelFieldsSource).toContain('rateLabel');
    });

    it('lets the fuel-only modal hide the subtitle and explainer', () => {
        expect(fuelFieldsSource).toContain('showSubtitle');
        expect(fuelFieldsSource).toContain('showExplainer');
    });
});
