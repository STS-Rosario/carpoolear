import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const viewPath = path.resolve(__dirname, 'AdminSupportReplyTemplateView.vue');
const source = fs.readFileSync(viewPath, 'utf8');

describe('AdminSupportReplyTemplateView view', () => {
    it('uses secondary AppButton for edit link', () => {
        expect(source).toContain("import AppButton from '../ui/AppButton.vue'");
        expect(source).toMatch(
            /<AppButton[\s\S]*?variant="secondary"[\s\S]*?:to="\{ name: 'admin-support-reply-template-edit'[\s\S]*?accionEditar/
        );
        expect(source).not.toContain('btn btn-default');
    });
});
