import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const apiSource = fs.readFileSync(path.resolve(__dirname, 'Trips.js'), 'utf8');

describe('TripApi sellado QR', () => {
    it('creates a sellado QR order for a trip', () => {
        expect(apiSource).toContain('createSelladoQrOrder');
        expect(apiSource).toContain(
            "'/api/trips/' + tripId + '/sellado/qr-order'"
        );
    });
});
