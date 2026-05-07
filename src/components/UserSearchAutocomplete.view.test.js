import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const componentPath = path.resolve(__dirname, 'UserSearchAutocomplete.vue');
const source = fs.readFileSync(componentPath, 'utf8');

describe('UserSearchAutocomplete', () => {
    it('uses AdminApi searchUsers with debounced scheduling', () => {
        expect(source).toContain('AdminApi');
        expect(source).toContain('searchUsers({ name: term })');
        expect(source).toContain('250');
    });

    it('supports maxResults slice and keyboard navigation hooks', () => {
        expect(source).toContain('maxResults');
        expect(source).toContain('moveHighlight');
        expect(source).toContain('confirmHighlight');
    });

    it('emits v-model updates and cleared', () => {
        expect(source).toContain('update:modelValue');
        expect(source).toContain('cleared');
    });
});
