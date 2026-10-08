import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const routesPath = path.resolve(__dirname, 'routes.js');
const routesSource = fs.readFileSync(routesPath, 'utf8');

describe('rate pending passenger preview route', () => {
    it('registers a DEV-only passenger rate-pending preview', () => {
        expect(routesSource).toContain(
            "path: '/preview/rate-pending-passenger'"
        );
        expect(routesSource).toContain("name: 'preview-rate-pending-passenger'");
        expect(routesSource).toContain('PreviewRatePendingPassenger.vue');
        expect(routesSource).toContain(
            "import.meta.env.DEV ? ["
        );
    });
});
