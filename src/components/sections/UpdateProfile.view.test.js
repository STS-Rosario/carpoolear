import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const viewPath = path.resolve(__dirname, 'UpdateProfile.vue');
const viewSource = fs.readFileSync(viewPath, 'utf8');

describe('UpdateProfile missing patente routing', () => {
    it('redirects missing patente guidance to the Autos settings section', () => {
        expect(viewSource).toContain("name: 'profile_cars'");
        expect(viewSource).toContain("$t('autosGestionarEnConfiguracion')");
        expect(viewSource).not.toContain('user-cars-block');
    });
});

describe('UpdateProfile save error feedback', () => {
    it('shows backend validation errors in an alert and snackbar', () => {
        expect(viewSource).toContain('getApiErrorMessage');
        expect(viewSource).toContain('profile-save-error');
        expect(viewSource).toContain('fa-exclamation-triangle');
        expect(viewSource).toContain("dialogs.message(message, {\n                        duration: 10,\n                        estado: 'error'\n                    })");
    });
});

describe('UpdateProfile draft isolation', () => {
    it('keeps form edits in a local clone instead of mutating the auth store', () => {
        expect(viewSource).toContain('cloneProfileUser');
        expect(viewSource).not.toMatch(/this\.user\s*=\s*this\.userData;/);
    });
});

describe('UpdateProfile name editing', () => {
    it('locks the name field when identity is validated', () => {
        expect(viewSource).toContain('isNameLockedByValidation');
        expect(viewSource).toContain(':disabled="isNameLockedByValidation"');
        expect(viewSource).toContain('identity_validated');
        expect(viewSource).toContain('identity_validated_at');
    });

    it('includes name in the profile save payload when identity is not validated', () => {
        expect(viewSource).toContain('isNameLockedByValidation');
        expect(viewSource).toContain("data['name'] = this.user.name");
    });

    it('shows support contact hint when name is locked', () => {
        expect(viewSource).toContain('nameInputTitle');
        expect(viewSource).toContain('nombreValidadoContacteSoporte');
    });
});

describe('UpdateProfile impersonation guardrails', () => {
    it('no longer includes password change UI in the profile editor', () => {
        expect(viewSource).not.toContain('changeShowPassword');
        expect(viewSource).not.toContain('showChangePassword');
        expect(viewSource).not.toContain("{{ $t('cambiarPassword') }}");
        expect(viewSource).not.toContain('this.pass.password');
    });
});

describe('UpdateProfile email notifications setting', () => {
    it('keeps the setting in code but hides it behind an explicit flag', () => {
        expect(viewSource).toContain("$t('notificacionesPorCorreo')");
        expect(viewSource).toContain('showProfileEmailNotificationsSetting');
        expect(viewSource).toContain('v-if="showProfileEmailNotificationsSetting"');
    });
});

describe('UpdateProfile desktop identity layout', () => {
    it('places avatar beside the top info alert and identity fields', () => {
        expect(viewSource).toContain('profile-top-row');
        expect(viewSource).toContain('profile-top-content');
        expect(viewSource).toContain('profile-top-alert');
        expect(viewSource).toContain('profile-identity-fields');
        expect(viewSource).toContain('profile_image-inline');
        expect(viewSource).not.toContain('col-sm-push-16');
    });
});

describe('UpdateProfile delete account entry point', () => {
    it('opens the delete modal from the route query instead of an inline button', () => {
        expect(viewSource).toContain('DELETE_ACCOUNT_QUERY');
        expect(viewSource).toContain('openDeleteAccountModalFromRoute');
        expect(viewSource).toContain("query.action'(action)");
        expect(viewSource).not.toContain('delete-account-container');
    });
});
