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

    it('renders formatted DNI and phone values for each user row', () => {
        expect(viewSource).toContain('{{ displayDniOrDash(u.nro_doc) }}');
        expect(viewSource).toContain('{{ displayOrDash(u.mobile_phone) }}');
        expect(viewSource).toContain('displayDniOrDash(value)');
        expect(viewSource).toContain('profile_id_format');
    });

    it('syncs search, page and sorting in route query for back navigation persistence', () => {
        expect(viewSource).toContain('syncRouteQuery');
        expect(viewSource).toContain('this.$router.replace');
        expect(viewSource).toContain('this.$route.query');
        expect(viewSource).toContain('query.page');
        expect(viewSource).toContain('query.sort');
        expect(viewSource).toContain('query.direction');
        expect(viewSource).toContain('query.name');
    });

    it('navigates to user profile from name link only, not row click', () => {
        expect(viewSource).toContain("<router-link :to=\"{ name: 'admin-users-user', params: { userId: String(u.id) } }\">");
        expect(viewSource).not.toContain('@click="goToUser(u.id)"');
    });
});
