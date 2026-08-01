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
        expect(viewSource).toMatch(
            /\.change-password-page__card\s*\{[^}]*background:\s*(?:#fff|var\(--profile-card-bg)/s
        );
        expect(viewSource).toMatch(
            /\.change-password-page__card\s*\{[^}]*border-radius:\s*0\.75rem/s
        );
    });

    it('does not use the legacy update-profile form card or padding', () => {
        expect(viewSource).not.toContain('update-profile-component');
        expect(viewSource).toMatch(
            /\.change-password-component\s+\.form\s*\{[^}]*box-shadow:\s*none/s
        );
        expect(viewSource).toMatch(
            /\.change-password-component\s+\.form\s*\{[^}]*background:\s*transparent/s
        );
        expect(viewSource).toMatch(
            /\.change-password-component\s+\.form\s*\{[^}]*padding:\s*0/s
        );
    });

    it('uses AppInput password fields and a primary AppButton submit', () => {
        expect(viewSource).toContain("import AppInput from '../ui/AppInput.vue'");
        expect(viewSource).toContain("import AppButton from '../ui/AppButton.vue'");
        expect(viewSource).toMatch(
            /<AppInput[\s\S]*?password[\s\S]*?ingreseNuevaPassword[\s\S]*?\/>/
        );
        expect(viewSource).toMatch(
            /<AppInput[\s\S]*?password[\s\S]*?repetirContrasena[\s\S]*?\/>/
        );
        expect(viewSource).not.toContain('form-control');
        expect(viewSource).toMatch(
            /<AppButton[\s\S]*?type="submit"[\s\S]*?variant="primary"[\s\S]*?cambiarPassword[\s\S]*?<\/AppButton>/
        );
        expect(viewSource).not.toContain('btn-donar-header');
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
