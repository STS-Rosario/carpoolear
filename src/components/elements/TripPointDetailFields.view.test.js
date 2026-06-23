import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const viewPath = path.resolve(__dirname, 'TripPointDetailFields.vue');
const viewSource = fs.readFileSync(viewPath, 'utf8');

describe('TripPointDetailFields', () => {
    it('renders i18n labels and placeholder for point detail inputs', () => {
        expect(viewSource).toContain("$t('puntoDePartida')");
        expect(viewSource).toContain("$t('puntoDeLlegada')");
        expect(viewSource).toContain("$t('barrioOPuntoEncuentroPublico')");
        expect(viewSource).toContain('shouldShowTripPointDetailInputs');
    });
});
