import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const viewPath = path.resolve(__dirname, 'AdminSupportTicketDetail.vue');
const viewSource = fs.readFileSync(viewPath, 'utf8');

describe('AdminSupportTicketDetail view', () => {
    it('shows a back link to admin tickets list', () => {
        expect(viewSource).toContain("{{ $t('volverListaTickets') }}");
        expect(viewSource).toContain("name: 'admin-support-tickets'");
    });

    it('shows translated, color-coded status and priority', () => {
        expect(viewSource).toContain('statusLabel(ticket.status)');
        expect(viewSource).toContain('priorityLabel(ticket.priority)');
        expect(viewSource).toContain(':class="statusClass(ticket.status)"');
        expect(viewSource).toContain(':class="priorityClass(ticket.priority)"');
        expect(viewSource).toContain('ticket-status-label');
        expect(viewSource).toContain('ticket-priority-label');
    });

    it('links non-admin reply authors to the admin user profile', () => {
        expect(viewSource).toContain('replyAuthorLabel(reply)');
        expect(viewSource).toContain('userAdminProfileRoute()');
        expect(viewSource).toContain('getAdminUserProfileRoute');
        expect(viewSource).not.toContain("name: 'profile'");
        expect(viewSource).not.toContain("{{ $t('verPerfilEnAdmin') }}");
    });

    it('shows Carpoolear team plus admin name and id for staff replies', () => {
        expect(viewSource).toContain('adminReplyAuthorLabel(reply)');
        expect(viewSource).toContain('{{ adminReplyAuthorLabel(reply) }}');
        expect(viewSource).toContain('equipoCarpoolearAutorAdmin');
    });

    it('shows reply metadata row with relative date and full date tooltip', () => {
        expect(viewSource).toContain('reply-meta-row');
        expect(viewSource).toContain('reply-meta-date');
        expect(viewSource).toContain('relativeDate(reply.created_at)');
        expect(viewSource).toContain(':title="fullDate(reply.created_at)"');
    });

    it('shows admin reply title and spacing classes around editor and actions', () => {
        expect(viewSource).toContain("{{ $t('respuestaCarpoolear') }}");
        expect(viewSource).toContain('admin-reply-header');
        expect(viewSource).toContain("{{ $t('responderConPlantilla') }}");
        expect(viewSource).toContain('admin-reply-box');
        expect(viewSource).toContain('reply-actions');
        expect(viewSource).toContain('reply-actions-left');
        expect(viewSource).toContain('reply-actions-right');
        expect(viewSource).toContain('reply-action-btn');
        expect(viewSource).toContain('respuestaEnviada');
        expect(viewSource).toContain('.then(() => this.refresh())');
    });

    it('shows toast feedback when saving internal notes', () => {
        expect(viewSource).toContain('saveInternalNote()');
        expect(viewSource).toContain('notaInternaGuardada');
        expect(viewSource).toContain("dialogs.message(this.$t('notaInternaGuardada')");
        expect(viewSource).toContain("dialogs.message(this.$t('errorGuardandoNotaInterna')");
    });

    it('disables reply submit while sending and shows Enviando label', () => {
        expect(viewSource).toContain('replySubmitting');
        expect(viewSource).toContain(':disabled="replySubmitting"');
        expect(viewSource).toContain("$t('enviando')");
        expect(viewSource).toContain("$t('responder')");
    });

    it('blocks duplicate reply bodies against existing thread messages', () => {
        expect(viewSource).toContain('supportTicketReplyDuplicate');
        expect(viewSource).toContain('ticketRespuestaDuplicada');
        expect(viewSource).toContain('isDuplicateReplyApiError');
    });

    it('interpolates ticket user variables before sending admin reply', () => {
        expect(viewSource).toContain('interpolateSupportTemplateVariables');
        expect(viewSource).toContain('adminReply(this.id');
    });

    it('can append interpolated template markdown into the reply editor', () => {
        expect(viewSource).toContain('appendInterpolatedTemplateToReply');
        expect(viewSource).toContain("invoke('getMarkdown')");
        expect(viewSource).toContain('replyEditorInitialValue = current + sep + chunk');
        expect(viewSource).toContain('replyEditorKey += 1');
        expect(viewSource).toContain(':key="replyEditorKey"');
        expect(viewSource).toContain(':initial-value="replyEditorInitialValue"');
    });

    it('offers reply template modal with search and pick handler', () => {
        expect(viewSource).toContain("{{ $t('plantillasModalTitulo') }}");
        expect(viewSource).toContain(":placeholder=\"$t('buscarPlantillasPlaceholder')\"");
        expect(viewSource).toContain('filteredReplyTemplates');
        expect(viewSource).toContain('pickReplyTemplate');
        expect(viewSource).toContain('openReplyTemplateModal');
    });

    it('lets admins click template name to append body', () => {
        expect(viewSource).toContain('reply-template-modal-pick');
        expect(viewSource).toContain('@click="pickReplyTemplate(t)"');
    });

    it('shows reopen only for closed tickets and hides close when already closed', () => {
        expect(viewSource).toContain('v-if="showReopenTicketButton"');
        expect(viewSource).toContain('v-if="showCloseTicketButton"');
        expect(viewSource).toContain('isTicketClosed()');
        expect(viewSource).toContain("return this.ticket && this.ticket.status === 'Cerrado'");
        expect(viewSource).toContain('return this.ticket && !this.isTicketClosed');
    });

    it('resets markdown editor, initialValue, key, and attachments after sending an admin reply', () => {
        expect(viewSource).toContain('this.replyEditorInitialValue =');
        expect(viewSource).toContain('replyEditorKey');
        expect(viewSource).toContain('this.attachments = []');
        expect(viewSource).toContain('attachmentInput');
    });

    it('shows success and error snackbars when resolving a ticket', () => {
        expect(viewSource).toContain('ticketMarcadoResuelto');
        expect(viewSource).toContain('errorMarcandoResuelto');
        expect(viewSource).toContain("dialogs.message(this.$t('ticketMarcadoResuelto')");
        expect(viewSource).toContain("dialogs.message(this.$t('errorMarcandoResuelto')");
    });

    it('hides reply composer when ticket is resolved or closed', () => {
        expect(viewSource).toContain('v-if="showReplyForm"');
        expect(viewSource).toContain('isTicketResolved');
        expect(viewSource).toContain('isReplyBlockedByOtherAdminAssignment');
    });

    it('hides reply composer when ticket is assigned to another admin', () => {
        expect(viewSource).toContain('isReplyBlockedByOtherAdminAssignment(this.ticket, this.currentAdminId)');
    });

    it('shows warning banner when ticket is assigned to another admin', () => {
        expect(viewSource).toContain('ticket-assigned-warning');
        expect(viewSource).toContain('alert-warning');
        expect(viewSource).toContain('ticketAsignadoAOtroAdmin');
        expect(viewSource).toContain('showAssignedToOtherAdmin');
    });

    it('places assign and unassign actions at the top with distinct AppButton variants', () => {
        const assignmentTop = viewSource.indexOf('ticket-assignment-actions');
        const replyBox = viewSource.indexOf('admin-reply-box');
        const categoryField = viewSource.indexOf('admin-support-ticket-detail__category-select');
        expect(assignmentTop).toBeGreaterThan(-1);
        expect(assignmentTop).toBeLessThan(categoryField);
        expect(assignmentTop).toBeLessThan(replyBox);
        expect(viewSource).toMatch(/showAssignTicketButton[\s\S]*variant="secondary"/);
        expect(viewSource).toMatch(/showUnassignTicketButton[\s\S]*variant="warning"/);
    });

    it('uses success and danger AppButtons for resolve and close actions', () => {
        expect(viewSource).toMatch(/showResolveTicketButton[\s\S]*variant="success"/);
        expect(viewSource).toMatch(/showCloseTicketButton[\s\S]*variant="danger"/);
    });

    it('uses secondary AppButton for mark needs review action', () => {
        expect(viewSource).toMatch(/showMarkNeedsReviewButton[\s\S]*variant="secondary"/);
    });

    it('uses AppField, AppTextarea, AppInput and AppButton for admin form controls', () => {
        expect(viewSource).toContain("import AppButton from '../ui/AppButton.vue'");
        expect(viewSource).toContain("import AppField from '../ui/AppField.vue'");
        expect(viewSource).toContain("import AppInput from '../ui/AppInput.vue'");
        expect(viewSource).toContain("import AppTextarea from '../ui/AppTextarea.vue'");
        expect(viewSource).toMatch(
            /<AppField[\s\S]*?categoriaTicket[\s\S]*?<select[\s\S]*?v-model="ticketType"[\s\S]*?admin-support-ticket-detail__category-select/
        );
        expect(viewSource).toMatch(/<AppTextarea[\s\S]*?v-model="internalNote"[\s\S]*?notaInterna/);
        expect(viewSource).toMatch(
            /<AppInput[\s\S]*?v-model="replyTemplateSearch"[\s\S]*?buscarPlantillasPlaceholder/
        );
        expect(viewSource).toMatch(
            /<AppButton[\s\S]*?variant="primary"[\s\S]*?sendReply[\s\S]*?responder/
        );
        expect(viewSource).not.toContain('form-control');
        expect(viewSource).not.toContain('btn btn-');
    });

    it('toggles resolve and unresolve actions', () => {
        expect(viewSource).toContain('showResolveTicketButton');
        expect(viewSource).toContain('showUnresolveTicketButton');
        expect(viewSource).toContain('unresolveTicket');
        expect(viewSource).toContain('adminUnresolve');
        expect(viewSource).toContain("{{ $t('marcarComoNoResuelto') }}");
        expect(viewSource).toContain('ticketMarcadoNoResuelto');
    });

    it('shows success and error snackbars when closing a ticket', () => {
        expect(viewSource).toContain('ticketCerrado');
        expect(viewSource).toContain('errorCerrandoTicket');
        expect(viewSource).toContain("dialogs.message(this.$t('ticketCerrado')");
        expect(viewSource).toContain("dialogs.message(this.$t('errorCerrandoTicket')");
    });

    it('shows success and error snackbars when reopening a ticket', () => {
        expect(viewSource).toContain('ticketReabierto');
        expect(viewSource).toContain('errorReabriendoTicket');
        expect(viewSource).toContain("dialogs.message(this.$t('ticketReabierto')");
        expect(viewSource).toContain("dialogs.message(this.$t('errorReabriendoTicket')");
    });

    it('renders reply attachments and purge-all-images action for admins', () => {
        expect(viewSource).toContain('reply-attachments');
        expect(viewSource).toContain('loadReplyAttachmentUrls');
        expect(viewSource).toContain('purgeAllAttachments');
        expect(viewSource).toContain("{{ $t('eliminarTodasLasImagenes') }}");
        expect(viewSource).toContain('fetchSupportTicketAttachmentBlob');
    });

    it('opens reply attachment thumbnails in a new tab when clicked', () => {
        expect(viewSource).toContain('openBlobImageInNewTab');
        expect(viewSource).toContain('@click="openBlobImageInNewTab(attachmentBlobUrls[attachment.id])"');
        expect(viewSource).toContain('ticket-attachment-thumb clickable-img');
        expect(viewSource).toContain('.clickable-img {\n    cursor: pointer;\n}');
    });

    it('toggles mark needs review action for open and needs-review tickets', () => {
        expect(viewSource).toContain('markNeedsReviewTicket');
        expect(viewSource).toContain('adminMarkNeedsReview');
        expect(viewSource).toContain('showMarkNeedsReviewButton');
        expect(viewSource).toContain('isTicketNeedsReview');
        expect(viewSource).toContain('markNeedsReviewButtonLabelKey');
        expect(viewSource).toContain("'quitarNecesitaRevision'");
        expect(viewSource).toContain("'marcarNecesitaRevision'");
        expect(viewSource).toContain('confirmarQuitarNecesitaRevision');
        expect(viewSource).toContain('ticketQuitadoNecesitaRevision');
    });

    it('lets admins change ticket category and save it', () => {
        expect(viewSource).toContain(':label="$t(\'categoriaTicket\')"');
        expect(viewSource).toContain('ticketTypeOptions');
        expect(viewSource).toContain('v-model="ticketType"');
        expect(viewSource).toContain('saveTicketCategory');
        expect(viewSource).toContain('adminSetType');
        expect(viewSource).toContain('categoriaTicketGuardada');
        expect(viewSource).toContain('errorGuardandoCategoriaTicket');
    });

    it('uses a taller, vertically resizable admin reply editor', () => {
        expect(viewSource).toContain('supportTicketReplyEditor');
        expect(viewSource).toContain(':height="supportTicketReplyEditorHeight"');
        expect(viewSource).toContain('resizable');
        expect(viewSource).toContain(':class="supportTicketReplyEditorClass"');
        expect(viewSource).not.toContain('height="140px"');
    });

    it('shows assign and unassign ticket actions for admins', () => {
        expect(viewSource).toContain('showAssignTicketButton');
        expect(viewSource).toContain('showUnassignTicketButton');
        expect(viewSource).toContain('assignTicketToMe');
        expect(viewSource).toContain('unassignTicketFromMe');
        expect(viewSource).toContain("{{ $t('asignarmeTicket') }}");
        expect(viewSource).toContain("{{ $t('desasignarmeTicket') }}");
        expect(viewSource).toContain('adminAssignMe');
        expect(viewSource).toContain('adminUnassignMe');
        expect(viewSource).toContain('shouldShowAssignTicketButton');
        expect(viewSource).toContain('isAssignTicketDisabled');
        expect(viewSource).not.toContain('ticket-assigned-to-other text-muted');
    });
});
