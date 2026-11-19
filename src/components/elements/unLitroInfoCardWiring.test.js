import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const cardPath = path.resolve(__dirname, 'UnLitroInfoCard.vue');
const contentPath = path.resolve(__dirname, 'UnLitroParaCarpoolearContent.vue');

describe('Un litro card module wiring', () => {
    it('avoids circular imports between UnLitroInfoCard and page content', () => {
        const cardSource = fs.readFileSync(cardPath, 'utf8');
        const contentSource = fs.readFileSync(contentPath, 'utf8');

        expect(cardSource).toContain('UnLitroParaCarpoolearContent');
        expect(contentSource).toContain('UnLitroClubPagePromoCard');
        expect(contentSource).not.toContain("from './UnLitroInfoCard.vue'");
    });
});