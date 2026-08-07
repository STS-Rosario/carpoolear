import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const apiSource = fs.readFileSync(path.resolve(__dirname, 'TripCreationTemplate.js'), 'utf8');

describe('TripCreationTemplateApi', () => {
    it('targets trip creation template endpoints', () => {
        expect(apiSource).toContain("this.get('/api/trip-creation-templates')");
        expect(apiSource).toContain("this.post('/api/trip-creation-templates', data)");
        expect(apiSource).toContain('encodeURIComponent(name)');
    });
});
