import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const viewPath = path.resolve(__dirname, 'AdminUsersList.vue');
const viewSource = fs.readFileSync(viewPath, 'utf8');

describe('AdminUsersList view', () => {
    it('shows DNI and phone columns in admin users table', () => {
        expect(viewSource).toContain("{{ $t('numeroDeDocumento') }}");
        expect(viewSource).toContain("{{ $t('numeroDeTelefono') }}");
    });

    it('renders DNI and phone values for each user row', () => {
        expect(viewSource).toContain("{{ u.nro_doc || '—' }}");
        expect(viewSource).toContain("{{ u.mobile_phone || '—' }}");
    });
});
