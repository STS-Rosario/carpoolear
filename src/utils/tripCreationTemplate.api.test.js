import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const utilPath = path.resolve(__dirname, 'tripCreationTemplate.js');
const utilSource = fs.readFileSync(utilPath, 'utf8');

describe('tripCreationTemplate API integration', () => {
    it('loads templates from backend API helpers', () => {
        expect(utilSource).toContain("from '../services/api/TripCreationTemplate.js'");
        expect(utilSource).toContain('tripCreationTemplateApi.index()');
        expect(utilSource).toContain('tripCreationTemplateApi.store(');
        expect(utilSource).toContain('tripCreationTemplateApi.show(');
        expect(utilSource).not.toContain('localStorage');
        expect(utilSource).not.toContain('TRIP_CREATION_TEMPLATES_STORAGE_KEY');
    });
});
