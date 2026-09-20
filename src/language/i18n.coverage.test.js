import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import messages from './i18n.js';

const DEFAULT_LOCALE = 'arg';

function collectStaticTranslationKeys() {
    const keys = new Set();
    const keyPattern = /\$t\(\s*['"]([^'"]+)['"]\s*(?:[,)])|i18n\.t\(\s*['"]([^'"]+)['"]\s*(?:[,)])/g;
    const sourceRoot = path.resolve(__dirname, '..');

    const walk = (dir) => {
        fs.readdirSync(dir, { withFileTypes: true }).forEach((entry) => {
            if (entry.name === 'node_modules' || entry.name === 'dist' || entry.name === 'e2e') return;
            const entryPath = path.join(dir, entry.name);
            if (entry.isDirectory()) {
                walk(entryPath);
            } else if (
                /\.(vue|js)$/.test(entry.name) &&
                !entry.name.endsWith('.test.js') &&
                entry.name !== 'i18n.js'
            ) {
                const source = fs.readFileSync(entryPath, 'utf8');
                let match;
                while ((match = keyPattern.exec(source))) {
                    const key = match[1] || match[2];
                    if (key) {
                        keys.add(key);
                    }
                }
            }
        });
    };

    walk(sourceRoot);
    return keys;
}

const usedKeys = collectStaticTranslationKeys();

describe('i18n translation coverage', () => {
    it('defines the expected application locales', () => {
        expect(Object.keys(messages).sort()).toEqual([DEFAULT_LOCALE, 'chl', 'en']);
    });

    it('uses only registered keys from the default locale', () => {
        expect(messages[DEFAULT_LOCALE]).toBeDefined();
        const missing = [...usedKeys].filter((key) => !(key in messages[DEFAULT_LOCALE]));
        expect(missing).toEqual([]);
    });

    it('defines string values for every key in every locale', () => {
        Object.entries(messages).forEach(([locale, dictionary]) => {
            const invalidKeys = Object.entries(dictionary)
                .filter(([, value]) => typeof value !== 'string')
                .map(([key]) => key);
            expect(invalidKeys, `locale ${locale}`).toEqual([]);
        });
    });

    it('keeps the default locale free from placeholder keys', () => {
        expect(usedKeys.has('undefined')).toBe(false);
    });
});
