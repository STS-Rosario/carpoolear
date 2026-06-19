import { describe, expect, it } from 'vitest';
import messages from './i18n';

describe('image upload size labels (i18n)', () => {
    it.each(['arg', 'en'])('%s locale defines single-file oversize error copy', (locale) => {
        expect(messages[locale].imageUploadTooLargeSingle).toContain('{fileLabel}');
        expect(messages[locale].imageUploadTooLargeSingle).toContain('{maxMb}');
    });

    it.each(['arg', 'en'])('%s locale defines multi-file oversize error copy', (locale) => {
        expect(messages[locale].imageUploadTooLargeMultiple).toContain('{fileLabels}');
        expect(messages[locale].imageUploadTooLargeMultiple).toContain('{maxMb}');
    });

    it.each(['arg', 'en'])('%s locale defines profile photo label for upload errors', (locale) => {
        expect(messages[locale].imageUploadProfilePhoto).toBeTruthy();
    });
});
