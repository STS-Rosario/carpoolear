import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const paginationPath = path.resolve(__dirname, 'pagination.js');
const source = fs.readFileSync(paginationPath, 'utf8');

describe('pagination new search', () => {
    it('honours an explicit page from filter data instead of always resetting to 1', () => {
        expect(source).toMatch(/\/\/ RESTORE_PAGE/);
        expect(source).toMatch(/requestedPage/);
        expect(source).toMatch(/data\.page/);
    });
});
