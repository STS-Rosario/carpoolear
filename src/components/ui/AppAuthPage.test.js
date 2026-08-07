import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const componentPath = path.resolve(__dirname, 'AppAuthPage.vue');
const source = fs.readFileSync(componentPath, 'utf8');

describe('AppAuthPage', () => {
    it('renders a reusable auth page shell with a card slot', () => {
        expect(source).toContain('app-auth-page');
        expect(source).toContain('app-auth-page__card');
        expect(source).toContain('<slot />');
    });
});
