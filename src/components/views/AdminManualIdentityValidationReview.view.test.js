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

    it('shows user name linked to admin profile with public profile link in parentheses', () => {
        expect(viewSource).toContain('AdminReviewSubjectUserLine');
        expect(viewSource).toContain('label-key="usuario"');
        expect(viewSource).toContain(':user-id="item.user_id"');
        expect(viewSource).toContain(':user-name="item.user_name"');
    });

    it('shows purged photos message only when images were deleted by admin', () => {
        expect(viewSource).toContain('shouldShowPurgedPhotosMessage');
        expect(viewSource).toContain('v-else-if="shouldShowPurgedPhotosMessage(item)"');
        expect(viewSource).toContain("{{ $t('fotosPurgadas') }}");
        expect(viewSource).not.toContain('v-else class="alert alert-info">{{ $t(\'fotosPurgadas\') }}');
    });

    it('shows editable review status and paid state with save wired to AdminApi', () => {
        expect(viewSource).toContain('admin-manual-identity-state-edit');
        expect(viewSource).toContain('editableReviewStatus');
        expect(viewSource).toContain('editablePaid');
        expect(viewSource).toContain('editablePhotosSubmitted');
        expect(viewSource).toContain('fotosEnviadas');
        expect(viewSource).toContain('saveManualIdentityValidationState');
        expect(viewSource).toContain('updateManualIdentityValidationState');
        expect(viewSource).toContain('hasManualIdentityValidationStateChanges');
    });

    it('confirms mark pending when request is already pending', () => {
        expect(viewSource).toContain('confirmReview');
        expect(viewSource).toContain('@click="confirmReview(\'pending\')"');
        expect(viewSource).toContain('confirmMarcarPendienteYaPendiente');
        expect(viewSource).toContain('shouldProceedWithReviewAction');
    });

    it('uses AppField borderless selects and AppTextarea for admin note and review comment', () => {
        expect(viewSource).toContain("import AppField from '../ui/AppField.vue'");
        expect(viewSource).toContain("import AppTextarea from '../ui/AppTextarea.vue'");
        expect(viewSource).toMatch(
            /<AppField[\s\S]*?pagado[\s\S]*?manual-identity-edit-paid[\s\S]*?<select/
        );
        expect(viewSource).toMatch(
            /<AppTextarea[\s\S]*?v-model="privateAdminNote"/
        );
        expect(viewSource).toMatch(
            /<AppTextarea[\s\S]*?v-model="reviewNote"/
        );
        expect(viewSource).not.toContain('class="form-control"');
    });

    it('uses AppButton variants for navigation, save, review, and purge actions', () => {
        expect(viewSource).toContain("import AppButton from '../ui/AppButton.vue'");
        expect(viewSource).toMatch(
            /<AppButton[\s\S]*?variant="secondary"[\s\S]*?admin-manual-identity-validations[\s\S]*?volver/
        );
        expect(viewSource).toMatch(
            /<AppButton[\s\S]*?variant="success"[\s\S]*?review\('approve'\)/
        );
        expect(viewSource).toMatch(
            /<AppButton[\s\S]*?variant="warning"[\s\S]*?confirmReview\('pending'\)/
        );
        expect(viewSource).toMatch(
            /<AppButton[\s\S]*?variant="danger"[\s\S]*?review\('reject'\)/
        );
        expect(viewSource).not.toContain('btn btn-success');
        expect(viewSource).not.toContain('btn btn-default');
    });
});
