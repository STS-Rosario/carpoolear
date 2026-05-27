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
                {{ $t('cargandoCalificaciones') }}
            </div>
            <div v-else-if="profileUser">
                <h2>
                    {{ profileUser.name }}
                    <small class="text-muted">#{{ profileUser.id }}</small>
                </h2>

                <h3>{{ $t('adminUsuariosCalificacionesRecibidas') }}</h3>
                <p
                    v-if="!receivedRatings.length"
                    class="alert alert-warning"
                >
                    {{ $t('adminUsuariosNoCalificacionesRecibidas') }}
                </p>
                <AdminRatingCard
                    v-for="rate in receivedRatings"
                    :key="'received-' + rate.id"
                    :rate="rate"
                    :counterparty="rate.from"
                    :editing="editingId === rate.id"
                    :edit-form="editForm"
                    :saving="saving"
                    @edit="startEdit(rate)"
                    @save="saveRating(rate, 'received')"
                    @cancel="cancelEdit"
                    @update:edit-form="editForm = $event"
                />

                <h3>{{ $t('adminUsuariosCalificacionesOtorgadas') }}</h3>
                <p v-if="!givenRatings.length" class="alert alert-warning">
                    {{ $t('adminUsuariosNoCalificacionesOtorgadas') }}
                </p>
                <AdminRatingCard
                    v-for="rate in givenRatings"
                    :key="'given-' + rate.id"
                    :rate="rate"
                    :counterparty="rate.to"
                    :editing="editingId === rate.id"
                    :edit-form="editForm"
                    :saving="saving"
                    @edit="startEdit(rate)"
                    @save="saveRating(rate, 'given')"
                    @cancel="cancelEdit"
                    @update:edit-form="editForm = $event"
                />
            </div>
        </div>
    </AdminLayout>
</template>

<script>
import AdminLayout from '../layouts/AdminLayout.vue';
import AdminRatingCard from '../elements/AdminRatingCard.vue';
import { UserApi, AdminApi } from '../../services/api';
import dialogs from '../../services/dialogs.js';

export default {
    name: 'admin-user-ratings',
    components: {
        AdminLayout,
        AdminRatingCard
    },
    data() {
        return {
            loading: true,
            saving: false,
            profileUser: null,
            receivedRatings: [],
            givenRatings: [],
            editingId: null,
            editForm: {
                rating: 1,
                comment: '',
                reply_comment: ''
            },
            userApi: null,
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
                    return this.adminApi.getUserRatings(this.profileUser.id);
                })
                .then((response) => {
                    const payload = response.data || {};
                    this.receivedRatings = payload.received || [];
                    this.givenRatings = payload.given || [];
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
        replaceRating(list, rate, updated) {
            const idx = list.findIndex((r) => r.id === rate.id);
            if (idx !== -1 && updated) {
                list.splice(idx, 1, { ...list[idx], ...updated });
            }
        },
        saveRating(rate, section) {
            this.saving = true;
            this.adminApi
                .updateRating(rate.id, {
                    rating: this.editForm.rating,
                    comment: this.editForm.comment,
                    reply_comment: this.editForm.reply_comment
                })
                .then((response) => {
                    const updated = response.data;
                    if (section === 'received') {
                        this.replaceRating(
                            this.receivedRatings,
                            rate,
                            updated
                        );
                    } else {
                        this.replaceRating(this.givenRatings, rate, updated);
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
        this.adminApi = new AdminApi();
        this.load();
    }
};
</script>

<style scoped>
.admin-user-detail__back {
    margin-bottom: 12px;
}

.admin-user-ratings h3 {
    margin-top: 24px;
    margin-bottom: 12px;
}
</style>
