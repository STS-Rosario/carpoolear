import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const viewPath = path.resolve(__dirname, 'IdentityValidation.vue');
const choiceCardsPath = path.resolve(
    __dirname,
    'IdentityValidationChoiceCards.vue'
);
const mpConfirmModalPath = path.resolve(
    __dirname,
    '../IdentityValidationMercadoPagoConfirmModal.vue'
);
const viewSource =
    fs.readFileSync(viewPath, 'utf8') +
    fs.readFileSync(choiceCardsPath, 'utf8') +
    fs.readFileSync(mpConfirmModalPath, 'utf8');

describe('IdentityValidation paid awaiting photos', () => {
    it('shows esperando fotos status before documents are uploaded', () => {
        expect(viewSource).toContain('manual-status-upload-block__status');
        expect(viewSource).toContain("{{ $t('estadoEsperandoFotos') }}");
    });
});

describe('IdentityValidation page card', () => {
    it('wraps content in a white card with a desktop-only page title inside', () => {
        expect(viewSource).toContain('identity-validation-page__card');
        expect(viewSource).toContain('identity-validation-page__heading');
        expect(viewSource).toMatch(
            /identity-validation-page__heading[^>]*hidden-xs[\s\S]*\$t\('validarIdentidad'\)/
        );
    });

    it('renders the in-card account verification title once and hides it on mobile', () => {
        const titleUsages = viewSource.match(/\$t\('validarIdentidad'\)/g) || [];
        expect(titleUsages).toHaveLength(1);
        expect(viewSource).not.toMatch(
            /identity-validation-title[\s\S]{0,80}\$t\('validarIdentidad'\)/
        );
        expect(viewSource).not.toContain("$t('identidadModalTitle')");
    });
});

