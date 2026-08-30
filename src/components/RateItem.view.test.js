import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const viewPath = path.resolve(__dirname, 'RateItem.vue');
const viewSource = fs.readFileSync(viewPath, 'utf8');

describe('RateItem.vue neutral ratings', () => {
    it('displays positive, neutral, and negative rating labels and icons', () => {
        expect(viewSource).toContain('isPositiveRating');
        expect(viewSource).toContain('isNeutralRating');
        expect(viewSource).toContain('isNegativeRating');
        expect(viewSource).toContain('rateItemNeutral');
        expect(viewSource).toContain('rate-neutral-icon');
    });
});

describe('RateItem.vue profile links', () => {
    it('links rating and reference author names to their profile', () => {
        expect(viewSource).toContain('authorProfileRoute');
        expect(viewSource).toContain('rate-item-author-link');
        expect(viewSource).toContain("name: 'profile'");
        expect(viewSource).toContain('userProfile: this.rate.from');
    });

    it('labels the reply toggle with Responder i18n', () => {
        expect(viewSource).toContain("$t('responder')");
        expect(viewSource).toMatch(
            /canReply[\s\S]*\$t\('responder'\)[\s\S]*fa-reply|canReply[\s\S]*fa-reply[\s\S]*\$t\('responder'\)/
        );
    });
});

describe('RateItem.vue reference replies', () => {
    it('shows an existing reply even when the item is a reference', () => {
        expect(viewSource).not.toContain('!notReply && rate.reply_comment');
        expect(viewSource).toContain('v-if="rate.reply_comment"');
    });

    it('shows the reply toggle on references in the default theme', () => {
        expect(viewSource).toMatch(
            /rate\.created_at[\s\S]*rate-item-reply-toggle|rate-item-reply-toggle[\s\S]*rate\.created_at/
        );
    });

    it('posts a reference reply instead of a rating reply', () => {
        expect(viewSource).toContain('replyReference');
        expect(viewSource).toMatch(/notReply[\s\S]*replyReference|replyReference[\s\S]*notReply/);
    });

    it('labels the reference reply composer', () => {
        const i18nSource = fs.readFileSync(
            path.resolve(__dirname, '../language/i18n.js'),
            'utf8'
        );
        expect(viewSource).toContain('rateItemResponderALaReferencia');
        expect(i18nSource).toContain(
            "rateItemResponderALaReferencia: 'Responder a la referencia'"
        );
        expect(i18nSource).toContain(
            "rateItemResponderALaReferencia: 'Reply to reference'"
        );
    });
});
