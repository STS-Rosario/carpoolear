import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import messages from '../language/i18n';

const modalPath = path.resolve(__dirname, 'IdentityValidationPromptModal.vue');
const modalSource = fs.readFileSync(modalPath, 'utf8');

describe('IdentityValidationPromptModal MP benefits', () => {
    it('clarifies automatic verification is only for Mercado Pago account holders', () => {
        expect(messages.arg.identidadModalAutoMp).toBe(
            'Sólo si tenés cuenta de Mercado Pago'
        );
        expect(messages.chl.identidadModalAutoMp).toBe(
            'Sólo si tenés cuenta de Mercado Pago'
        );
        expect(messages.en.identidadModalAutoMp).toBe(
            'Only if you have a Mercado Pago account'
        );
        expect(modalSource).toContain("$t('identidadModalAutoMp')");
    });

    it('lists that MP integration can be removed after verifying', () => {
        expect(modalSource).toContain("$t('identidadModalAutoGratis')");
        expect(modalSource).toContain("$t('identidadModalAutoInmediata')");
        expect(modalSource).toContain("$t('identidadModalAutoPuedeEliminarMp')");
        const inmediata = modalSource.indexOf(
            "$t('identidadModalAutoInmediata')"
        );
        const puedeEliminar = modalSource.indexOf(
            "$t('identidadModalAutoPuedeEliminarMp')"
        );
        expect(puedeEliminar).toBeGreaterThan(inmediata);
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
