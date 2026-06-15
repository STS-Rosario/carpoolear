import { describe, expect, it } from 'vitest';
import messages from './i18n';

const CHANGELOG_MODAL_LABELS = {
    arg: {
        changelogModalViewPrevious: 'Ver cambios anteriores'
    },
    chl: {
        changelogModalViewPrevious: 'Ver cambios anteriores'
    },
    en: {
        changelogModalViewPrevious: 'View previous changes'
    }
};

describe('changelog modal labels (i18n)', () => {
    it.each(Object.entries(CHANGELOG_MODAL_LABELS))(
        '%s locale defines the splash link to the full changelog',
        (locale, expected) => {
            Object.entries(expected).forEach(([key, label]) => {
                expect(messages[locale][key]).toBe(label);
            });
        }
    );
});
