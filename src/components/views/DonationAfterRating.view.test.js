import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import messages from '../../language/i18n';

const viewPath = path.resolve(__dirname, 'DonationAfterRating.vue');
const viewSource = fs.readFileSync(viewPath, 'utf8');

describe('DonationAfterRating page content', () => {
    it('shows the hero section above the donation prompt content', () => {
        expect(viewSource).toContain('DonationAfterRatingHero');
        expect(viewSource.indexOf('DonationAfterRatingHero')).toBeLessThan(
            viewSource.indexOf('donation-after-rating__header')
        );
    });

    it('shows the donation prompt content from the post-rating modal', () => {
        expect(viewSource).toContain("$t('donaACarpoolear')");
        expect(viewSource).toContain("$t('proyectoDe')");
        expect(viewSource).toContain("$t('buenisimoCompartirViaje')");
        expect(viewSource).toContain("$t('ayudanosPlataforma')");
        expect(viewSource).toContain('DonationAmountPicker');
        expect(viewSource).toContain('getDonationOnceUrl');
        expect(viewSource).toContain('getDonationMonthlyUrl');
        expect(viewSource).not.toContain('value="2000"');
        expect(viewSource).not.toContain('value="10000"');
        expect(viewSource).toContain("$t('unicaVez')");
        expect(viewSource).toContain("$t('MENSUAL')");
        expect(viewSource).toContain("$t('cancelaCuando')");
        expect(viewSource).toMatch(
            /donation-actions[\s\S]*?variant="primary"[\s\S]*?onDonateMonthly[\s\S]*?variant="secondary"[\s\S]*?onDonateOnceTime/s
        );
        expect(viewSource).toContain("$t('conoceMasDonar')");
        expect(viewSource).toContain('onDonateOnceTime');
        expect(viewSource).toContain('onDonateMonthly');
        expect(viewSource).toContain('openDonationLink');
    });

    it('offers a skip button that returns to the trips list', () => {
        expect(viewSource).toContain("$t('continuarSinDonar')");
        expect(viewSource).toContain('onContinueWithoutDonating');
        expect(viewSource).toMatch(/name:\s*'trips'/);
    });

    it.each(['arg', 'en'])('defines continuarSinDonar in %s locale', (locale) => {
        expect(messages[locale].continuarSinDonar).toBeTruthy();
    });
});
