import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const viewPath = path.resolve(__dirname, 'AdminSupportTicketNew.vue');
const source = fs.readFileSync(viewPath, 'utf8');

describe('AdminSupportTicketNew view', () => {
    it('uses shared UserSearchAutocomplete for user lookup', () => {
        expect(source).toContain('UserSearchAutocomplete');
        expect(source).toContain("v-model=\"selectedUser\"");
        expect(source).not.toContain('class="list-group autocomplete-users"');
    });
});
