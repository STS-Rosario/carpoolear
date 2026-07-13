import { describe, expect, it } from 'vitest';
import {
    MP_BOTH_MISMATCH_PREVIEW_QUERY,
    buildIdentityValidationMpBothMismatchPreviewUrl
} from './identityValidationMpRejectionPreview.js';

describe('identityValidationMpRejectionPreview', () => {
    it('exports sample both_mismatch query params for local preview', () => {
        expect(MP_BOTH_MISMATCH_PREVIEW_QUERY).toEqual({
            result: 'both_mismatch',
            user_name: 'Juan Pérez',
            mp_name: 'María García',
            user_dni: '30123456',
            mp_dni: '30999999'
        });
    });

    it('builds hash-router preview path with mismatch query string', () => {
        expect(buildIdentityValidationMpBothMismatchPreviewUrl()).toBe(
            '/identity-validation?result=both_mismatch&user_name=Juan+P%C3%A9rez&mp_name=Mar%C3%ADa+Garc%C3%ADa&user_dni=30123456&mp_dni=30999999'
        );
    });

    it('builds full dev preview url when base origin is provided', () => {
        expect(
            buildIdentityValidationMpBothMismatchPreviewUrl({
                origin: 'http://localhost:8080',
                hashPrefix: '#'
            })
        ).toBe(
            'http://localhost:8080/#/identity-validation?result=both_mismatch&user_name=Juan+P%C3%A9rez&mp_name=Mar%C3%ADa+Garc%C3%ADa&user_dni=30123456&mp_dni=30999999'
        );
    });
});
