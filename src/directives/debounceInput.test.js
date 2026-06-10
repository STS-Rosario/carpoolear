import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const source = fs.readFileSync(
    path.resolve(__dirname, 'debounceInput.js'),
    'utf8'
);

describe('debounceInput directive', () => {
    it('binds debounced handlers to the component instance', () => {
        expect(source).toContain('handler.call(instance)');
        expect(source).toContain('binding.instance');
        expect(source).toContain('__debounceInputHandler');
    });

    it('does not use a module-level shared handler', () => {
        expect(source).not.toContain('let debounceFunction');
        expect(source).not.toContain('debounceFunction()');
    });
});
