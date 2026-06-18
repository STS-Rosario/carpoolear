import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const i18nPath = path.resolve(__dirname, 'i18n.js');
const source = fs.readFileSync(i18nPath, 'utf8');

describe('admin dashboard i18n', () => {
    it('defines dashboard labels in all locales', () => {
        expect(source).toContain("adminNavTablero: 'Tablero'");
        expect(source).toContain("adminNavTablero: 'Dashboard'");
        expect(source).toContain("adminDashboardManualVerifications: 'Verificaciones manuales pendientes'");
        expect(source).toContain("adminDashboardSupportTickets: 'Pending support tickets'");
    });
});
