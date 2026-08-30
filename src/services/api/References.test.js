import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const apiSource = fs.readFileSync(
    path.resolve(__dirname, 'References.js'),
    'utf8'
);

describe('ReferencesApi', () => {
    it('posts a reply to a reference by author user id', () => {
        expect(apiSource).toContain('reply(');
        expect(apiSource).toContain('/api/references/reply/');
    });
});
