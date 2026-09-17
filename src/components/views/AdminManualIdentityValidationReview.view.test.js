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

    it('labels closed review status as cerrado', () => {
        expect(viewSource).toContain("status === 'closed'");
        expect(viewSource).toContain('estadoCerrado');
    });

    it('confirms review actions before submitting', () => {
        expect(viewSource).toContain('confirmReview');
        expect(viewSource).toContain('@click="confirmReview(\'approve\')"');
        expect(viewSource).toContain('@click="confirmReview(\'pending\')"');
        expect(viewSource).toContain('@click="confirmReview(\'reject\')"');
        expect(viewSource).toContain('getReviewActionConfirmMessageKey');
        expect(viewSource).toContain('shouldProceedWithReviewAction');
    });

    it('confirms save actions before persisting changes', () => {
        expect(viewSource).toContain('confirmSavePrivateAdminNote');
        expect(viewSource).toContain('confirmSaveManualIdentityValidationState');
        expect(viewSource).toContain('getSavePrivateNoteConfirmMessageKey');
        expect(viewSource).toContain('getSaveStateConfirmMessageKey');
        expect(viewSource).toContain('shouldProceedWithConfirmedAction');
    });

    it('confirms purge before deleting photos', () => {
        expect(viewSource).toContain('confirmPurge');
        expect(viewSource).toContain('@click="confirmPurge"');
    });

    it('shows which admin took the review action with action-specific label', () => {
        expect(viewSource).toContain('shouldShowReviewAdminAction');
        expect(viewSource).toContain('getReviewActionAdminLabelKey');
        expect(viewSource).toContain('item.reviewed_by_name || $t(\'na\')');
        expect(viewSource).toContain('$t(\'el\')');
        expect(viewSource).toContain('formatDate(item.reviewed_at)');
    });

    it('requires a coded reject reason before rejecting', () => {
        expect(viewSource).toContain('MANUAL_IDENTITY_REJECT_REASONS');
        expect(viewSource).toContain('reviewRejectReason');
        expect(viewSource).toContain('isManualRejectReasonRequired');
        expect(viewSource).toContain('rejectReasonDocsIllegible');
        expect(viewSource).toContain('motivoRechazo');
        expect(viewSource).toContain('reviewManualIdentityValidation(this.id, action, note');
    });
});

const i18nPath = path.resolve(__dirname, '../../language/i18n.js');
const i18nSource = fs.readFileSync(i18nPath, 'utf8');

describe('AdminManualIdentityValidationReview i18n', () => {
    it('defines coded reject reasons in all locales', () => {
        expect(i18nSource).toContain("motivoRechazo: 'Motivo de rechazo'");
        expect(i18nSource).toContain("motivoRechazo: 'Rejection reason'");
        expect(i18nSource).toContain("rejectReasonDocsIllegible: 'Documentación ilegible'");
        expect(i18nSource).toContain("rejectReasonDocsIllegible: 'Illegible documents'");
        expect(i18nSource).toContain("rejectReasonSelfieMismatch: 'Selfie no coincide'");
        expect(i18nSource).toContain("rejectReasonSelfieMismatch: 'Selfie does not match'");
        expect(i18nSource).toContain("rejectReasonDocumentMismatch: 'Documento no coincide con el perfil'");
        expect(i18nSource).toContain("rejectReasonDocumentMismatch: 'Document does not match the profile'");
        expect(i18nSource).toContain("rejectReasonExpiredDocument: 'Documento vencido o inválido'");
        expect(i18nSource).toContain("rejectReasonExpiredDocument: 'Expired or invalid document'");
        expect(i18nSource).toContain("rejectReasonSuspectedFraud: 'Sospecha de fraude'");
        expect(i18nSource).toContain("rejectReasonSuspectedFraud: 'Suspected fraud'");
        expect(i18nSource).toContain("rejectReasonOther: 'Otro'");
        expect(i18nSource).toContain("rejectReasonOther: 'Other'");
        expect(i18nSource).toContain("seleccionarMotivoRechazo: 'Seleccioná un motivo'");
        expect(i18nSource).toContain("seleccionarMotivoRechazo: 'Select a reason'");
        expect(i18nSource).toContain("motivoRechazoRequerido: 'Debés seleccionar un motivo de rechazo'");
        expect(i18nSource).toContain("motivoRechazoRequerido: 'You must select a rejection reason'");
    });
});
