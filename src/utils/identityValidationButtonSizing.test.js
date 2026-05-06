import { describe, expect, it } from 'vitest';
import { getIdentityValidationButtonSizingStyle } from './identityValidationButtonSizing.js';

describe('getIdentityValidationButtonSizingStyle', () => {
    it('returns wrap-safe style rules for long button labels', () => {
        expect(getIdentityValidationButtonSizingStyle()).toEqual({
            whiteSpace: 'normal',
            overflowWrap: 'anywhere',
            wordBreak: 'break-word',
            textAlign: 'center',
            height: 'auto'
        });
    });
});
