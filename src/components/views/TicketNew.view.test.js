import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const viewPath = path.resolve(__dirname, 'TicketNew.vue');
const source = fs.readFileSync(viewPath, 'utf8');

describe('TicketNew view', () => {
    it('defaults ticket type to account recovery', () => {
        expect(source).toMatch(/form:\s*\{[\s\S]*?type:\s*'account_recovery'/);
    });

    it('includes account recovery in category options and URL prefill', () => {
        expect(source).toContain("{ value: 'account_recovery', labelKey: 'ticketTypeAccountRecovery' }");
        expect(source).toContain("'account_recovery'");
    });
});
