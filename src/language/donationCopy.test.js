import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import messages from './i18n';

describe('donation copy wording', () => {
    it('uses aportar/aporte wording in arg', () => {
        expect(messages.arg.donaA).toBe('Aportá a Carpoolear');
        expect(messages.arg.donaACarpoolear).toBe('Aportá a Carpoolear');
        expect(messages.arg.porQueDonar).toBe('Por qué aportar a Carpoolear');
        expect(messages.arg.conoceMasDonar).toBe('Conocé más sobre aportes');
        expect(messages.arg.continuarSinDonar).toBe('Continuar sin aportar');
        expect(messages.arg.donationUsageNote).toBe(
            'Todos los aportes son utilizados para mejorar la plataforma, pagar costos de servidores, programación, soporte, etc. Tu aporte ayuda a mantener a Carpoolear vivo, junto al trabajo voluntario.'
        );
        expect(messages.arg.valorDonacion).toBe(
            'Tienes que seleccionar un valor de aporte.'
        );
        expect(messages.arg.tienesQueSeleccionarDonacion).toBe(
            'Tienes que seleccionar un valor de aporte'
        );
        expect(messages.arg.donationAfterRatingHeroTitlePrimary).toBe('Necesitamos');
        expect(messages.arg.donationAfterRatingHeroTitleAccent).toBe('Tu aporte');
        expect(messages.arg.donationAfterRatingJoinAccent).toBe(
            'Comunidad Carpoolear'
        );
    });

    it('uses aportar/aporte wording in chl', () => {
        expect(messages.chl.donaA).toBe('Aportá a Apalan-car');
        expect(messages.chl.porQueDonar).toBe('Por qué aportar a Apalan-car');
        expect(messages.chl.conoceMasDonar).toBe('Conocé más sobre aportes');
        expect(messages.chl.continuarSinDonar).toBe('Continuar sin aportar');
        expect(messages.chl.donationUsageNote).toBe(
            'Todos los aportes son utilizados para mejorar la plataforma, pagar costos de servidores, programación, soporte, etc. Tu aporte ayuda a mantener a Carpoolear vivo, junto al trabajo voluntario.'
        );
        expect(messages.chl.tienesQueSeleccionarDonacion).toBe(
            'Tienes que seleccionar un valor de aporte'
        );
    });

    it('uses contribute/contribution wording in en', () => {
        expect(messages.en.donaA).toBe('Contribute to Carpoolear');
        expect(messages.en.donaACarpoolear).toBe('Contribute to Carpoolear');
        expect(messages.en.porQueDonar).toBe('Why contribute to Carpoolear');
        expect(messages.en.conoceMasDonar).toBe(
            'Learn more about contributions'
        );
        expect(messages.en.continuarSinDonar).toBe(
            'Continue without contributing'
        );
        expect(messages.en.donationUsageNote).toBe(
            'All contributions are used to improve the platform, pay for servers, development, support, and more. Your contribution helps keep Carpoolear alive, alongside volunteer work.'
        );
        expect(messages.en.valorDonacion).toBe(
            'You must select a contribution amount.'
        );
        expect(messages.en.tienesQueSeleccionarDonacion).toBe(
            'You must select a contribution amount'
        );
    });
});

describe('aportar page links', () => {
    it.each([
        'sections/HeaderApp.vue',
        'views/Trips.vue'
    ])('points %s at /aportar instead of /donar', (relativePath) => {
        const source = fs.readFileSync(
            path.resolve(__dirname, `../components/${relativePath}`),
            'utf8'
        );
        expect(source).toMatch(/href=["']\/aportar|carpoolear\.com\.ar\/aportar/);
        expect(source).not.toMatch(
            /href=["']\/donar|carpoolear\.com\.ar\/donar/
        );
    });
});
