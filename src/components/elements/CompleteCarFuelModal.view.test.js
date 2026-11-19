import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const modalPath = path.resolve(__dirname, 'CompleteCarFuelModal.vue');
const source = fs.readFileSync(modalPath, 'utf8').replace(/\r\n/g, '\n');

describe('CompleteCarFuelModal', () => {
    it('shows the fuel gate title and explainer paragraph', () => {
        expect(source).toContain("$t('fuelGateTitle')");
        expect(source).toContain("$t('fuelFormExplainer')");
    });

    it('renders only the fuel fields without duplicating subtitle or explainer', () => {
        expect(source).toContain('CarFuelFields');
        expect(source).toMatch(
            /<CarFuelFields[\s\S]*?:entry="form"[\s\S]*?:show-subtitle="false"[\s\S]*?:show-explainer="false"/
        );
        expect(source).not.toContain('<CarForm');
    });

    it('requires a complete fuel profile before saving via the cars store', () => {
        expect(source).toContain('hasCarFuelProfile');
        expect(source).toContain('carFormMissingFieldKeys');
        expect(source).toContain('useCarsStore');
        expect(source).toMatch(/carsStore\.update\(/);
        expect(source).toContain("this.$emit('saved')");
    });

    it('supports visible, car props and close/saved events', () => {
        expect(source).toContain('visible');
        expect(source).toContain('car:');
        expect(source).toContain("emits: ['close', 'saved']");
        expect(source).toContain('buildCarFormFromCar');
    });
});
