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
