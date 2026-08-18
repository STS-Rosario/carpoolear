import { describe, expect, it } from 'vitest';
import messages from './i18n';

describe('tripContributionDivisionExplainer (i18n)', () => {
    it.each(['arg', 'chl'])(
        '%s locale links to division de gastos help from contribution notice',
        (locale) => {
            expect(messages[locale].tripContributionDivisionExplainerPrefix).toBe(
                'En nuestra web explicamos '
            );
            expect(messages[locale].tripContributionDivisionExplainerLink).toBe(
                'cómo se calcula la contribución por persona'
            );
            expect(messages[locale].tripContributionDivisionExplainerSuffix).toBe(
                ' para cada viaje.'
            );
        }
    );

    it('en locale links to division de gastos help from contribution notice', () => {
        expect(messages.en.tripContributionDivisionExplainerPrefix).toBe(
            'On our website we explain '
        );
        expect(messages.en.tripContributionDivisionExplainerLink).toBe(
            'how per-person contribution is calculated'
        );
        expect(messages.en.tripContributionDivisionExplainerSuffix).toBe(
            ' for each trip.'
        );
    });
});
