import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const viewPath = path.resolve(__dirname, 'AdminMpRejectedValidationDetail.vue');
const viewSource = fs.readFileSync(viewPath, 'utf8');

describe('AdminMpRejectedValidationDetail view', () => {
    it('shows support tickets warning when user has associated tickets', () => {
        expect(viewSource).toContain('AdminUserSupportTicketsWarning');
        expect(viewSource).toContain(':user-id="item.user_id"');
        expect(viewSource).toContain(':support-tickets-count="item.support_tickets_count || 0"');
    });

    it('shows user name linked to admin profile with public profile link in parentheses', () => {
        expect(viewSource).toContain('AdminReviewSubjectUserLine');
        expect(viewSource).toContain('label-key="nombre"');
        expect(viewSource).toContain(':user-id="item.user_id"');
        expect(viewSource).toContain(':user-name="item.user_name"');
    });
});
