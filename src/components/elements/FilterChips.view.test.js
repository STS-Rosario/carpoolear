import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const viewPath = path.resolve(__dirname, 'FilterChips.vue');
const viewSource = fs.readFileSync(viewPath, 'utf8');

describe('FilterChips.vue', () => {
    it('renders a tablist of chip buttons from options with active check', () => {
        expect(viewSource).toContain('filter-chips');
        expect(viewSource).toContain('filter-chip');
        expect(viewSource).toContain('role="tablist"');
        expect(viewSource).toContain('v-for="chip in options"');
        expect(viewSource).toContain('filter-chip--active');
        expect(viewSource).toContain('fa-check');
        expect(viewSource).toContain('filter-chip__check');
        expect(viewSource).toContain("emit('update:modelValue'");
    });

    it('supports per-chip modifier class from chip.id', () => {
        expect(viewSource).toMatch(
            /filter-chip--\$\{chip\.id\}|`filter-chip--\$\{chip\.id\}`/
        );
    });

    it('keeps profile-filter-chip class aliases for existing profile CSS', () => {
        expect(viewSource).toContain('profile-filter-chips');
        expect(viewSource).toContain('profile-filter-chip');
        expect(viewSource).toContain('profile-filter-chip--active');
    });
});
