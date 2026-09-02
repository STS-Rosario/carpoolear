<template>
    <AdminLayout>
        <div class="row">
            <div class="col-md-22 col-md-offset-1">
                <AppButton
                    variant="secondary"
                    size="sm"
                    class="mb-2"
                    :to="{ name: 'admin-manual-identity-validations' }"
                >
                    {{ $t('volver') }}
                </AppButton>
                <div v-if="loading" class="text-center">
                    <img :src="$publicImg('loader.gif')" alt="" class="ajax-loader" />
                    <p>{{ $t('cargando') }}</p>
                </div>
                <div v-else-if="item" class="panel panel-default">
                    <div class="panel-heading">
                        <h3>{{ $t('revisarSolicitud') }} #{{ item.id }}</h3>
                    </div>
                    <div class="panel-body">
                        <AdminReviewSubjectUserLine
                            label-key="usuario"
                            :user-id="item.user_id"
                            :user-name="item.user_name"
                        />
                        <p><strong>{{ $t('doc') }} (DNI):</strong> {{ displayDniOrDash(item.user_nro_doc) }}</p>
                        <p><strong>{{ $t('fechaPago') }}:</strong> {{ item.paid_at ? formatDate(item.paid_at) : '-' }}</p>
                        <p><strong>{{ $t('fechaEnvio') }}:</strong> {{ item.submitted_at ? formatDate(item.submitted_at) : '-' }}</p>
                        <div class="admin-manual-identity-state-edit form-group">
                            <h4>{{ $t('adminManualIdentityEditState') }}</h4>
                            <p class="text-muted admin-manual-identity-state-edit-hint">
                                {{ $t('adminManualIdentityEditStateHint') }}
                            </p>
                            <AppField
                                :label="$t('pagado')"
                                label-for="manual-identity-edit-paid"
                            >
                                <select
                                    id="manual-identity-edit-paid"
                                    v-model="editablePaid"
                                    class="admin-page__select admin-manual-identity-state-edit-paid"
                                >
                                    <option :value="true">{{ $t('si') }}</option>
                                    <option :value="false">{{ $t('no') }}</option>
                                </select>
                            </AppField>
                            <AppField
                                :label="$t('fotosEnviadas')"
                                label-for="manual-identity-edit-photos-submitted"
                            >
                                <select
                                    id="manual-identity-edit-photos-submitted"
                                    v-model="editablePhotosSubmitted"
                                    class="admin-page__select admin-manual-identity-state-edit-photos-submitted"
                                >
                                    <option :value="true">{{ $t('si') }}</option>
                                    <option :value="false">{{ $t('no') }}</option>
                                </select>
                            </AppField>
                            <AppField
                                :label="$t('estado')"
                                label-for="manual-identity-edit-status"
                            >
                                <select
                                    id="manual-identity-edit-status"
                                    v-model="editableReviewStatus"
                                    class="admin-page__select admin-manual-identity-state-edit-status"
                                >
                                    <option
                                        v-for="option in reviewStatusOptions"
                                        :key="option.value"
                                        :value="option.value"
                                    >
                                        {{ $t(option.labelKey) }}
                                    </option>
                                </select>
                            </AppField>
                            <AppButton
                                variant="secondary"
                                size="sm"
                                class="admin-manual-identity-state-edit-save"
                                :disabled="!hasStateChanges || savingState"
                                :loading="savingState"
                                @click="saveManualIdentityValidationState"
                            >
                                <template v-if="savingState">{{ $t('guardando') }}</template>
                                <template v-else>{{ $t('guardar') }}</template>
                            </AppButton>
                            <p v-if="stateSaveError" class="text-danger admin-manual-identity-state-edit-error">
                                {{ stateSaveError }}
                            </p>
                        </div>
                        <AdminUserSupportTicketsWarning
                            v-if="item.user_id"
                            :user-id="item.user_id"
                            :support-tickets-count="item.support_tickets_count || 0"
                        />
                        <AppButton
                            v-if="item.user_id"
                            variant="secondary"
                            size="sm"
                            :to="{
                                name: 'admin-support-ticket-new',
                                query: {
                                    userId: item.user_id,
                                    userName: item.user_name,
                                    type: 'account_verification',
                                    subject: $t('ticketTypeAccountVerification')
                                }
                            }"
                        >
                            {{ $t('crearTicketSoporte') }}
                        </AppButton>
                        <p v-if="item.reviewed_at">
                            <strong>{{ getActionDateLabel(item.review_status) }}:</strong> {{ formatDate(item.reviewed_at) }}
                        </p>
                        <p v-if="item.reviewed_by_name">
                            <strong>{{ $t('revisadoPor') }}:</strong> {{ item.reviewed_by_name }}
                        </p>
                        <p v-if="item.review_note && item.review_note.trim()" class="review-note-display">
                            <strong>{{ $t('comentarioRevision') }}:</strong> {{ item.review_note }}
                        </p>

                        <div class="form-group private-admin-note-group">
                            <AppTextarea
                                v-model="privateAdminNote"
                                :label="$t('notaPrivadaSoloAdmins')"
                                :placeholder="$t('notaPrivadaSoloAdmins')"
                                :rows="3"
                            />
                            <AppButton
                                variant="secondary"
                                size="sm"
                                class="private-admin-note-save-btn"
                                :disabled="savingPrivateNote"
                                :loading="savingPrivateNote"
                                @click="savePrivateAdminNote"
                            >
                                <template v-if="savingPrivateNote">{{ $t('guardando') }}</template>
                                <template v-else>{{ $t('guardar') }}</template>
                            </AppButton>
                        </div>

                        <div v-if="item.has_images" class="images-section">
                            <h4>{{ $t('fotos') }}</h4>
                            <div class="row">
                                <div class="col-md-8">
                                    <p>{{ $t('frenteDocumento') }}</p>
                                    <img
                                        v-if="blobUrls.front"
                                        :src="blobUrls.front"
                                        class="img-thumbnail clickable-img"
                                        @click="showFullSize('front')"
                                        alt="Front"
                                    />
                                    <span v-else>{{ $t('cargando') }}...</span>
                                </div>
                                <div class="col-md-8">
                                    <p>{{ $t('dorsoDocumento') }}</p>
                                    <img
                                        v-if="blobUrls.back"
                                        :src="blobUrls.back"
                                        class="img-thumbnail clickable-img"
                                        @click="showFullSize('back')"
                                        alt="Back"
                                    />
                                    <span v-else>{{ $t('cargando') }}...</span>
                                </div>
                                <div class="col-md-8">
                                    <p>{{ $t('selfieDocumento') }}</p>
                                    <img
                                        v-if="blobUrls.selfie"
                                        :src="blobUrls.selfie"
                                        class="img-thumbnail clickable-img"
                                        @click="showFullSize('selfie')"
                                        alt="Selfie"
                                    />
                                    <span v-else>{{ $t('cargando') }}...</span>
                                </div>
                            </div>
                        </div>
                        <div v-else-if="shouldShowPurgedPhotosMessage(item)" class="alert alert-info">{{ $t('fotosPurgadas') }}</div>

                        <div v-if="item.paid" class="review-actions">
                            <h4>{{ $t('accion') }}</h4>
                            <div class="form-group">
                                <label>{{ $t('comentarioRevisar') }}</label>
                                <div
                                    class="alert alert-info identity-validation-review-comment-user-visible"
                                    role="status"
                                >
                                    <i class="fa fa-info-circle" aria-hidden="true"></i>
                                    {{ $t('comentarioVisibleParaUsuario') }}
                                </div>
                                <AppTextarea
                                    v-model="reviewNote"
                                    :placeholder="$t('comentarioRevisar')"
                                    :rows="3"
                                />
                            </div>
                            <div class="review-actions-buttons">
                                <AppButton
                                    variant="success"
                                    :disabled="submitting"
                                    :loading="submitting"
                                    @click="review('approve')"
                                >
                                    {{ $t('aprobar') }}
                                </AppButton>
                                <AppButton
                                    variant="warning"
                                    :disabled="!hasComment || submitting"
                                    :title="!hasComment ? $t('comentarioRequeridoParaAccion') : ''"
                                    @click="confirmReview('pending')"
                                >
                                    {{ $t('marcarPendiente') }}
                                </AppButton>
                                <AppButton
                                    variant="danger"
                                    :disabled="!hasComment || submitting"
                                    :title="!hasComment ? $t('comentarioRequeridoParaAccion') : ''"
                                    @click="review('reject')"
                                >
                                    {{ $t('rechazar') }}
                                </AppButton>
                            </div>
                            <p v-if="reviewError" class="text-danger review-actions-error">{{ reviewError }}</p>
                        </div>
                        <div v-else class="alert alert-warning">{{ $t('noPagadoNoRevisar') }}</div>

                        <div class="purge-section mt-3">
                            <p class="text-muted purge-warning">{{ $t('purgarFotosAdvertencia') }}</p>
                            <AppButton
                                variant="secondary"
                                :disabled="!item.has_images || purging"
                                :loading="purging"
                                @click="confirmPurge"
                            >
                                {{ $t('purgarFotos') }}
                            </AppButton>
                        </div>
                    </div>
                </div>

                <!-- Full size image modal -->
                <div v-if="fullSizeImage" class="modal-overlay" @click="fullSizeImage = null">
                    <img :src="fullSizeImage" class="modal-full-image" @click.stop />
                </div>
            </div>
        </div>
    </AdminLayout>
