import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const viewPath = path.resolve(__dirname, 'UpdateProfile.vue');
const viewSource = fs.readFileSync(viewPath, 'utf8');

describe('UpdateProfile missing field routing', () => {
    it('exposes the patente input as a scroll target', () => {
        expect(viewSource).toContain('for="input-patente-0"');
        expect(viewSource).toContain(":id=\"'input-patente-' + index\"");
        expect(viewSource).toContain('ref="patenteBlock"');
        expect(viewSource).toContain("getElementById('input-patente-0')");
    });

    it('scrolls to patente when route query requests the missing patente field', () => {
        expect(viewSource).toContain("this.$route.query.missing !== 'patente'");
        expect(viewSource).toContain('getPatenteScrollTarget');
        expect(viewSource).toContain('scrollToMissingRouteField');
        expect(viewSource).toContain("'$route.query.missing'");
        expect(viewSource).toContain(
            'this.$scrollToElement(target, -270)'
        );
    });

    it('highlights the patente field when route query requests it', () => {
        expect(viewSource).toContain('missing-field-highlight');
        expect(viewSource).toContain('shouldHighlightPatente');
        expect(viewSource).toContain("this.$route.query.missing === 'patente'");
    });
});

describe('UpdateProfile multiple patentes', () => {
    it('supports adding another car from the profile form', () => {
        expect(viewSource).toContain('agregarOtroAuto');
        expect(viewSource).toContain('addUserCar');
        expect(viewSource).toContain('removeUserCar');
        expect(viewSource).toContain('class="form-group user-cars-block"');
        expect(viewSource).toContain('v-for="(entry, index) in userCars"');
        expect(viewSource).toContain('saveUserCars');
    });
});

describe('UpdateProfile remove saved car', () => {
    it('shows remove icon for any saved car row including a single patente', () => {
        expect(viewSource).toContain('canShowRemoveCarRow(');
        expect(viewSource).toContain('userCars.length');
        expect(viewSource).toContain('fa fa-times');
    });

    it('asks for confirmation before deleting a saved car', () => {
        expect(viewSource).toContain('confirmarEliminarAuto');
        expect(viewSource).toContain(
            "window.confirm(this.$t('confirmarEliminarAuto'))"
        );
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

describe('UpdateProfile car catalog fields', () => {
    it('uses searchable comboboxes for marca and modelo and a plain color select', () => {
        expect(viewSource).toContain('CatalogCombobox');
        expect(viewSource).toContain("$t('marcaOtro')");
        expect(viewSource).toContain("$t('modeloOtro')");
        expect(viewSource).toContain('v-model="entry.car_color_id"');
        expect(viewSource).toContain('v-model.number="entry.year"');
        expect(viewSource).toContain('carYearMin');
        expect(viewSource).toContain('carYearMax');
        expect(viewSource).toContain('v-for="color in catalogColors"');
        expect(viewSource).not.toMatch(/type="color"/);
    });

    it('shows Otro text inputs when catalog combobox selects Otro', () => {
        expect(viewSource).toContain('CATALOG_OTHER_VALUE');
        expect(viewSource).toContain("$t('marcaOtroPlaceholder')");
        expect(viewSource).toContain("$t('modeloOtroPlaceholder')");
        expect(viewSource).toContain('entry.brand_other');
        expect(viewSource).toContain('entry.model_other');
    });

    it('loads catalog data and saves cars with carPayloadFromForm', () => {
        expect(viewSource).toContain('useCarCatalogStore');
        expect(viewSource).toContain('carPayloadFromForm');
        expect(viewSource).toMatch(
            /async saveUserCars\(\)[\s\S]*?carPayloadFromForm\(entry\)/s
        );
        expect(viewSource).not.toContain("description: 'NOT USED YET'");
    });
});
