import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const viewPath = path.resolve(__dirname, 'TripCarDetails.vue');
const viewSource = fs.readFileSync(viewPath, 'utf8');

describe('TripCarDetails', () => {
    it('renders auto heading and labeled car fields with i18n', () => {
        expect(viewSource).toContain("{{ $t('auto') }}");
        expect(viewSource).toContain("{{ $t(row.labelKey) }}:");
        expect(viewSource).toContain('carDetailRows');
        expect(viewSource).toContain('<strong>');
    });
});
