import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const viewPath = path.resolve(__dirname, 'SupportFeedbackTab.vue');
const source = fs.readFileSync(viewPath, 'utf8');

describe('SupportFeedbackTab view', () => {
    it('renders a right-edge help tab that opens the support modal', () => {
        expect(source).toContain('shouldShowSupportFeedbackTab');
        expect(source).toContain('SupportFeedbackModal');
        expect(source).toContain('class="support-feedback-tab"');
        expect(source).toContain(":aria-label=\"$t('pestanaFeedback')\"");
        expect(source).toContain("$t('pestanaFeedback')");
        expect(source).toContain('v-if="visible"');
        expect(source).toContain(':visible="showModal"');
    });

    it('uses Interbus-style vertical tab positioning', () => {
        expect(source).toContain('position: fixed');
        expect(source).toContain('right: 0');
        expect(source).toContain('writing-mode: vertical-rl');
        expect(source).toContain('text-transform: uppercase');
        expect(source).toContain('var(--ds-action, #1e5f9e)');
        expect(source).toContain('z-index: 1000');
        expect(source).toContain('top: 45%');
    });
});