</template>

<script>
import axios from 'axios';
import AdminLayout from '../layouts/AdminLayout.vue';
import AdminReviewSubjectUserLine from '../AdminReviewSubjectUserLine.vue';
import AdminUserSupportTicketsWarning from '../AdminUserSupportTicketsWarning.vue';
import AppButton from '../ui/AppButton.vue';
import AppField from '../ui/AppField.vue';
import AppTextarea from '../ui/AppTextarea.vue';
import { AdminApi } from '../../services/api';
import { mapState } from 'pinia';
import { useAuthStore } from '../../stores/auth';
import dialogs from '../../services/dialogs.js';
import { displayDniOrDash as formatDisplayDniOrDash } from '../../utils/formatDisplayDni';
import { shouldShowPurgedPhotosMessage } from '../../utils/adminManualIdentityValidationImages.js';
import {
    MANUAL_IDENTITY_VALIDATION_REVIEW_STATUS_OPTIONS,
    buildManualIdentityValidationStatePayload,
    hasManualIdentityValidationStateChanges,
    hasPhotosSubmitted
} from '../../utils/adminManualIdentityValidationStateEdit.js';
import { shouldProceedWithReviewAction } from '../../utils/adminManualIdentityValidationReviewConfirm.js';

export default {
    name: 'AdminManualIdentityValidationReview',
    props: {
        id: {
            type: [String, Number],
            required: true
        }
    },
    data() {
        return {
            item: null,
            loading: true,
            blobUrls: { front: null, back: null, selfie: null },
            fullSizeImage: null,
            reviewNote: '',
            privateAdminNote: '',
            editableReviewStatus: 'pending',
            editablePaid: false,
            editablePhotosSubmitted: false,
            savingPrivateNote: false,
            savingState: false,
            stateSaveError: null,
            submitting: false,
            reviewError: null,
            purging: false
        };
    },
    computed: {
        ...mapState(useAuthStore, {
            config: 'appConfig'
        }),
        hasComment() {
            return this.reviewNote && this.reviewNote.trim() !== '';
        },
        reviewStatusOptions() {
            return MANUAL_IDENTITY_VALIDATION_REVIEW_STATUS_OPTIONS;
        },
        hasStateChanges() {
            return hasManualIdentityValidationStateChanges(this.item, {
                reviewStatus: this.editableReviewStatus,
                paid: this.editablePaid,
                photosSubmitted: this.editablePhotosSubmitted
            });
        }
    },
    methods: {
        shouldShowPurgedPhotosMessage,
        displayDniOrDash(value) {
            return formatDisplayDniOrDash(
                value,
                this.config,
                '-'
            );
        },
        formatDate(value) {
            if (!value) return '-';
            return new Date(value).toLocaleString();
        },
        getStatusLabel(status) {
            if (status === 'pending') return this.$t('estadoPendiente');
            if (status === 'awaiting_photos') return this.$t('estadoEsperandoFotos');
            if (status === 'approved') return this.$t('estadoAprobado');
            if (status === 'rejected') return this.$t('estadoRechazado');
            if (status === 'closed') return this.$t('estadoCerrado');
            return status || '-';
        },
        getActionDateLabel(reviewStatus) {
            if (reviewStatus === 'approved' || reviewStatus === 'approve') return this.$t('fechaAprobacion');
            if (reviewStatus === 'rejected' || reviewStatus === 'reject') return this.$t('fechaRechazo');
            if (reviewStatus === 'pending') return this.$t('fechaMarcadoPendiente');
            return this.$t('fechaAccionAdmin');
        },
        applyResponseItem(res) {
            const data = res.data || res;
            this.item = data.data || data;
            this.privateAdminNote = (this.item && this.item.private_admin_note) || '';
            this.syncEditableStateFromItem();
            if (!this.item.has_images) {
                this.clearImageBlobUrls();
            } else {
                this.loadImages();
            }
        },
        syncEditableStateFromItem() {
            if (!this.item) {
                return;
            }
            this.editableReviewStatus = this.item.review_status || 'pending';
            this.editablePaid = !!this.item.paid;
            this.editablePhotosSubmitted = hasPhotosSubmitted(this.item);
            this.stateSaveError = null;
        },
        clearImageBlobUrls() {
            Object.values(this.blobUrls).forEach((url) => {
                if (url) URL.revokeObjectURL(url);
            });
            this.blobUrls = { front: null, back: null, selfie: null };
        },
        getApiErrorMessage(err) {
            return (err && err.data && (err.data.error || err.data.message)) ||
                (err && err.response && err.response.data && (err.response.data.error || err.response.data.message)) ||
                this.$t('resultError');
        },
        fetchItem() {
            const api = new AdminApi();
            return api.getManualIdentityValidation(this.id).then((res) => {
                this.applyResponseItem(res);
            }).catch(() => {
                this.item = null;
            }).finally(() => {
                this.loading = false;
            });
        },
        loadImages() {
            if (!this.item || !this.item.has_images) return;
            const authHeader = useAuthStore().authHeader;
            const legacyBase = (typeof process !== 'undefined' && process.env && process.env.API_URL
                ? String(process.env.API_URL)
                : ''
            ).replace(/\/$/, '');
            const viteBase = (import.meta.env && import.meta.env.VITE_API_URL
                ? String(import.meta.env.VITE_API_URL)
                : ''
            ).replace(/\/$/, '');
            const baseUrl = legacyBase || viteBase;
            if (!baseUrl) return;
            // Always request images from the backend (same host as API), not from URLs in JSON (may be APP_URL / frontend).
            ['front', 'back', 'selfie'].forEach((type) => {
                const path = '/api/admin/manual-identity-validations/' + this.id + '/image/' + type;
                const fullUrl = baseUrl + path;
                axios.get(fullUrl, { responseType: 'blob', headers: authHeader })
                    .then((res) => {
                        this.blobUrls[type] = URL.createObjectURL(res.data);
                    })
                    .catch(() => {});
            });
        },
        showFullSize(type) {
            this.fullSizeImage = this.blobUrls[type] || null;
        },
        savePrivateAdminNote() {
            if (!this.item) return;
            this.savingPrivateNote = true;
            const api = new AdminApi();
            api.updateManualIdentityValidationPrivateNote(this.item.id, this.privateAdminNote)
                .then((res) => {
                    this.applyResponseItem(res);
                    dialogs.message(this.$t('guardar'), { duration: 2, estado: 'success' });
                }, () => {
                    dialogs.message(this.$t('resultError'), { duration: 3, estado: 'error' });
                })
                .finally(() => {
                    this.savingPrivateNote = false;
                });
        },
        saveManualIdentityValidationState() {
            if (!this.item || !this.hasStateChanges) {
                return;
            }

            this.savingState = true;
            this.stateSaveError = null;
            const api = new AdminApi();
            const payload = buildManualIdentityValidationStatePayload(this.item, {
                reviewStatus: this.editableReviewStatus,
                paid: this.editablePaid,
                photosSubmitted: this.editablePhotosSubmitted
            });

            api.updateManualIdentityValidationState(this.item.id, payload)
                .then((res) => {
                    this.applyResponseItem(res);
                    dialogs.message(this.$t('guardar'), { duration: 2, estado: 'success' });
                }, (err) => {
                    this.stateSaveError = this.getApiErrorMessage(err);
                })
                .finally(() => {
                    this.savingState = false;
                });
        },
        review(action) {
            if (action !== 'approve' && !this.hasComment) return;
            this.submitting = true;
            this.reviewError = null;
            const api = new AdminApi();
            const note = (this.reviewNote && this.reviewNote.trim()) || '';
            api.reviewManualIdentityValidation(this.id, action, note)
                .then(() => {
                    const messageKey = action === 'approve' ? 'estadoAprobado' : action === 'reject' ? 'estadoRechazado' : 'accionMarcadoPendiente';
                    const estado = action === 'approve' ? 'success' : action === 'reject' ? 'error' : 'warning';
                    dialogs.message(this.$t(messageKey), { duration: 3, estado });
                    setTimeout(() => {
                        this.$router.push({ name: 'admin-manual-identity-validations' });
                    }, 2000);
                }, (err) => {
                    this.reviewError = this.getApiErrorMessage(err);
                })
                .finally(() => {
                    this.submitting = false;
                });
        },
        confirmReview(action) {
            const proceed = shouldProceedWithReviewAction(
                action,
                this.item && this.item.review_status,
                () => confirm(this.$t('confirmMarcarPendienteYaPendiente'))
            );
            if (!proceed) {
                return;
            }
            this.review(action);
        },
        confirmPurge() {
            if (!confirm(this.$t('confirmarPurgarFotos'))) return;
            this.doPurge();
        },
        doPurge() {
            this.purging = true;
            const api = new AdminApi();
            api.purgeManualIdentityValidation(this.id)
                .then(() => {
                    this.clearImageBlobUrls();
                    this.fetchItem();
                })
                .finally(() => {
                    this.purging = false;
                });
        }
    },
    watch: {
        id: {
            handler() {
                this.loading = true;
                this.item = null;
                this.blobUrls = { front: null, back: null, selfie: null };
                this.fetchItem();
            },
            immediate: true
        }
    },
    beforeUnmount() {
        this.clearImageBlobUrls();
    },
    components: {
        AdminLayout,
        AdminReviewSubjectUserLine,
        AdminUserSupportTicketsWarning,
        AppButton,
        AppField,
        AppTextarea
    }
};
</script>

