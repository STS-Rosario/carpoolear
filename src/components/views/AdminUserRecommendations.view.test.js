import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const viewPath = path.resolve(__dirname, 'AdminUserRecommendations.vue');
const source = fs.readFileSync(viewPath, 'utf8');

describe('AdminUserRecommendations view', () => {
    it('lists references_data and saves via AdminApi.updateReference', () => {
        expect(source).toContain('AdminLayout');
        expect(source).toContain('references_data');
        expect(source).toContain('updateReference');
        expect(source).toContain('adminUsuariosGuardar');
    });
});
