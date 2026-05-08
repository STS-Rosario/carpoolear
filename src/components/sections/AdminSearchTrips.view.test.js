import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const viewPath = path.resolve(__dirname, 'AdminSearchTrips.vue');
const source = fs.readFileSync(viewPath, 'utf8');

describe('AdminSearchTrips user search', () => {
    it('uses UserSearchAutocomplete with maxResults for admin trip filter', () => {
        expect(source).toContain('UserSearchAutocomplete');
        expect(source).toContain(':max-results="3"');
    });

    it('hydrates filters from route-style params and emits initial persisted search', () => {
        expect(source).toContain("props: ['params']");
        expect(source).toContain('applyParams');
        expect(source).toContain('this.emit()');
        expect(source).toContain('params.user_id');
    });
});