<style scoped>
.clickable-img {
    cursor: pointer;
    max-height: 200px;
}
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
}
.modal-full-image {
    max-width: 95%;
    max-height: 95%;
    object-fit: contain;
}
.purge-section .purge-warning {
    margin-bottom: 0.5em;
}
.review-actions-buttons {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem 0.75rem;
    margin-top: 0.25rem;
}
.review-actions-error {
    margin-top: 0.5rem;
    margin-bottom: 0;
}
.review-note-display {
    word-break: break-word;
}
.private-admin-note-group {
    margin-top: 1rem;
}
.private-admin-note-save-btn {
    margin-top: 0.5rem;
}
.admin-manual-identity-state-edit {
    margin-top: 1rem;
}
.admin-manual-identity-state-edit-hint {
    margin-bottom: 0.75rem;
}
.admin-manual-identity-state-edit-save {
    margin-top: 0.25rem;
}
.admin-manual-identity-state-edit-error {
    margin-top: 0.5rem;
    margin-bottom: 0;
}
.identity-validation-review-comment-user-visible {
    display: block;
    width: fit-content;
    max-width: 100%;
    margin-top: 0.35rem;
    margin-bottom: 0.75rem;
}
.identity-validation-review-comment-user-visible .fa {
    margin-right: 0.5rem;
}
.admin-page__select {
    width: 100%;
    border: 0;
    border-radius: 0;
    background: transparent;
    box-shadow: none;
    margin: 0;
    padding: var(--ds-input-padding-y, 0.75rem) var(--ds-input-padding-x, 1rem);
    color: var(--ds-input-text, #22211f);
    font-family: inherit;
    font-size: var(--ds-input-font-size, 1rem);
    line-height: 1.3;
    box-sizing: border-box;
}
.admin-page__select:focus {
    outline: none;
}
</style>
