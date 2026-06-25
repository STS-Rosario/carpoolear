import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const middlewareSource = fs.readFileSync(
    path.resolve(__dirname, 'middleware.js'),
    'utf8'
);

describe('profileComplete middleware', () => {
    it('uses the shared incomplete profile route constant', () => {
        expect(middlewareSource).toContain('INCOMPLETE_PROFILE_UPDATE_ROUTE');
        expect(middlewareSource).not.toContain(
            "query: { incompleteProfile: 'true' }"
        );
    });
});
