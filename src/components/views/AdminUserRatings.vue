<template>
    <AdminLayout>
        <div class="container admin-user-ratings">
            <p class="admin-user-detail__back">
                <router-link
                    :to="hubRoute"
                    class="btn btn-default btn-sm"
                >
                    {{ $t('adminUsuariosVolverResumen') }}
                </router-link>
            </p>
            <div v-if="loading" class="alert alert-info">
                <img
                    :src="$publicImg('loader.gif')"
                    alt=""
                    class="ajax-loader"
                />
                {{ $t('cargandoNotificaciones') }}
            </div>
            <div v-else-if="profileUser">
                <h2>
                    {{ profileUser.name }}
                    <small class="text-muted">#{{ profileUser.id }}</small>
                </h2>
                <h3>{{ $t('calificaciones') }}</h3>
                <p v-if="!rates.length" class="alert alert-warning">
                    {{ $t('noCalificaciones') }}
                </p>
                <div
                    v-for="rate in rates"
                    :key="rate.id"
                    class="panel panel-default admin-user-ratings__item"
                >
                    <div class="panel-body">
                        <p>
                            <strong>{{ rate.from?.name || '—' }}</strong>
                            <span v-if="rate.trip">
                                — {{ rate.trip.from_town }} →
                                {{ rate.trip.to_town }}
                            </span>
                        </p>
                        <template v-if="editingId === rate.id">
                            <div class="form-group">
                                <label>{{ $t('adminUsuariosCalificacion') }}</label>
                                <select
                                    v-model.number="editForm.rating"
                                    class="form-control"
                                >
                                    <option :value="1">
                                        {{ $t('rateItemPositiva') }}
                                    </option>
                                    <option :value="0">
                                        {{ $t('rateItemNegativa') }}
                                    </option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label>{{ $t('adminUsuariosComentario') }}</label>
                                <textarea
                                    v-model="editForm.comment"
                                    class="form-control"
                                    rows="3"
                                ></textarea>
                            </div>
                            <div class="form-group">
                                <label>{{ $t('adminUsuariosRespuesta') }}</label>
                                <textarea
                                    v-model="editForm.reply_comment"
                                    class="form-control"
                                    rows="2"
                                ></textarea>
                            </div>
                            <button
                                type="button"
                                class="btn btn-primary"
                                :disabled="saving"
                                @click="saveRating(rate)"
                            >
                                {{ $t('adminUsuariosGuardar') }}
                            </button>
                            <button
                                type="button"
                                class="btn btn-default"
                                :disabled="saving"
                                @click="cancelEdit"
                            >
                                {{ $t('adminUsuariosCancelar') }}
                            </button>
                        </template>
                        <template v-else>
                            <p>
                                <span v-if="rate.rating == 1">
                                    {{ $t('rateItemPositiva') }}
                                </span>
                                <span v-else>{{ $t('rateItemNegativa') }}</span>
                            </p>
                            <p v-if="rate.comment">{{ rate.comment }}</p>
                            <p v-if="rate.reply_comment">
                                <em>{{ $t('adminUsuariosRespuesta') }}:</em>
                                {{ rate.reply_comment }}
                            </p>
                            <button
                                type="button"
                                class="btn btn-default btn-sm"
                                @click="startEdit(rate)"
                            >
                                {{ $t('adminUsuariosEditarFila') }}
                            </button>
                        </template>
                    </div>
                </div>
            </div>
        </div>
    </AdminLayout>
</template>

<script>
import AdminLayout from '../layouts/AdminLayout.vue';
import { UserApi, RateApi, AdminApi } from '../../services/api';
import dialogs from '../../services/dialogs.js';

export default {
    name: 'admin-user-ratings',
    components: {
        AdminLayout
    },
    data() {
        return {
            loading: true,
            saving: false,
            profileUser: null,
            rates: [],
            editingId: null,
            editForm: {
                rating: 1,
                comment: '',
                reply_comment: ''
            },
            userApi: null,
            rateApi: null,
            adminApi: null
        };
    },
    computed: {
        hubRoute() {
            return {
                name: 'admin-users-user',
                params: { userId: this.$route.params.userId }
            };
        }
    },
    methods: {
        load() {
            const userId = this.$route.params.userId;
            if (!userId) {
                this.$router.replace({ name: 'admin-users' });
                return;
            }
            this.loading = true;
            this.userApi
                .show(userId)
                .then((body) => {
                    this.profileUser = body.data || null;
                    if (!this.profileUser) {
                        throw new Error('not found');
                    }
                    return this.rateApi.index(this.profileUser.id, {
                        page_size: 200
                    });
                })
                .then((response) => {
                    this.rates = response.data || [];
                })
                .catch(() => {
                    dialogs.message(this.$t('noSeEncontroNingunUsuario'), {
                        estado: 'error'
                    });
                    this.$router.replace({ name: 'admin-users' });
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        startEdit(rate) {
            this.editingId = rate.id;
            this.editForm = {
                rating: rate.rating,
                comment: rate.comment || '',
                reply_comment: rate.reply_comment || ''
            };
        },
        cancelEdit() {
            this.editingId = null;
        },
        saveRating(rate) {
            this.saving = true;
            this.adminApi
                .updateRating(rate.id, {
                    rating: this.editForm.rating,
                    comment: this.editForm.comment,
                    reply_comment: this.editForm.reply_comment
                })
                .then((response) => {
                    const updated = response.data;
                    const idx = this.rates.findIndex((r) => r.id === rate.id);
                    if (idx !== -1 && updated) {
                        this.rates.splice(idx, 1, {
                            ...this.rates[idx],
                            ...updated
                        });
                    }
                    this.editingId = null;
                    dialogs.message(this.$t('adminUsuariosEdicionGuardada'), {
                        estado: 'success'
                    });
                })
                .catch(() => {
                    dialogs.message(this.$t('adminUsuariosEdicionError'), {
                        estado: 'error'
                    });
                })
                .finally(() => {
                    this.saving = false;
                });
        }
    },
    watch: {
        '$route.params.userId'() {
            this.load();
        }
    },
    mounted() {
        this.userApi = new UserApi();
        this.rateApi = new RateApi();
        this.adminApi = new AdminApi();
        this.load();
    }
};
</script>

<style scoped>
.admin-user-detail__back {
    margin-bottom: 12px;
}

.admin-user-ratings__item {
    margin-bottom: 12px;
}
</style>
