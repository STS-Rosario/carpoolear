import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const viewPath = path.resolve(__dirname, 'Register.vue');
const viewSource = fs.readFileSync(viewPath, 'utf8');

describe('Register bank account selects', () => {
    it('uses AppField for account type and bank selects', () => {
        expect(viewSource).toContain(
            "import AppField from '../ui/AppField.vue'"
        );
        expect(viewSource).toMatch(
            /<AppField[\s\S]*?tipoDeCuenta[\s\S]*?id="tipoDeCuenta"[\s\S]*?v-model="account_type"/
        );
        expect(viewSource).toMatch(
            /<AppField[\s\S]*?bancoDeCuenta[\s\S]*?id="bancoDeCuenta"[\s\S]*?v-model="account_bank"/
        );
        expect(viewSource).toContain('register-page__select');
        expect(viewSource).not.toMatch(
            /id="tipoDeCuenta"[\s\S]*?class="form-control"/
        );
        expect(viewSource).not.toMatch(
            /id="bancoDeCuenta"[\s\S]*?class="form-control"/
        );
        expect(viewSource).toMatch(
            /\.register-page__select\s*\{[^}]*border:\s*0/
        );
    });
});
