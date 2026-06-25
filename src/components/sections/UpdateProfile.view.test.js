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
