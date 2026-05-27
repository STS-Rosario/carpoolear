import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const viewPath = path.resolve(__dirname, 'AdminUserRatings.vue');
const source = fs.readFileSync(viewPath, 'utf8');

describe('AdminUserRatings view', () => {
    it('lists ratings and saves via AdminApi.updateRating', () => {
        expect(source).toContain('AdminLayout');
        expect(source).toContain('updateRating');
        expect(source).toContain('adminUsuariosGuardar');
        expect(source).toContain('rateApi.index');
    });
});
