import { describe, expect, it } from 'vitest';
import { rememberMaxContributionWarning } from './maxContributionWarningState.js';

describe('rememberMaxContributionWarning', () => {
    it('returns true forever after first max contribution exceedance', () => {
        expect(
            rememberMaxContributionWarning({
                hasBeenShown: false,
                hasExceededMaxContribution: false
            })
        ).toBe(false);

        expect(
            rememberMaxContributionWarning({
                hasBeenShown: false,
                hasExceededMaxContribution: true
            })
        ).toBe(true);

        expect(
            rememberMaxContributionWarning({
                hasBeenShown: true,
                hasExceededMaxContribution: false
            })
        ).toBe(true);
    });
});
