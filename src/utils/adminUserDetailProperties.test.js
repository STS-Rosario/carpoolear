import { describe, it, expect } from 'vitest';
import {
    getAdminUserBannedBanner,
    buildAdminUserPropertyRows
} from './adminUserDetailProperties';

const translate = (key) =>
    ({
        usuarioSuspendido: 'Usuario suspendido',
        usuarioActivo: 'Usuario activo',
        eMail: 'Email',
        doc: 'DNI',
        ultimaConexion: 'Última conexión'
    }[key] || key);

describe('getAdminUserBannedBanner', () => {
    it('returns danger styling when user is banned', () => {
        expect(getAdminUserBannedBanner({ banned: 1 }, translate)).toEqual({
            label: 'Usuario suspendido',
            modifier: 'danger'
        });
    });

    it('returns success styling when user is not banned', () => {
        expect(getAdminUserBannedBanner({ banned: 0 }, translate)).toEqual({
            label: 'Usuario activo',
            modifier: 'success'
        });
    });
});

describe('buildAdminUserPropertyRows', () => {
    const sampleUser = {
        id: 42,
        name: 'Jane Doe',
        email: 'jane@example.test',
        nro_doc: '30123456',
        banned: 0,
        active: 1,
        is_admin: 0,
        mobile_phone: '+5491112345678',
        last_connection: '2025-06-01 12:00:00',
        identity_validated: true,
        has_pin: 1,
        references: 3,
        support_tickets_count: 2,
        admin_trips_count: 5,
        admin_ratings_count: 1,
        cars: [{ patente: 'ABC123', description: 'Fiat' }],
        driver_data_docs: { license: 'ok' }
    };

    it('returns ordered rows with labels and formatted values', () => {
        const rows = buildAdminUserPropertyRows(sampleUser, { translate });

        expect(rows.length).toBeGreaterThan(10);
        expect(rows[0]).toEqual({ key: 'id', label: 'ID', value: '42' });
        expect(rows.find((row) => row.key === 'email')).toEqual({
            key: 'email',
            label: 'Email',
            value: 'jane@example.test'
        });
        expect(rows.find((row) => row.key === 'banned')).toEqual({
            key: 'banned',
            label: 'Usuario suspendido',
            value: 'No'
        });
        expect(rows.find((row) => row.key === 'has_pin')).toEqual({
            key: 'has_pin',
            label: 'has_pin',
            value: 'Sí'
        });
        expect(rows.find((row) => row.key === 'identity_validated')).toEqual({
            key: 'identity_validated',
            label: 'identity_validated',
            value: 'Sí'
        });
        expect(rows.find((row) => row.key === 'cars')).toEqual({
            key: 'cars',
            label: 'cars',
            value: '[{"patente":"ABC123","description":"Fiat"}]'
        });
    });

    it('formats empty values as em dash', () => {
        const rows = buildAdminUserPropertyRows(
            { id: 1, name: 'Test', description: null, mobile_phone: '' },
            { translate }
        );

        expect(rows.find((row) => row.key === 'description').value).toBe('—');
        expect(rows.find((row) => row.key === 'mobile_phone').value).toBe('—');
    });

    it('places banned before other properties in row order', () => {
        const rows = buildAdminUserPropertyRows(sampleUser, { translate });
        const bannedIndex = rows.findIndex((row) => row.key === 'banned');
        const emailIndex = rows.findIndex((row) => row.key === 'email');

        expect(bannedIndex).toBeGreaterThanOrEqual(0);
        expect(bannedIndex).toBeLessThan(emailIndex);
    });

    it('hides facebook profile url when module flag is disabled', () => {
        const rows = buildAdminUserPropertyRows(
            { ...sampleUser, facebook_profile_url: 'https://facebook.com/jane' },
            { translate, showFacebookProfileUrl: false }
        );

        expect(rows.find((row) => row.key === 'facebook_profile_url')).toBeUndefined();
    });
});
