import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import messages from '../language/i18n';

const modalPath = path.resolve(__dirname, 'IdentityValidationPromptModal.vue');
const modalSource = fs.readFileSync(modalPath, 'utf8');

describe('IdentityValidationPromptModal verification options', () => {
    const spanishCostLabels = {
        identidadModalAutoCostoEtiqueta: 'gratis',
        identidadModalManualCostoEtiqueta: 'con costo'
    };
    const englishCostLabels = {
        identidadModalAutoCostoEtiqueta: 'free',
        identidadModalManualCostoEtiqueta: 'paid'
    };

    it.each(['arg', 'chl'])(
        '%s locale labels automatic as free and manual as paid',
        (locale) => {
            Object.entries(spanishCostLabels).forEach(([key, label]) => {
                expect(messages[locale][key]).toBe(label);
            });
        }
    );

    it('en locale labels automatic as free and manual as paid', () => {
        Object.entries(englishCostLabels).forEach(([key, label]) => {
            expect(messages.en[key]).toBe(label);
        });
    });

    it('lists only the method names with cost, without extra bullets', () => {
        expect(modalSource).toContain("$t('identidadModalAutoTitulo')");
        expect(modalSource).toContain("$t('identidadModalAutoCostoEtiqueta')");
        expect(modalSource).toContain("$t('identidadModalManualTitulo')");
        expect(modalSource).toContain("$t('identidadModalManualCostoEtiqueta')");
        expect(modalSource).toContain("$t('identidadModalUnaVez')");

        expect(modalSource).not.toContain("$t('identidadModalAutoMp')");
        expect(modalSource).not.toContain("$t('identidadModalAutoGratis')");
        expect(modalSource).not.toContain("$t('identidadModalAutoInmediata')");
        expect(modalSource).not.toContain("$t('identidadModalAutoPuedeEliminarMp')");
        expect(modalSource).not.toContain("$t('identidadModalManualEquipo')");
        expect(modalSource).not.toContain("$t('identidadModalManualCosto')");
        expect(modalSource).not.toContain("$t('identidadModalManualPlazo')");
        expect(modalSource).not.toMatch(
            /identity-validation-prompt-option-block[\s\S]*?<ul>/
        );
    });
});

describe('IdentityValidationPromptModal learn more link', () => {
    it('shows learn-more copy below the once-only note with link to verificacion cuenta', () => {
        const footnoteIndex = modalSource.indexOf(
            'identity-validation-prompt-footnote'
        );
        const learnMoreIndex = modalSource.indexOf(
            'identity-validation-prompt-learn-more'
        );

        expect(footnoteIndex).toBeGreaterThan(-1);
        expect(learnMoreIndex).toBeGreaterThan(footnoteIndex);
        expect(modalSource).toContain(
            "$t('identityValidationLearnMorePrefix')"
        );
        expect(modalSource).toContain(
            "$t('identityValidationLearnMoreLink')"
        );
        expect(modalSource).toContain(
            "$t('identityValidationLearnMoreSuffix')"
        );
        expect(modalSource).toContain("name: 'verificacion_cuenta'");
    });

    it('hides the modal while viewing the verificacion cuenta help page', () => {
        expect(modalSource).toContain("n === 'verificacion_cuenta'");
    });
});

describe('MP disconnect copy', () => {
    it('defines Argentinian Spanish strings', () => {
        expect(messages.arg.identidadModalAutoPuedeEliminarMp).toBe(
            'Luego de verificar, podés eliminar la integración con MP'
        );
        expect(messages.arg.identityVerificationSuccessMpDisconnectLead).toBe(
            '¡Todo listo! Ya verificamos tu identidad y podés '
        );
        expect(messages.arg.identityVerificationSuccessMpDisconnectLink).toBe(
            'eliminar la integración con Mercado Pago'
        );
        expect(messages.arg.identityVerificationSuccessMpDisconnectTail).toBe(
            ' si así lo deseás.'
        );
        expect(
            messages.arg.identityVerificationSuccessMpDisconnectManualInstructions
        ).toBe(
            'Si el link no funciona, podés hacerlo manualmente desde la app de Mercado Pago yendo a Menú-> Configuración -> Cuenta -> Seguridad -> Aplicaciones conectadas -> Carpoolear-SelladoVIaje -> Quitar permisos'
        );
    });
});
