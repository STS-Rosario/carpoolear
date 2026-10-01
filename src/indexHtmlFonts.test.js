import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const indexPath = path.resolve(__dirname, '../index.html');
const indexSource = fs.readFileSync(indexPath, 'utf8');

describe('index.html fonts', () => {
    it('loads Dela Gothic One for the donation hero title', () => {
        expect(indexSource).toContain('family=Dela+Gothic+One');
    });
});
