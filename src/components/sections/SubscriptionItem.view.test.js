import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const viewPath = path.resolve(__dirname, 'SubscriptionItem.vue');
const i18nPath = path.resolve(__dirname, '../../language/i18n.js');
const viewSource = fs.readFileSync(viewPath, 'utf8');
const i18nSource = fs.readFileSync(i18nPath, 'utf8');

describe('SubscriptionItem alert card', () => {
    it('renders a vertically centered card with route details', () => {
        expect(viewSource).toContain('data-testid="subscription-alert-card"');
        expect(viewSource).toContain('subscription-alert-card');
        expect(viewSource).toContain("$t('origen')");
        expect(viewSource).toContain("$t('destino')");
        expect(viewSource).toContain("$t('fechaAproximada')");
        expect(viewSource).toContain("$t('buscoPasajeros')");
        expect(viewSource).toContain("$t('buscoConductor')");
        expect(viewSource).not.toContain('panel panel-default');
        expect(viewSource).not.toContain('col-xs-20');
        expect(viewSource).toMatch(
            /\.subscription-alert-card\s*\{[^}]*align-items:\s*center/
        );
    });

    it('shows a delete AppButton labeled Borrar that stops card click', () => {
        expect(viewSource).toContain('data-testid="subscription-alert-delete"');
        expect(viewSource).toContain('AppButton');
        expect(viewSource).toContain('variant="danger"');
        expect(viewSource).toContain("$t('borrar')");
        expect(viewSource).toContain('fa-trash-o');
        expect(viewSource).toMatch(
            /@click\.stop(?:\.prevent)?="remove"|v-on:click\.stop="remove"/
        );
        expect(viewSource).not.toContain('btn btn-default');
    });

    it('keeps borrar copy in i18n locales', () => {
        expect(i18nSource).toMatch(/borrar:\s*'Borrar'/);
        expect(i18nSource).toMatch(/borrar:\s*'Delete'/);
    });
});
