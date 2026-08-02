import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const viewPath = path.resolve(__dirname, 'UserSearchAutocomplete.vue');
const viewSource = fs.readFileSync(viewPath, 'utf8');

describe('UserSearchAutocomplete.vue', () => {
    it('does not hardcode Bootstrap form-control on the input', () => {
        expect(viewSource).toContain('inputClass');
        expect(viewSource).not.toMatch(
            /<input[\s\S]*?class="form-control"/
        );
    });
});
