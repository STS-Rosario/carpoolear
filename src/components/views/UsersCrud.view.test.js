import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const viewPath = path.resolve(__dirname, 'UsersCrud.vue');
const source = fs.readFileSync(viewPath, 'utf8');

describe('UsersCrud admin edit view', () => {
    it('formats document id via model-value and update handler like UpdateProfile', () => {
        expect(source).toMatch(
            /<AppInput[\s\S]*?id="input-dni"[\s\S]*?:model-value="newInfo\.nro_doc"/
        );
        expect(source).toMatch(/@update:modelValue="onDniModelUpdate"/);
        expect(source).toContain('onDniModelUpdate(value)');
        expect(source).toContain('formatDocumentIdInput(');
        expect(source).toContain('resolveProfileIdFormats(this.settings)');
        expect(source).toContain('type: this.documentType');
    });

    it('lets the admin choose DNI or passport before entering the number', () => {
        expect(source).toContain('AppSegmentToggle');
        expect(source).toContain("$t('tipoDocumento')");
        expect(source).toContain('v-model="documentType"');
        expect(source).toContain('documentTypeOptions');
        expect(source).toContain('inferDocumentType');
    });

    it('keeps phone number keydown and paste guards on AppInput', () => {
        expect(source).toMatch(
            /<AppInput[\s\S]*?id="input-phone"[\s\S]*?@keydown="isNumber"/
        );
        expect(source).toMatch(
            /<AppInput[\s\S]*?id="input-phone"[\s\S]*?v-on:paste="isNumber"/
        );
    });

    it('gates destructive account controls behind admin permissions', () => {
        expect(source).toContain('ADMIN_PERMISSIONS.UsersSuspend');
        expect(source).toContain('ADMIN_PERMISSIONS.UsersSetActive');
        expect(source).toContain('ADMIN_PERMISSIONS.UsersDriverVerified');
        expect(source).toContain('ADMIN_PERMISSIONS.UsersDelete');
        expect(source).toContain('ADMIN_PERMISSIONS.UsersAnonymize');
        expect(source).toContain('ADMIN_PERMISSIONS.UsersBanAndAnonymize');
        expect(source).toContain('ADMIN_PERMISSIONS.UsersUnverify');
        expect(source).toContain('can(this.authUser');
    });
});
