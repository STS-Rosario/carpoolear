import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const viewPath = path.resolve(__dirname, 'TicketNew.vue');
const source = fs.readFileSync(viewPath, 'utf8');

describe('TicketNew view', () => {
    it('uses shared ticket type options with account recovery default', () => {
        expect(source).toContain("from '../../utils/supportTicketTypeOptions'");
        expect(source).toContain('DEFAULT_USER_TICKET_TYPE');
        expect(source).toContain('USER_TICKET_TYPE_OPTIONS');
        expect(source).toContain('USER_TICKET_TYPE_VALUES');
    });

    it('appends support info to ticket messages', () => {
        expect(source).toContain("from '../../utils/supportInfo'");
        expect(source).toContain('appendSupportInfoToMessage');
        expect(source).toContain('fetchSupportInfoSnapshot');
    });
});
