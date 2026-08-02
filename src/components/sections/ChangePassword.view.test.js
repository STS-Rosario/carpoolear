import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const viewPath = path.resolve(__dirname, 'ChangePassword.vue');
const routesPath = path.resolve(__dirname, '../../router/routes.js');
const viewSource = fs.readFileSync(viewPath, 'utf8');
const routesSource = fs.readFileSync(routesPath, 'utf8');
const updateProfileSource = fs.readFileSync(
    path.resolve(__dirname, 'UpdateProfile.vue'),
    'utf8'
);

describe('ChangePassword', () => {
    it('updates the password through the auth store', () => {
        expect(viewSource).toContain('useAuthStore');
        expect(viewSource).toContain('password_confirmation');
        expect(viewSource).toContain('this.update(bodyFormData)');
        expect(viewSource).toContain('passwordActualizadaCorrectamente');
    });

    it('blocks password changes while impersonating', () => {
        expect(viewSource).toContain('isImpersonating');
        expect(viewSource).toContain('impersonationActionForbidden');
    });
});

describe('ChangePassword page card', () => {
    it('wraps content in a white card with the page title inside', () => {
        expect(viewSource).toContain('change-password-page__card');
        expect(viewSource).toContain('change-password-page__heading');
        expect(viewSource).toMatch(
            /change-password-page__card[\s\S]*change-password-page__heading[\s\S]*\$t\('cambiarPassword'\)/
        );
    });

});

describe('change password route', () => {
    it('registers a dedicated settings child route', () => {
        expect(routesSource).toContain("name: 'profile_password'");
        expect(routesSource).toContain("path: 'password'");
        expect(routesSource).toContain('ChangePassword');
    });
});

describe('UpdateProfile password removal', () => {
    it('no longer renders the password change checkbox or fields', () => {
        expect(updateProfileSource).not.toContain('changeShowPassword');
        expect(updateProfileSource).not.toContain('showChangePassword');
        expect(updateProfileSource).not.toContain("{{ $t('cambiarPassword') }}");
        expect(updateProfileSource).not.toContain('this.pass.password');
    });
});
