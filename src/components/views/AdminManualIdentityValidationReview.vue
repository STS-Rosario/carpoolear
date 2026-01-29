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
                                <label>{{ $t('comentarioObligatorio') }}</label>
                                <textarea v-model="reviewNote" class="form-control" rows="3" :placeholder="$t('comentarioObligatorio')"></textarea>
                            </div>
                            <button
                                class="btn btn-success"
                                :disabled="!reviewNote || reviewNote.trim() === '' || submitting"
                                @click="review('approve')"
                            >
                                {{ $t('aprobar') }}
                            </button>
                            <button
                                class="btn btn-warning"
                                :disabled="!reviewNote || reviewNote.trim() === '' || submitting"
                                @click="review('pending')"
                            >
                                {{ $t('marcarPendiente') }}
                            </button>
                            <button
                                class="btn btn-danger"
                                :disabled="!reviewNote || reviewNote.trim() === '' || submitting"
                                @click="review('reject')"
                            >
                                {{ $t('rechazar') }}
                            </button>
                            <p v-if="reviewError" class="text-danger">{{ reviewError }}</p>
                        </div>
                        <div v-else class="alert alert-warning">{{ $t('noPagadoNoRevisar') }}</div>

                        <div class="purge-section mt-3">
                            <button
                                class="btn btn-default"
                                :disabled="!item.has_images || purging"
                                @click="purge"
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
            if (!this.item) return;
            const authHeader = store.getters['auth/authHeader'];
            const baseUrl = (process.env.API_URL || '').replace(/\/$/, '');
            ['front', 'back', 'selfie'].forEach((type) => {
                const urlKey = type + '_image_url';
                const url = this.item[urlKey];
                if (!url) return;
                const fullUrl = url.startsWith('http') ? url : baseUrl + url;
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
            if (!this.reviewNote || this.reviewNote.trim() === '') return;
            this.submitting = true;
            this.reviewError = null;
            const api = new AdminApi();
            api.reviewManualIdentityValidation(this.id, action, this.reviewNote.trim())
                .then(() => {
                    this.fetchItem();
                    this.reviewNote = '';
                })
                .catch((err) => {
                    this.reviewError = (err.response && err.response.data && err.response.data.error) || this.$t('resultError');
                })
                .finally(() => {
                    this.submitting = false;
                });
        },
        purge() {
            if (!confirm(this.$t('confirmarPurgarFotos'))) return;
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
</style>
