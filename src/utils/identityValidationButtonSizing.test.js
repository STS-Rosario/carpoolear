import { describe, expect, it } from 'vitest';
import {
    getIdentityValidationButtonSizingStyle,
    IDENTITY_VALIDATION_BUTTON_SIZING_STYLE
} from './identityValidationButtonSizing.js';

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

    it('returns shared frozen style object', () => {
        expect(getIdentityValidationButtonSizingStyle()).toBe(
            IDENTITY_VALIDATION_BUTTON_SIZING_STYLE
        );
    });
});
