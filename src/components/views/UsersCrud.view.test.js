import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const viewPath = path.resolve(__dirname, 'UsersCrud.vue');
const source = fs.readFileSync(viewPath, 'utf8');

describe('UsersCrud admin edit view', () => {
    it('imports App* design-system form components', () => {
        expect(source).toContain("import AppButton from '../ui/AppButton.vue'");
        expect(source).toContain("import AppField from '../ui/AppField.vue'");
        expect(source).toContain("import AppInput from '../ui/AppInput.vue'");
        expect(source).toContain("import AppTextarea from '../ui/AppTextarea.vue'");
        expect(source).toContain('AppButton');
        expect(source).toContain('AppField');
        expect(source).toContain('AppInput');
        expect(source).toContain('AppTextarea');
    });

    it('uses AppButton secondary with :to for back to user summary', () => {
        expect(source).toMatch(
            /<AppButton[\s\S]*?variant="secondary"[\s\S]*?:to="[\s\S]*?admin-users-user/
        );
        expect(source).toContain("$t('adminUsuariosVolverResumen')");
    });

    it('does not use Bootstrap form-control classes', () => {
        expect(source).not.toContain('form-control');
    });

    it('does not use Bootstrap btn-primary, btn-default, btn-danger or btn-warning', () => {
        expect(source).not.toContain('btn btn-primary');
        expect(source).not.toContain('btn btn-default');
        expect(source).not.toContain('btn btn-danger');
        expect(source).not.toContain('btn btn-warning');
    });

    it('uses AppButton primary for save and variant buttons for admin actions', () => {
        expect(source).toMatch(
            /<AppButton[\s\S]*?variant="primary"[\s\S]*?@click="save"/
        );
        expect(source).toMatch(
            /<AppButton[\s\S]*?variant="danger"[\s\S]*?openConfirmModal\('delete'\)/
        );
        expect(source).toMatch(
            /<AppButton[\s\S]*?variant="warning"[\s\S]*?openConfirmModal\('anonymize'\)/
        );
        expect(source).toMatch(
            /<AppButton[\s\S]*?variant="warning"[\s\S]*?openConfirmModal\('banAndAnonymize'\)/
        );
        expect(source).toMatch(
            /<AppButton[\s\S]*?variant="warning"[\s\S]*?confirmClearIdentityValidation/
        );
    });

    it('uses AppInput for core text fields including DNI and phone', () => {
        expect(source).toMatch(/<AppInput[\s\S]*?id="input-name"/);
        expect(source).toMatch(/<AppInput[\s\S]*?id="input-email"/);
        expect(source).toMatch(/<AppInput[\s\S]*?id="input-dni"/);
        expect(source).toMatch(/<AppInput[\s\S]*?id="input-phone"/);
        expect(source).toMatch(/<AppInput[\s\S]*?id="input-patente"/);
        expect(source).toMatch(/<AppInput[\s\S]*?id="input-facebook-profile-url"/);
        expect(source).toMatch(/<AppInput[\s\S]*?id="accountNumber"/);
    });

    it('formats DNI via model-value and update handler like UpdateProfile', () => {
        expect(source).toMatch(
            /<AppInput[\s\S]*?id="input-dni"[\s\S]*?:model-value="newInfo\.nro_doc"/
        );
        expect(source).toMatch(/@update:modelValue="onDniModelUpdate"/);
        expect(source).toContain('onDniModelUpdate(value)');
        expect(source).toContain('formatId(value, this.settings.profile_id_format)');
    });

    it('keeps phone number keydown and paste guards on AppInput', () => {
        expect(source).toMatch(
            /<AppInput[\s\S]*?id="input-phone"[\s\S]*?@keydown="isNumber"/
        );
        expect(source).toMatch(
            /<AppInput[\s\S]*?id="input-phone"[\s\S]*?v-on:paste="isNumber"/
        );
    });

    it('uses AppInput password fields for new password entry', () => {
        expect(source).toMatch(/<AppInput[\s\S]*?id="input-pass"[\s\S]*?password/);
        expect(source).toMatch(
            /<AppInput[\s\S]*?id="input-pass-confirm"[\s\S]*?password/
        );
    });

    it('uses AppTextarea for description and private note', () => {
        expect(source).toMatch(/<AppTextarea[\s\S]*?v-model="newInfo\.description"/);
        expect(source).toMatch(/<AppTextarea[\s\S]*?v-model="newInfo\.private_note"/);
        expect(source).not.toMatch(/<textarea[\s\S]*?v-model="newInfo\.description"/);
        expect(source).not.toMatch(/<textarea[\s\S]*?v-model="newInfo\.private_note"/);
    });

    it('uses AppField for account type and bank selects with bancoDeCuenta id', () => {
        expect(source).toMatch(
            /<AppField[\s\S]*?tipoDeCuenta[\s\S]*?id="tipoDeCuenta"[\s\S]*?v-model="newInfo\.account_type"/
        );
        expect(source).toMatch(
            /<AppField[\s\S]*?bancoDeCuenta[\s\S]*?id="bancoDeCuenta"[\s\S]*?v-model="newInfo\.account_bank"/
        );
        expect(source).toContain('users-crud__select');
    });

    it('uses AppInput and AppButton in the confirm modal', () => {
        expect(source).toMatch(
            /<AppInput[\s\S]*?v-model="banNote"[\s\S]*?pendingAction === 'banAndAnonymize'/
        );
        expect(source).toMatch(
            /<AppButton[\s\S]*?variant="danger"[\s\S]*?executePendingAction/
        );
        expect(source).toMatch(
            /<AppButton[\s\S]*?variant="secondary"[\s\S]*?closeConfirmModal/
        );
    });
});
