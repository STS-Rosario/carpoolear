import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const profileRatesPath = path.resolve(__dirname, 'ProfileRates.vue');
const profileInfoPath = path.resolve(__dirname, 'ProfileInfo.vue');
const i18nPath = path.resolve(__dirname, '../../language/i18n.js');

const profileRatesSource = fs.readFileSync(profileRatesPath, 'utf8');
const profileInfoSource = fs.readFileSync(profileInfoPath, 'utf8');
const i18nSource = fs.readFileSync(i18nPath, 'utf8');
const referenceMessageFirstKey = 'confirmarReferenciaUsuarioMensajeReferencia';
const referenceMessageSecondKey = 'confirmarReferenciaUsuarioMensajeCalificacion';
const referencePersonCopy =
    'Las referencias son de la persona, y no de un viaje.';
const referenceTripRatingCopy =
    'Si tuviste un viaje dentro de Carpoolear y querés dejar una calificación, podés hacerlo cuando haya transcurrido el 80% del tiempo estimado del viaje desde Mis Viajes. Vas a recibir una notificación 24 horas después del inicio del viaje.';
const referenceModalParagraphsRule =
    /<template #body>[\s\S]*<p>[\s\S]*\$t\('confirmarReferenciaUsuarioMensajeReferencia'[\s\S]*<\/p>[\s\S]*<p>[\s\S]*\$t\('confirmarReferenciaUsuarioMensajeCalificacion'\)[\s\S]*<\/p>[\s\S]*<\/template>/;
const referenciasDescriptionKey = 'referenciasDescripcion';
const referenciasDescriptionCopy =
    'Las referencias son recomendaciones de la persona, no por un viaje en particular dentro de Carpoolear';
const referenciasSectionDescriptionRule =
    /<h2>\{\{ \$t\('referencias'\) \}\}<\/h2>[\s\S]*<p class="referencias-section-description">[\s\S]*\$t\('referenciasDescripcion'\)[\s\S]*<\/p>/;

describe('ProfileRates reference action', () => {
    it('shows a description paragraph below the references section header', () => {
        const referencesHeadingIndex = profileRatesSource.indexOf("$t('referencias')");
        const descriptionIndex = profileRatesSource.indexOf(
            `$t('${referenciasDescriptionKey}')`
        );
        const actionIndex = profileRatesSource.indexOf("$t('enviarReferencia')");

        expect(profileRatesSource).toMatch(referenciasSectionDescriptionRule);
        expect(descriptionIndex).toBeGreaterThan(referencesHeadingIndex);
        expect(descriptionIndex).toBeLessThan(actionIndex);
    });

    it('keeps the references section description in i18n', () => {
        expect(i18nSource).toContain(referenciasDescriptionKey);
        expect(i18nSource).toContain(referenciasDescriptionCopy);
    });

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
        expect(profileRatesSource).toContain(`$t('${referenceMessageFirstKey}'`);
        expect(profileRatesSource).toContain(`$t('${referenceMessageSecondKey}')`);
        expect(profileRatesSource).toContain("$t('continuar')");
        expect(profileRatesSource).toContain("$t('cancelar')");
        expect(profileRatesSource).toMatch(/@click="showReferenceConfirmation"/);
        expect(profileRatesSource).toMatch(/@click="confirmReferenceWriting"/);
    });

    it('uses Continuar primary then Cancelar secondary in the confirmation modal footer', () => {
        const footer = profileRatesSource.match(
            /name="reference-confirmation-modal"[\s\S]*?<template #footer>([\s\S]*?)<\/template>/
        );
        expect(footer).not.toBeNull();
        const footerHtml = footer[1];
        const continuarIndex = footerHtml.indexOf("$t('continuar')");
        const cancelarIndex = footerHtml.indexOf("$t('cancelar')");
        expect(continuarIndex).toBeGreaterThan(-1);
        expect(cancelarIndex).toBeGreaterThan(continuarIndex);
    });

    it('renders the reference explanation as two translated paragraphs', () => {
        expect(profileRatesSource).toMatch(referenceModalParagraphsRule);
    });

    it('keeps all new confirmation copy in i18n', () => {
        expect(i18nSource).toContain('confirmarReferenciaUsuarioTitulo');
        expect(i18nSource).toContain(referenceMessageFirstKey);
        expect(i18nSource).toContain(referenceMessageSecondKey);
        expect(i18nSource).toContain(referencePersonCopy);
        expect(i18nSource).toContain(referenceTripRatingCopy);
        expect(i18nSource).toContain('Continuar');
        expect(i18nSource).toContain('Cancel');
    });

    it('uses Guardar referencia on the write form', () => {
        expect(profileRatesSource).toContain("$t('guardarReferencia')");
        expect(profileRatesSource).not.toMatch(
            /sendReference[\s\S]*?\$t\('comentar'\)/
        );
        expect(i18nSource).toMatch(
            /guardarReferencia:\s*'Guardar referencia'/
        );
        expect(i18nSource).toMatch(
            /guardarReferencia:\s*'Save reference'/
        );
    });

    it('renders calificaciones with RateItem', () => {
        expect(profileRatesSource).toContain('RateItem');
    });

    it('filters ratings with chips Todas Positivas Neutras Negativas', () => {
        expect(profileRatesSource).toContain('FilterChips');
        expect(profileRatesSource).toContain('ratingFilter');
        expect(profileRatesSource).toContain("$t('filtroCalificacionesTodas')");
        expect(profileRatesSource).toContain("$t('filtroCalificacionesPositivas')");
        expect(profileRatesSource).toContain("$t('filtroCalificacionesNeutras')");
        expect(profileRatesSource).toContain("$t('filtroCalificacionesNegativas')");
        expect(profileRatesSource).toContain('filteredRates');
        expect(profileRatesSource).not.toContain('fa-smile');
    });

    it('adds rating-type class on each calificaciones filter chip', () => {
        expect(profileRatesSource).toContain('ratingFilterChips');
        expect(profileRatesSource).toMatch(/id:\s*'all'/);
        expect(profileRatesSource).toMatch(/id:\s*'positive'/);
    });
});
