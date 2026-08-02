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

describe('UpdateProfile page card', () => {
    it('wraps content in a white card with the page title inside', () => {
        expect(viewSource).toContain('update-profile-page__card');
        expect(viewSource).toContain('update-profile-page__heading');
        expect(viewSource).toMatch(
            /update-profile-page__card[\s\S]*update-profile-page__heading[\s\S]*\$t\('editarPerfil'\)/
        );
        expect(viewSource).toMatch(
            /\.update-profile-page__card\s*\{[^}]*background:\s*(?:#fff|var\(--profile-card-bg)/s
        );
        expect(viewSource).toMatch(
            /\.update-profile-page__card\s*\{[^}]*border-radius:\s*0\.75rem/s
        );
    });

    it('removes the legacy inner form card styling', () => {
        expect(viewSource).toMatch(
            /\.update-profile-component\s+\.form\s*\{[^}]*box-shadow:\s*none/s
        );
        expect(viewSource).toMatch(
            /\.update-profile-component\s+\.form\s*\{[^}]*background:\s*transparent/s
        );
        expect(viewSource).toMatch(
            /\.update-profile-component\s+\.form\s*\{[^}]*padding:\s*0/s
        );
    });

    it('clears the fixed mobile footer so Guardar cambios stays reachable', () => {
        expect(viewSource).toMatch(
            /@media[^{]*max-width:\s*768px[^{]*\{[\s\S]*\.update-profile-component\s*\{[^}]*padding-bottom:\s*calc\(5\.5rem\s*\+\s*env\(safe-area-inset-bottom/s
        );
    });
});

describe('UpdateProfile AppInput fields', () => {
    it('uses AppInput for core profile text fields', () => {
        expect(viewSource).toContain("import AppInput from '../ui/AppInput.vue'");
        expect(viewSource).toMatch(/<AppInput[\s\S]*?id="input-name"/);
        expect(viewSource).toMatch(/<AppInput[\s\S]*?id="input-email"/);
        expect(viewSource).toMatch(/<AppInput[\s\S]*?id="input-dni"/);
        expect(viewSource).toMatch(/<AppInput[\s\S]*?id="input-telefono"/);
        expect(viewSource).not.toMatch(
            /<input[\s\S]*?id="input-name"[\s\S]*?class="form-control"/
        );
        expect(viewSource).not.toMatch(
            /<input[\s\S]*?id="input-email"[\s\S]*?class="form-control"/
        );
    });

    it('uses AppTextarea for the description field', () => {
        expect(viewSource).toContain(
            "import AppTextarea from '../ui/AppTextarea.vue'"
        );
        expect(viewSource).toMatch(/<AppTextarea[\s\S]*?id="input-description"/);
        expect(viewSource).not.toMatch(/<textarea[\s\S]*?v-model="user\.description"/);
    });

    it('uses AppField for account type and bank selects', () => {
        expect(viewSource).toContain(
            "import AppField from '../ui/AppField.vue'"
        );
        expect(viewSource).toMatch(
            /<AppField[\s\S]*?tipoDeCuenta[\s\S]*?id="tipoDeCuenta"[\s\S]*?v-model="user\.account_type"/
        );
        expect(viewSource).toMatch(
            /<AppField[\s\S]*?bancoDeCuenta[\s\S]*?id="bancoDeCuenta"[\s\S]*?v-model="user\.account_bank"/
        );
        expect(viewSource).toContain('update-profile__select');
        expect(viewSource).not.toMatch(
            /id="tipoDeCuenta"[\s\S]*?class="form-control"/
        );
        expect(viewSource).not.toMatch(
            /id="bancoDeCuenta"[\s\S]*?class="form-control"/
        );
        expect(viewSource).toMatch(
            /\.update-profile__select\s*\{[^}]*border:\s*0/
        );
    });

    it('offsets the datos públicos checkbox 5px to the right', () => {
        expect(viewSource).toContain('update-profile-datos-publicos');
        expect(viewSource).toContain("$t('datosVisiblesCheck')");
        expect(viewSource).toMatch(
            /\.update-profile-datos-publicos[\s\S]*?margin-left:\s*5px/
        );
    });
});

describe('UpdateProfile delete account entry point', () => {
    it('opens the delete modal from the route query instead of an inline button', () => {
        expect(viewSource).toContain('DELETE_ACCOUNT_QUERY');
        expect(viewSource).toContain('openDeleteAccountModalFromRoute');
        expect(viewSource).toContain("query.action'(action)");
        expect(viewSource).not.toContain('delete-account-container');
    });

    it('requires a second confirmation step before deleting the account', () => {
        expect(viewSource).toContain('showDeleteAccountConfirmation');
        expect(viewSource).toContain('promptDeleteAccountConfirmation');
        expect(viewSource).toContain('cancelDeleteAccountConfirmation');
        expect(viewSource).toContain('confirmarEliminarCuentaMensaje');
        expect(viewSource).toMatch(
            /promptDeleteAccountConfirmation[\s\S]*confirmarEliminarCuentaMensaje[\s\S]*@click="deleteAccount"/
        );
    });

    it('uses primary mesa de ayuda and danger Eliminar cuenta AppButtons in the delete modal', () => {
        const firstStep = viewSource.match(
            /eliminacionCuentaRecuperarCuenta[\s\S]*?eliminacionCuentaOtroMotivo[\s\S]*?<\/template>/
        );
        expect(firstStep).not.toBeNull();
        const stepHtml = firstStep[0];
        expect(stepHtml).toMatch(
            /<AppButton[\s\S]*?variant="primary"[\s\S]*?openMesaAyudaFromDelete[\s\S]*?contactarMesaAyuda/
        );
        expect(stepHtml).toMatch(
            /<AppButton[\s\S]*?variant="danger"[\s\S]*?promptDeleteAccountConfirmation[\s\S]*?eliminarCuenta/
        );
        expect(stepHtml).not.toContain('btn btn-default');
        expect(stepHtml).not.toContain('btn btn-danger');
    });
});
