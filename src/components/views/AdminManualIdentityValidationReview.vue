<template>
    <div class="col-md-24">
        <div class="row">
            <adminNav></adminNav>
        </div>
        <div class="row">
            <div class="col-md-22 col-md-offset-1">
                <router-link :to="{ name: 'admin-manual-identity-validations' }" class="btn btn-default btn-sm mb-2">
                    {{ $t('volver') }}
                </router-link>
                <div v-if="loading" class="text-center">
                    <img src="https://carpoolear.com.ar/static/img/loader.gif" alt="" class="ajax-loader" />
                    <p>{{ $t('cargando') }}</p>
                </div>
                <div v-else-if="item" class="panel panel-default">
                    <div class="panel-heading">
                        <h3>{{ $t('revisarSolicitud') }} #{{ item.id }}</h3>
                    </div>
                    <div class="panel-body">
                        <p><strong>{{ $t('usuario') }}:</strong>
                            <router-link v-if="item.user_id" :to="{ name: 'profile', params: { id: item.user_id } }" target="_blank">
                                {{ item.user_name }}
                            </router-link>
                            <span v-else>{{ item.user_name || $t('na') }}</span>
                        </p>
                        <p><strong>{{ $t('doc') }} (DNI):</strong> {{ item.user_nro_doc || '-' }}</p>
                        <p><strong>{{ $t('fechaPago') }}:</strong> {{ item.paid_at ? formatDate(item.paid_at) : '-' }}</p>
                        <p><strong>{{ $t('fechaEnvio') }}:</strong> {{ item.submitted_at ? formatDate(item.submitted_at) : '-' }}</p>
                        <p><strong>{{ $t('pagado') }}:</strong> {{ item.paid ? $t('si') : $t('no') }}</p>
                        <p><strong>{{ $t('estado') }}:</strong> {{ getStatusLabel(item.review_status) }}</p>
                        <p v-if="item.reviewed_at">
                            <strong>{{ getActionDateLabel(item.review_status) }}:</strong> {{ formatDate(item.reviewed_at) }}
                        </p>
                        <p v-if="item.reviewed_by_name">
                            <strong>{{ $t('revisadoPor') }}:</strong> {{ item.reviewed_by_name }}
                        </p>
                        <p v-if="item.review_note && item.review_note.trim()" class="review-note-display">
                            <strong>{{ $t('comentarioRevision') }}:</strong> {{ item.review_note }}
                        </p>

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
                        <div v-else class="alert alert-info">{{ $t('fotosPurgadas') }}</div>

                        <div v-if="item.paid" class="review-actions">
                            <h4>{{ $t('accion') }}</h4>
                            <div class="form-group">
                                <label>{{ $t('comentarioRevisar') }}</label>
                                <textarea v-model="reviewNote" class="form-control" rows="3" :placeholder="$t('comentarioRevisar')"></textarea>
                            </div>
                            <button
                                class="btn btn-success"
                                :disabled="submitting"
                                @click="review('approve')"
                            >
                                {{ $t('aprobar') }}
                            </button>
                            <button
                                class="btn btn-warning"
                                :disabled="!hasComment || submitting"
                                :title="!hasComment ? $t('comentarioRequeridoParaAccion') : ''"
                                @click="review('pending')"
                            >
                                {{ $t('marcarPendiente') }}
                            </button>
                            <button
                                class="btn btn-danger"
                                :disabled="!hasComment || submitting"
                                :title="!hasComment ? $t('comentarioRequeridoParaAccion') : ''"
                                @click="review('reject')"
                            >
                                {{ $t('rechazar') }}
                            </button>
                            <p v-if="reviewError" class="text-danger">{{ reviewError }}</p>
                        </div>
                        <div v-else class="alert alert-warning">{{ $t('noPagadoNoRevisar') }}</div>

                        <div class="purge-section mt-3">
                            <p class="text-muted purge-warning">{{ $t('purgarFotosAdvertencia') }}</p>
                            <button
                                class="btn btn-default"
                                :disabled="!item.has_images || purging"
                                @click="confirmPurge"
                            >
                                {{ $t('purgarFotos') }}
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Full size image modal -->
                <div v-if="fullSizeImage" class="modal-overlay" @click="fullSizeImage = null">
                    <img :src="fullSizeImage" class="modal-full-image" @click.stop />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import adminNav from '../sections/adminNav';
import { AdminApi } from '../../services/api';
import store from '../../store';
import dialogs from '../../services/dialogs.js';

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
            submitting: false,
            reviewError: null,
            purging: false
        };
    },
    computed: {
        hasComment() {
            return this.reviewNote && this.reviewNote.trim() !== '';
        }
    },
    methods: {
        formatDate(value) {
            if (!value) return '-';
            return new Date(value).toLocaleString();
        },
        getStatusLabel(status) {
            if (status === 'pending') return this.$t('estadoPendiente');
            if (status === 'approved') return this.$t('estadoAprobado');
            if (status === 'rejected') return this.$t('estadoRechazado');
            return status || '-';
        },
        getActionDateLabel(reviewStatus) {
            if (reviewStatus === 'approved' || reviewStatus === 'approve') return this.$t('fechaAprobacion');
            if (reviewStatus === 'rejected' || reviewStatus === 'reject') return this.$t('fechaRechazo');
            if (reviewStatus === 'pending') return this.$t('fechaMarcadoPendiente');
            return this.$t('fechaAccionAdmin');
        },
        fetchItem() {
            const api = new AdminApi();
            return api.getManualIdentityValidation(this.id).then((res) => {
                const data = res.data || res;
                this.item = data.data || data;
                this.loadImages();
            }).catch(() => {
                this.item = null;
            }).finally(() => {
                this.loading = false;
            });
        },
        loadImages() {
            if (!this.item || !this.item.has_images) return;
            const authHeader = store.getters['auth/authHeader'];
            const baseUrl = (process.env.API_URL || '').replace(/\/$/, '');
            if (!baseUrl) return;
            // Always request images from the backend (API_URL), not from the URL in the response (which may use APP_URL = frontend)
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
                })
                .catch((err) => {
                    this.reviewError = (err.response && err.response.data && err.response.data.error) || this.$t('resultError');
                })
                .finally(() => {
                    this.submitting = false;
                });
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
                    this.blobUrls = { front: null, back: null, selfie: null };
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
        Object.values(this.blobUrls).forEach((url) => {
            if (url) URL.revokeObjectURL(url);
        });
    },
    components: {
        adminNav
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
.review-note-display {
    word-break: break-word;
}
</style>
