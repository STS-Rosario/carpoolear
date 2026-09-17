import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const viewPath = path.resolve(__dirname, 'AdminActionLogs.vue');
const viewSource = fs.readFileSync(viewPath, 'utf8');

describe('AdminActionLogs view', () => {
    it('loads action logs via AdminApi with admin, action, date and target filters', () => {
        expect(viewSource).toContain('getActionLogs');
        expect(viewSource).toContain('filterAdminUserId');
        expect(viewSource).toContain('filterAction');
        expect(viewSource).toContain('filterFrom');
        expect(viewSource).toContain('filterTo');
        expect(viewSource).toContain('filterTargetUserId');
        expect(viewSource).toContain('AdminPaginationBar');
        expect(viewSource).toContain("$t('adminNavActionLogs')");
    });
});
