import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { APP_KEYBOARD_INSET_CSS_VAR } from '../utils/appKeyboardInset.js';

const baseCss = fs.readFileSync(path.resolve(__dirname, 'base.css'), 'utf8');

describe('app keyboard inset styles', () => {
    it('defaults the overlay keyboard inset token to zero', () => {
        expect(baseCss).toContain(APP_KEYBOARD_INSET_CSS_VAR);
        expect(baseCss).toMatch(
            new RegExp(
                `:root\\s*\\{[^}]*${APP_KEYBOARD_INSET_CSS_VAR}:\\s*0px`
            )
        );
    });
});
