import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const viewPath = path.resolve(__dirname, 'AdminSupportTicketNew.vue');
const source = fs.readFileSync(viewPath, 'utf8');

describe('AdminSupportTicketNew view', () => {
    it('uses shared UserSearchAutocomplete for user lookup', () => {
        expect(source).toContain('UserSearchAutocomplete');
        expect(source).toContain('v-model="selectedUser"');
        expect(source).not.toContain('class="list-group autocomplete-users"');
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

    it('uses AppField, AppInput, AppTextarea and primary AppButton for create form', () => {
        expect(source).toContain("import AppButton from '../ui/AppButton.vue'");
        expect(source).toContain("import AppField from '../ui/AppField.vue'");
        expect(source).toContain("import AppInput from '../ui/AppInput.vue'");
        expect(source).toContain("import AppTextarea from '../ui/AppTextarea.vue'");
        expect(source).toMatch(
            /<AppField[\s\S]*?categoriaTicket[\s\S]*?<select[\s\S]*?v-model="createForm\.type"/
        );
        expect(source).toMatch(
            /<AppInput[\s\S]*?v-model="createForm\.subject"[\s\S]*?asuntoTicket/
        );
        expect(source).toMatch(
            /<AppTextarea[\s\S]*?v-model="createForm\.message_markdown"[\s\S]*?mensajeTicket/
        );
        expect(source).toMatch(
            /<AppButton[\s\S]*?variant="primary"[\s\S]*?createTicket[\s\S]*?crearTicket/
        );
        expect(source).not.toContain('form-control');
        expect(source).not.toContain('btn btn-primary');
    });
});
