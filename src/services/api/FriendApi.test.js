import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const apiSource = fs.readFileSync(path.resolve(__dirname, 'FriendApi.js'), 'utf8');

describe('FriendApi trip alerts', () => {
    it('targets trip-alerts toggle endpoint', () => {
        expect(apiSource).toContain('toggleTripAlerts');
        expect(apiSource).toContain('/api/friends/trip-alerts/');
    });
});
