import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const viewPath = path.resolve(__dirname, 'RatePending.vue');
const viewSource = fs.readFileSync(viewPath, 'utf8');

describe('RatePending.vue neutral ratings', () => {
    it('offers positive, neutral, and negative rating buttons', () => {
        expect(viewSource).toContain('rate-positive');
        expect(viewSource).toContain('rate-neutral');
        expect(viewSource).toContain('rate-negative');
        expect(viewSource).toContain('setRate(1)');
        expect(viewSource).toContain('setRate(2)');
        expect(viewSource).toContain('setRate(0)');
    });

    it('uses shared vote validation for mandatory neutral comments', () => {
        expect(viewSource).toContain("from '../utils/tripRating'");
        expect(viewSource).toContain('canSubmitRatingVote');
    });

    it('uses rating-specific validation copy for empty comments', () => {
        expect(viewSource).toContain('getRequiredCommentMessageKey');
        expect(viewSource).toMatch(
            /\$t\(getRequiredCommentMessageKey\(this\.vote\)\)/
        );

        const i18nSource = fs.readFileSync(
            path.resolve(__dirname, '../language/i18n.js'),
            'utf8'
        );
        expect(i18nSource).toContain('ratePendingComentarioNoPuedeEstarVacioNeutral');
        expect(i18nSource).toContain(
            'El comentario no puede estar vacío para los votos neutrales.'
        );
    });
});

describe('RatePending.vue paid-more question', () => {
    it('asks passengers rating a driver whether they paid more than the contribution', () => {
        expect(viewSource).toContain('shouldAskPaidMoreThanContribution');
        expect(viewSource).toContain('canSubmitPaidMoreAnswer');
        expect(viewSource).toContain('buildRatingVotePayload');
        expect(viewSource).toContain('ratePendingPaidMoreThanContribution');
        expect(viewSource).toContain('ratePendingPaidMoreLegend');
        expect(viewSource).toContain('ratePendingPaidMoreRequired');
        expect(viewSource).toContain('formatTripContributionPesosLabel');
        expect(viewSource).toContain("$t('si')");
        expect(viewSource).toContain("$t('no')");
        expect(viewSource).toContain('paidMore');
        expect(viewSource).toContain('rate-pending-paid-more-options');
    });

    it('styles the paid-more title as a larger bold heading close to the choices', () => {
        const questionRule = viewSource.match(
            /\.rate-pending-paid-more-question\s*\{[^}]+\}/
        );
        expect(questionRule).not.toBeNull();
        expect(questionRule[0]).toMatch(/font-weight:\s*700/);
        expect(questionRule[0]).toMatch(/font-size:\s*1\.125rem/);
        expect(questionRule[0]).toMatch(/margin-bottom:\s*0\.35em/);
    });

    it('keeps Sí and No far enough apart to avoid mis-taps', () => {
        const optionsRule = viewSource.match(
            /\.rate-pending-paid-more-options\s*\{[^}]+\}/
        );
        expect(optionsRule).not.toBeNull();
        expect(optionsRule[0]).toMatch(/display:\s*flex/);
        expect(optionsRule[0]).toMatch(/gap:\s*2\.5rem/);
    });

    it('pulls the legend closer in lighter italic grey', () => {
        const legendRule = viewSource.match(
            /\.rate-pending-paid-more-legend\s*\{[^}]+\}/
        );
        expect(legendRule).not.toBeNull();
        expect(legendRule[0]).toMatch(/font-style:\s*italic/);
        expect(legendRule[0]).toMatch(/color:\s*#888/);
        expect(legendRule[0]).toMatch(/margin-top:\s*0\.35em/);
    });
});

describe('RatePending.vue destination city', () => {
    it('does not read trip.points without a helper', () => {
        expect(viewSource).not.toMatch(
            /trip\.points\[trip\.points\.length/
        );
        expect(viewSource).toContain('getTripDestinationCity');
        expect(viewSource).toContain("from '../utils/ongoingTrip'");
    });
});
