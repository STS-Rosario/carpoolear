import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const viewPath = path.resolve(__dirname, 'NewTrip.vue');
const viewSource = fs.readFileSync(viewPath, 'utf8');

describe('NewTrip.vue seat price API mapping', () => {
    it('imports seat price helpers for voluntary -1 sentinel', () => {
        expect(viewSource).toMatch(/from '\.\.\/\.\.\/utils\/tripSeatPrice\.js'/);
        expect(viewSource).toContain('seatPriceCentsForApi');
        expect(viewSource).toContain('priceInputNumberFromStoredSeatPriceCents');
    });
});