describe('IdentityValidation auth state after success', () => {
    it('syncs the authenticated user after successful account verification', () => {
        expect(viewSource).toContain(
            'syncAuthUserAfterIdentityVerificationSuccess'
        );
        expect(viewSource).toContain("import { mapState, mapActions } from 'pinia'");
        expect(viewSource).toContain("mapActions(useAuthStore, ['setUser', 'fetchUser'])");
        expect(viewSource).toMatch(
            /mounted\(\)\s*\{[\s\S]*syncAuthUserAfterIdentityVerificationSuccess/
        );
    });
});

describe('IdentityValidation admin review note contexts', () => {
    it('uses approval note helper in success banner', () => {
        expect(viewSource).toContain('displayableManualApprovalReviewNote');
        expect(viewSource).toContain('manualApprovalReviewNoteLabelKey');
    });

    it('uses rejection note helper only in rejection notice', () => {
        expect(viewSource).toContain('displayableManualRejectionReviewNote');
        expect(viewSource).toContain('manualRejectionReviewNoteLabelKey');
        expect(viewSource).not.toContain(':note="displayableManualReviewNote"');
    });
});

describe('IdentityValidation rejected manual verification', () => {
    it('passes the current user into manual rejection choice-card helper', () => {
        expect(viewSource).toContain('user: this.user');
    });

    it('shows retry prompt and choice cards when manual verification was rejected', () => {
        expect(viewSource).toContain('showManualRejectedWithChoiceCards');
        expect(viewSource).toContain('identity-validation-rejected-flow');
        expect(viewSource).toContain("$t('identityValidationRetryPrompt')");
        expect(viewSource).toContain('identity-validation-cards');
        expect(viewSource).toContain("$t('validarConMercadoPago')");
        expect(viewSource).toContain("$t('solicitarVerificacionManual')");
    });

    it('does not render standalone in-flow review note when manual verification was rejected', () => {
        expect(viewSource).not.toContain('in-flow');
    });
});

describe('IdentityValidation rejection warnings', () => {
    it('shows mismatch support warning with warning icon in MP mismatch alert', () => {
        expect(viewSource).toContain('<div class="alert alert-warning" v-if="mismatchDetails">');
        expect(viewSource).toContain('identity-validation-mismatch-support-warning');
        expect(viewSource).toContain('$t(mismatchSupportWarningParts.leadKey)');
        expect(viewSource).toContain('fa fa-exclamation-triangle');
    });

    it('maps MP mismatch result to support warning key', () => {
        expect(viewSource).toContain('mismatchSupportWarningKey');
        expect(viewSource).toContain('this.resultMessage');
    });

    it('renders mismatch support warning after mismatch details rows', () => {
        const warningIndex = viewSource.indexOf('identity-validation-mismatch-support-warning');
        const detailsIndex = viewSource.indexOf("{{ $t('nombreEnMercadoPago') }}:");
        expect(warningIndex).toBeGreaterThan(detailsIndex);
    });

    it('links mismatch support warning to ticket creation route', () => {
        expect(viewSource).toContain(":to=\"{ name: 'ticket-new' }\"");
        expect(viewSource).toContain('identityValidationMismatchSupportTicketCta');
    });

    it('interpolates mismatch support warning text around ticket CTA link', () => {
        expect(viewSource).toContain('mismatchSupportWarningParts');
        expect(viewSource).toContain('$t(mismatchSupportWarningParts.leadKey)');
        expect(viewSource).toContain('$t(mismatchSupportWarningParts.tailKey)');
    });

    it('renders two-paragraph both-mismatch warning with ticket link in second paragraph', () => {
        expect(viewSource).toContain("mismatchSupportWarningParts.layout === 'twoParagraph'");
        expect(viewSource).toContain('identity-validation-mismatch-support-warning--stacked');
        expect(viewSource).toContain('identity-validation-mismatch-support-warning__paragraph');
        expect(viewSource).toContain('$t(mismatchSupportWarningParts.paragraph1Key)');
        expect(viewSource).toContain('$t(mismatchSupportWarningParts.paragraph2LeadKey)');
        expect(viewSource).toContain('$t(mismatchSupportWarningParts.paragraph2TailKey)');
    });

    it('shows warning icon and translated mismatch warning placeholder in rejected flow', () => {
        expect(viewSource).toContain('identity-validation-rejection-notice__support-warning');
        expect(viewSource).toContain('fa fa-exclamation-triangle');
        expect(viewSource).toContain('$t(manualRejectionSupportWarningKey)');
    });

    it('uses computed warning key helper in rejected flow', () => {
        expect(viewSource).toContain('manualRejectionSupportWarningKey');
    });

    it('uses manual reject reason to choose support warning copy', () => {
        expect(viewSource).toContain('manualStatus.reject_reason');
    });

    it('links to manual upload when resubmit without payment is available', () => {
        expect(viewSource).toContain('canManualResubmitWithoutPayment');
        expect(viewSource).toContain('manualValidationResubmitRoute');
        expect(viewSource).toContain('identityValidationRejectionResubmitDocumentsCta');
    });
});

describe('IdentityValidation Mercado Pago ownership warning', () => {
    it('lists that MP integration can be removed after verifying', () => {
        expect(viewSource).toContain("$t('identidadModalAutoPuedeEliminarMp')");
        const autoInstantBadge = viewSource.indexOf(
            "$t('identityValidationAutoBadgeInstant')"
        );
        const puedeEliminar = viewSource.indexOf(
            "$t('identidadModalAutoPuedeEliminarMp')"
        );
        expect(autoInstantBadge).toBeGreaterThan(-1);
        expect(puedeEliminar).toBeGreaterThan(autoInstantBadge);
    });

    it('shows MP apps disconnect hint with link on MP verification success', () => {
        expect(viewSource).toContain('showMpIntegrationDisconnectHint');
        expect(viewSource).toContain('shouldShowMercadoPagoIntegrationDisconnectHint');
        expect(viewSource).toContain('MERCADO_PAGO_MY_APPS_URL');
        expect(viewSource).toContain(
            "$t('identityVerificationSuccessMpDisconnectLead')"
        );
        expect(viewSource).toContain(
            "$t('identityVerificationSuccessMpDisconnectLink')"
        );
        expect(viewSource).toContain(
            "$t('identityVerificationSuccessMpDisconnectTail')"
        );
        expect(viewSource).toContain(':href="mercadoPagoMyAppsUrl"');
    });

    it('shows manual MP disconnect instructions when disconnect hint is visible', () => {
        expect(viewSource).toContain(
            "$t('identityVerificationSuccessMpDisconnectManualInstructions')"
        );
        expect(viewSource).toContain(
            'identity-verification-success-banner__mp-disconnect-manual'
        );
        const disconnectTailIndex = viewSource.indexOf(
            "$t('identityVerificationSuccessMpDisconnectTail')"
        );
        const manualInstructionsIndex = viewSource.indexOf(
            "$t('identityVerificationSuccessMpDisconnectManualInstructions')"
        );
        expect(manualInstructionsIndex).toBeGreaterThan(disconnectTailIndex);
    });

    it('groups MP disconnect copy under a single visibility guard', () => {
        const templateStart = viewSource.indexOf(
            '<template v-if="showMpIntegrationDisconnectHint">'
        );
        const manualInstructionsIndex = viewSource.indexOf(
            "$t('identityVerificationSuccessMpDisconnectManualInstructions')"
        );
        const templateEnd = viewSource.indexOf(
            '</template>',
            templateStart
        );
        expect(templateStart).toBeGreaterThan(-1);
        expect(manualInstructionsIndex).toBeGreaterThan(templateStart);
        expect(manualInstructionsIndex).toBeLessThan(templateEnd);
    });

    it('shows ownership warning with profile edit link on pending manual switch', () => {
        expect(viewSource).toContain('identity-validation-mp-warning');
        expect(viewSource).toContain(
            "$t('identityValidationMercadoPagoOwnershipWarningPrefix')"
        );
        expect(viewSource).toContain(
            "$t('identityValidationMercadoPagoOwnershipWarningProfileLink')"
        );
        expect(viewSource).toContain(
            "$t('identityValidationMercadoPagoOwnershipWarningSuffix')"
        );
        expect(viewSource).toContain('@click.prevent="goToProfileEdit"');
    });

    it('renders ownership warning with profile edit link in all MP warning blocks', () => {
        const prefixOccurrences = (
            viewSource.match(
                /identityValidationMercadoPagoOwnershipWarningPrefix/g
            ) || []
        ).length;
        expect(prefixOccurrences).toBe(1);
    });
});

describe('IdentityValidation choice cards', () => {
    it('uses shared choice cards on the main and rejected verification flows', () => {
        const parentSource = fs.readFileSync(viewPath, 'utf8');
        expect(parentSource).toContain('IdentityValidationChoiceCards');
        expect(parentSource.match(/<IdentityValidationChoiceCards/g)).toHaveLength(2);
    });
    it('renders option cards with icon, title, and compact badges instead of bullet lists', () => {
        expect(viewSource).toContain('identity-validation-card-header');
        expect(viewSource).toContain('identity-validation-card-badge');
        expect(viewSource).toContain('fa-shield');
        expect(viewSource).toContain('fa-file-text-o');
        expect(viewSource).toContain("$t('identityValidationAutoBadgeFree')");
        expect(viewSource).toContain("$t('identityValidationAutoBadgeInstant')");
        expect(viewSource).toContain('formattedManualCost');
        expect(viewSource).toContain("$t('identityValidationManualBadgeTime')");
        expect(viewSource).not.toContain('identity-validation-card-bullets');
        expect(viewSource).not.toContain("$t('identityValidationCostLine'");
        expect(viewSource).not.toContain("$t('identityValidationTimeLine')");
        expect(viewSource).not.toContain("$t('identidadModalAutoGratis')");
        expect(viewSource).not.toContain("$t('identidadModalAutoInmediata')");
    });

    it('keeps two columns of option cards on desktop and stacks them on mobile', () => {
        expect(viewSource).toMatch(
            /\.identity-validation-cards \{[\s\S]*flex-direction:\s*column/
        );
        expect(viewSource).toMatch(
            /@media \(min-width: 768px\) \{[\s\S]*\.identity-validation-cards \{[\s\S]*flex-direction:\s*row/
        );
    });

    it('uses primary choice buttons without uppercase transform', () => {
        const cardsSource = fs.readFileSync(choiceCardsPath, 'utf8');
        expect(cardsSource).toMatch(
            /variant="primary"[\s\S]*\$t\('validarConMercadoPago'\)/
        );
        expect(cardsSource).toMatch(
            /variant="primary"[\s\S]*\$t\('solicitarVerificacionManual'\)/
        );
        expect(cardsSource).not.toMatch(
            /variant="secondary"[\s\S]*\$t\('solicitarVerificacionManual'\)/
        );
        expect(cardsSource).not.toMatch(
            /\.identity-validation-choice-cta \{[\s\S]*text-transform:\s*uppercase/
        );
    });
});

describe('IdentityValidation compact intro', () => {
    it('shows option B intro, details link, and two-options line without the old bullets', () => {
        expect(viewSource).toContain("$t('identityValidationPageIntro')");
        expect(viewSource).toContain("$t('identityValidationPageSummary')");
        expect(viewSource).toContain(
            "$t('identityValidationPageLearnMoreLink')"
        );
        expect(viewSource).toContain("$t('identityValidationPageTwoOptions')");
        expect(viewSource).toContain("name: 'verificacion_cuenta'");
        expect(viewSource).not.toContain(
            "$t('identityValidationPageIntroEstoPermite')"
        );
        expect(viewSource).not.toContain('identity-validation-bullets');
        expect(viewSource).not.toContain("$t('identityValidationPageBullet1')");
        expect(viewSource).not.toContain('identity-validation-once');
        expect(viewSource).not.toContain(
            'keypath="identityValidationTwoOptions"'
        );
    });

    it('places the details link after the summary and the two-options line after the link', () => {
        const summaryIndex = viewSource.indexOf(
            "$t('identityValidationPageSummary')"
        );
        const learnMoreIndex = viewSource.indexOf(
            "$t('identityValidationPageLearnMoreLink')"
        );
        const twoOptionsIndex = viewSource.indexOf(
            "$t('identityValidationPageTwoOptions')"
        );

        expect(summaryIndex).toBeGreaterThan(-1);
        expect(learnMoreIndex).toBeGreaterThan(summaryIndex);
        expect(twoOptionsIndex).toBeGreaterThan(learnMoreIndex);
    });
});

describe('IdentityValidation unpaid manual verification payment', () => {
    const pendingPaymentBlockStart = viewSource.indexOf(
        'manualStatus.has_submission && manualStatus.paid === false'
    );
    const payOptionsPath = path.resolve(__dirname, 'ManualIdentityValidationPayOptions.vue');
    const payOptionsSource = fs.readFileSync(payOptionsPath, 'utf8');

    it('uses shared manual payment options with MP and QR handlers', () => {
        expect(pendingPaymentBlockStart).toBeGreaterThan(-1);
        const pendingPaymentBlock = viewSource.slice(
            pendingPaymentBlockStart,
            pendingPaymentBlockStart + 1200
        );

        expect(pendingPaymentBlock).toContain('ManualIdentityValidationPayOptions');
        expect(pendingPaymentBlock).toContain(':qr-enabled="identityValidationManualQrEnabled"');
        expect(pendingPaymentBlock).toContain('@pay-mp="payManualValidation"');
        expect(pendingPaymentBlock).toContain('@pay-qr="createManualValidationQrOrderAndShow"');
        expect(pendingPaymentBlock).not.toContain("$t('pagarAhora')");
    });

    it('shows the same manual payment instructions as the dedicated manual page', () => {
        expect(payOptionsSource).toContain(
            "$t('manualValidationPayIntro1', { cost: costDisplay })"
        );
        expect(payOptionsSource).toContain("$t('manualValidationPayIntro2')");
        expect(payOptionsSource).toContain("$t('manualValidationPayListLead')");
        expect(payOptionsSource).toContain("$t('manualValidationPayBulletDni')");
        expect(payOptionsSource).toContain('manualValidationUploadWarningKey');
        expect(payOptionsSource).toContain("$t('manualValidationPayClosing')");
        expect(payOptionsSource).toContain("$t('manualValidationPagarMercadoPago')");
        expect(payOptionsSource).toContain("$t('pagarConQR')");
    });

    it('shows QR payment panel and polling flow for unpaid manual verification', () => {
        expect(viewSource).toContain('createManualIdentityValidationQrOrder');
        expect(viewSource).toContain("import QRCode from 'qrcode'");
        expect(viewSource).toContain('showQrPanel');
        expect(payOptionsSource).toContain("$t('escaneáConAppMercadoPago')");
        expect(payOptionsSource).toContain("$t('qrExpiraEn')");
        expect(viewSource).toContain('closeManualValidationQrPanel');
        expect(viewSource).toContain('startManualValidationQrPolling');
        expect(viewSource).toContain('stopManualValidationQrPolling');
        expect(viewSource).toContain('beforeUnmount');
    });
});

describe('IdentityValidation manual admin review note', () => {
    it('shows admin review note in success banner and rejection notice when present', () => {
        expect(viewSource).toContain('IdentityValidationAdminReviewNote');
        expect(viewSource).toContain('displayableManualApprovalReviewNote');
        expect(viewSource).toContain('displayableManualRejectionReviewNote');
        expect(viewSource).toContain('manualApprovalReviewNoteLabelKey');
        expect(viewSource).toContain('manualRejectionReviewNoteLabelKey');
        expect(viewSource).toContain('manualIdentityValidationReviewNote');
    });

    it('does not render review note only inside rejection notice markup', () => {
        expect(viewSource).not.toContain(
            'identity-validation-rejection-notice__note"'
        );
    });
});

describe('IdentityValidation closed manual after MercadoPago', () => {
    it('treats closed review status as terminal so pending notices are not shown', () => {
        expect(viewSource).toContain('isManualIdentityValidationTerminalStatus');
    });
});

describe('IdentityValidation Mercado Pago confirm modal', () => {
    it('opens a confirmation modal instead of starting OAuth from the choice card', () => {
        const parentSource = fs.readFileSync(viewPath, 'utf8');
        expect(parentSource).toContain('showMercadoPagoConfirmModal');
        expect(parentSource).toContain('openMercadoPagoConfirmModal');
        expect(parentSource).toContain('@choose-mp="openMercadoPagoConfirmModal"');
        expect(parentSource).not.toContain('@choose-mp="startMercadoPagoOAuth"');
    });

    it('shows ownership copy with continue, edit profile, and back actions', () => {
        expect(viewSource).toContain("$t('identityValidationMpConfirmLead')");
        expect(viewSource).toContain("$t('identityValidationMpConfirmName')");
        expect(viewSource).toContain(
            "$t('identityValidationMpConfirmContinue')"
        );
        expect(viewSource).toContain(
            "$t('identityValidationMpConfirmEditProfile')"
        );
        expect(viewSource).toContain("$t('volver')");
    });

    it('continues verification from the modal and can close it', () => {
        const parentSource = fs.readFileSync(viewPath, 'utf8');
        expect(parentSource).toContain('confirmMercadoPagoOAuth');
        expect(parentSource).toMatch(
            /confirmMercadoPagoOAuth\(\)\s*\{[\s\S]*showMercadoPagoConfirmModal\s*=\s*false[\s\S]*startMercadoPagoOAuth/
        );
        expect(parentSource).toContain('closeMercadoPagoConfirmModal');
    });

    it('does not keep the inline Mercado Pago ownership warning on choice cards', () => {
        const cardsSource = fs.readFileSync(choiceCardsPath, 'utf8');
        expect(cardsSource).not.toContain('identity-validation-mp-warning');
        expect(cardsSource).not.toContain(
            'identityValidationMercadoPagoOwnershipWarningPrefix'
        );
    });
});
