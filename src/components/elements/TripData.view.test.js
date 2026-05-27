import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const viewPath = path.resolve(__dirname, 'TripData.vue');
const viewSource = fs.readFileSync(viewPath, 'utf8');

describe('TripData.vue rear seat comfort preference', () => {
    it('shows rear seat comfort copy only when the trip enables it', () => {
        expect(viewSource).toContain("$t('atrasViajanSolo2Personas')");
        expect(viewSource).toMatch(
            /v-if="Number\(trip\.rear_max_two_passengers\) > 0"/
        );
    });
});
