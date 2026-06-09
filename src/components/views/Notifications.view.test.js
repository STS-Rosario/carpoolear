import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const viewPath = path.resolve(__dirname, 'Notifications.vue');
const viewSource = fs.readFileSync(viewPath, 'utf8');

describe('Notifications view', () => {
    it('routes identity_validation notifications to account verification page', () => {
        expect(viewSource).toContain("case 'identity_validation':");
        expect(viewSource).toContain("name: 'identity_validation'");
    });

    it('routes friend trip alert notifications through trip detail resolver', () => {
        expect(viewSource).toContain(
            "import { resolveTripDetailRoute } from '../../utils/notificationNavigation.js'"
        );
        expect(viewSource).toContain('const tripRoute = resolveTripDetailRoute(n)');
        expect(viewSource).toContain("router.push(tripRoute)");
    });
});
