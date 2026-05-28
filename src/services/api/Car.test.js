import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const apiSource = fs.readFileSync(path.resolve(__dirname, 'Car.js'), 'utf8');

describe('CarApi.delete', () => {
    it('calls TaggedApi delete instead of recursing into itself', () => {
        expect(apiSource).toContain("return super.delete('/api/cars/' + data.id, data)");
        expect(apiSource).not.toMatch(
            /delete\(data[^)]*\)\s*\{\s*return this\.delete\(/s
        );
    });
});
