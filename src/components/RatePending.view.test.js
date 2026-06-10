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

    it('styles neutral icon as rotated greyscale thumbs-up', () => {
        expect(viewSource).toContain('fa-thumbs-o-up');
        expect(viewSource).toContain('rate-neutral-icon');
        expect(viewSource).toContain('NEUTRAL_RATING_ICON_STYLE');
    });

    it('lays out rating buttons with even spacing and neutral active styling', () => {
        const baseCss = fs.readFileSync(
            path.resolve(__dirname, '../styles/base.css'),
            'utf8'
        );
        expect(baseCss).toMatch(
            /\.request-list div\.rate-pending_component \.rate-buttons[\s\S]*display:\s*flex/
        );
        expect(baseCss).toMatch(
            /\.request-list div\.rate-pending_component \.rate-buttons[\s\S]*gap:\s*0\.6em/
        );
        expect(baseCss).toContain('.rate-neutral.active');
        expect(baseCss).toContain('background-color: #d8d8d8');
    });
});
