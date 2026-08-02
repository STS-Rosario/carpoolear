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

    it('shows a personal address warning when punto partida or llegada contain digits', () => {
        expect(viewSource).toContain('tripPointDetailContainsNumber');
        expect(viewSource).toContain(
            "$t('puntoDetalleAdvertenciaDireccionPersonal')"
        );
        expect(viewSource).toContain('showPuntoPartidaPersonalAddressWarning');
        expect(viewSource).toContain('showPuntoLlegadaPersonalAddressWarning');
    });

    it('can render only partida or only llegada via fields prop', () => {
        expect(viewSource).toContain("fields: {");
        expect(viewSource).toContain("default: 'both'");
        expect(viewSource).toContain('showPuntoPartida');
        expect(viewSource).toContain('showPuntoLlegada');
        expect(viewSource).toContain('shouldShowPuntoPartidaInput');
        expect(viewSource).toContain('shouldShowPuntoLlegadaInput');
        expect(viewSource).toContain('v-if="showPuntoPartida"');
        expect(viewSource).toContain('v-if="showPuntoLlegada"');
    });

    it('styles validation errors in red', () => {
        expect(viewSource).toMatch(
            /\.error\s*\{[^}]*color:\s*(?:red|var\(--main-error)/
        );
    });

    it('uses AppInput for punto partida and llegada fields', () => {
        expect(viewSource).toContain("import AppInput from '../ui/AppInput.vue'");
        expect(viewSource).toMatch(
            /<AppInput[\s\S]*?:label="\$t\('puntoDePartida'\)"[\s\S]*?:id="puntoPartidaId"/
        );
        expect(viewSource).toMatch(
            /<AppInput[\s\S]*?:label="\$t\('puntoDeLlegada'\)"[\s\S]*?:id="puntoLlegadaId"/
        );
        expect(viewSource).not.toContain('form-control');
        expect(viewSource).not.toMatch(/<input[\s\S]*?class="form-control"/);
    });
});
