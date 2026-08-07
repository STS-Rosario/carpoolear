import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const componentPath = path.resolve(__dirname, 'AppInfoCard.vue');
const source = fs.readFileSync(componentPath, 'utf8');

describe('AppInfoCard', () => {
    it('supports text, action label, and action emit', () => {
        expect(source).toContain('app-info-card');
        expect(source).toContain('actionLabel');
        expect(source).toContain("$emit('action')");
        expect(source).toContain('app-info-card__action');
        expect(source).toContain('info-circle.png');
        expect(source).toContain('iconMaskStyle');
        expect(source).toContain('app-info-card__icon-image');
    });
});
