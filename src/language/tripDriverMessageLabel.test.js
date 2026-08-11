import { describe, expect, it } from 'vitest';
import messages from './i18n';

describe('trip detail driver message label', () => {
    it('uses Mensaje de quien conduce instead of Mensaje del conductor', () => {
        expect(messages.arg.tripDetailDriverMessage).toBe(
            'Mensaje de quien conduce'
        );
        expect(messages.arg.tripDetailDriverMessage).not.toBe(
            'Mensaje del conductor'
        );
    });
});
