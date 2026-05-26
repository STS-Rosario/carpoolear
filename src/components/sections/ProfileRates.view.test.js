import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const profileRatesPath = path.resolve(__dirname, 'ProfileRates.vue');
const profileInfoPath = path.resolve(__dirname, 'ProfileInfo.vue');
const i18nPath = path.resolve(__dirname, '../../language/i18n.js');

const profileRatesSource = fs.readFileSync(profileRatesPath, 'utf8');
const profileInfoSource = fs.readFileSync(profileInfoPath, 'utf8');
const i18nSource = fs.readFileSync(i18nPath, 'utf8');
const referenceActionSpacingRule =
    /\.edit-action-reference\s*\{[\s\S]*margin-bottom:\s*1rem/;

describe('ProfileRates reference action', () => {
    it('shows the write-reference action in the references section before the list', () => {
        const referencesHeadingIndex = profileRatesSource.indexOf("$t('referencias')");
        const actionIndex = profileRatesSource.indexOf("$t('enviarReferencia')");
        const referencesListIndex = profileRatesSource.indexOf('<Loading :data="references">');

        expect(actionIndex).toBeGreaterThan(referencesHeadingIndex);
        expect(actionIndex).toBeLessThan(referencesListIndex);
        expect(profileInfoSource).not.toContain("$t('enviarReferencia')");
    });

    it('asks for confirmation in a modal before showing the reference form', () => {
        expect(profileRatesSource).toContain('<modal');
        expect(profileRatesSource).toContain("$t('confirmarReferenciaUsuarioTitulo')");
        expect(profileRatesSource).toContain("$t('confirmarReferenciaUsuarioMensaje'");
        expect(profileRatesSource).toContain("$t('continuar')");
        expect(profileRatesSource).toContain("$t('cancelar')");
        expect(profileRatesSource).toMatch(/@click="showReferenceConfirmation"/);
        expect(profileRatesSource).toMatch(/@click="confirmReferenceWriting"/);
    });

    it('keeps all new confirmation copy in i18n', () => {
        expect(i18nSource).toContain('confirmarReferenciaUsuarioTitulo');
        expect(i18nSource).toContain('confirmarReferenciaUsuarioMensaje');
        expect(i18nSource).toContain(
            'Las referencias son de la persona, y no de un viaje.'
        );
        expect(i18nSource).toContain(
            'Si tuviste un viaje dentro de Carpoolear y querés dejar una calificación'
        );
        expect(i18nSource).toContain('Continuar');
        expect(i18nSource).toContain('Cancel');
    });

    it('adds bottom spacing to the reference action before the list', () => {
        expect(profileRatesSource).toMatch(referenceActionSpacingRule);
    });
});
