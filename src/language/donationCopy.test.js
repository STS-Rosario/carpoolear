import { describe, expect, it } from 'vitest';
import messages from './i18n';

describe('donation copy wording', () => {
    it('uses aportar in porQueDonar for arg', () => {
        expect(messages.arg.porQueDonar).toBe('Por qué aportar a Carpoolear');
    });
});
