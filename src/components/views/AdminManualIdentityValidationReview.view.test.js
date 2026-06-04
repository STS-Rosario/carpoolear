import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'path';

const viewPath = path.resolve(__dirname, 'AdminManualIdentityValidationReview.vue');
const viewSource = fs.readFileSync(viewPath, 'utf8');

describe('AdminManualIdentityValidationReview view', () => {
    it('shows private admin note field and save wired to AdminApi', () => {
        expect(viewSource).toContain('notaPrivadaSoloAdmins');
        expect(viewSource).toContain('privateAdminNote');
        expect(viewSource).toContain('savePrivateAdminNote');
        expect(viewSource).toContain('updateManualIdentityValidationPrivateNote');
        expect(viewSource).toContain('applyResponseItem');
    });

    it('warns admins that the review comment is visible to the user', () => {
        expect(viewSource).toContain('comentarioVisibleParaUsuario');
        expect(viewSource).toContain('identity-validation-review-comment-user-visible');
        expect(viewSource).toContain('alert alert-info');
        expect(viewSource).toContain('fa-info-circle');
    });

    it('shows support tickets warning when user has associated tickets', () => {
        expect(viewSource).toContain('AdminUserSupportTicketsWarning');
        expect(viewSource).toContain(':user-id="item.user_id"');
        expect(viewSource).toContain(':support-tickets-count="item.support_tickets_count || 0"');
    });
});
