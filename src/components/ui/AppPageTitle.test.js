import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const componentPath = path.resolve(__dirname, 'AppPageTitle.vue');
const source = fs.readFileSync(componentPath, 'utf8');

describe('AppPageTitle', () => {
    it('renders a semantic page heading with slot support', () => {
        expect(source).toContain('<slot>{{ title }}</slot>');
        expect(source).toContain('title:');
    });
});
