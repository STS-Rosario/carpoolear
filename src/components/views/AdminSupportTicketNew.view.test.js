import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const viewPath = path.resolve(__dirname, 'AdminSupportTicketNew.vue');
const source = fs.readFileSync(viewPath, 'utf8');

describe('AdminSupportTicketNew view', () => {
    it('uses shared UserSearchAutocomplete for user lookup', () => {
        expect(source).toContain('UserSearchAutocomplete');
        expect(source).toContain('v-model="selectedUser"');
    });

    it('persists selected user and form fields in route query', () => {
        expect(source).toContain('syncRouteQuery');
        expect(source).toContain('this.$router.replace');
        expect(source).toContain('query.userId');
        expect(source).toContain('query.userName');
        expect(source).toContain('query.type');
        expect(source).toContain('query.subject');
        expect(source).toContain('query.message');
    });

    it('uses the markdown editor for the ticket message', () => {
        expect(source).toContain('ToastUiEditor');
        expect(source).toContain('editor: ToastUiEditor');
        expect(source).toContain('initial-edit-type="wysiwyg"');
        expect(source).toContain(':initial-value="createForm.message_markdown"');
        expect(source).toContain("invoke('getMarkdown')");
        expect(source).not.toContain('AppTextarea');
    });
});
