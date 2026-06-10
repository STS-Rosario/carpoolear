import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const storeSource = fs.readFileSync(path.resolve(__dirname, 'friends.js'), 'utf8');

describe('friends store trip alerts', () => {
    it('exposes toggleTripAlerts action wired to FriendApi', () => {
        expect(storeSource).toContain('toggleTripAlerts');
        expect(storeSource).toContain('friendsApi.toggleTripAlerts');
    });
});
