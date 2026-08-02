import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const viewPath = path.resolve(__dirname, 'AdminMpRejectedValidations.vue');
const viewSource = fs.readFileSync(viewPath, 'utf8');

describe('AdminMpRejectedValidations view', () => {
    it('renders admin pagination bar with per-page selector', () => {
        expect(viewSource).toContain('AdminPaginationBar');
        expect(viewSource).toContain('getMercadoPagoRejectedValidations');
    });

    it('links user profile action to the admin user profile route', () => {
        expect(viewSource).toContain('getAdminUserProfileRoute');
        expect(viewSource).not.toContain("name: 'profile'");
    });

    it('uses primary AppButton for ver detalle action', () => {
        expect(viewSource).toContain("import AppButton from '../ui/AppButton.vue'");
        expect(viewSource).toMatch(
            /<AppButton[\s\S]*?variant="primary"[\s\S]*?admin-mp-rejected-validation-detail[\s\S]*?verDetalle/
        );
        expect(viewSource).not.toContain('btn-primary-blue');
    });
});
