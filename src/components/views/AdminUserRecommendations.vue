<template>
    <AdminLayout>
        <div class="container admin-user-recommendations">
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
                {{ $t('cargandoUsuarios') }}
            </div>
            <div v-else-if="profileUser">
                <h2>
                    {{ profileUser.name }}
                    <small class="text-muted">#{{ profileUser.id }}</small>
                </h2>
                <h3>{{ $t('referencias') }}</h3>
                <p v-if="!references.length" class="alert alert-warning">
                    {{ $t('noReferences') }}
                </p>
                <div
                    v-for="reference in references"
                    :key="reference.id"
                    class="panel panel-default admin-user-recommendations__item"
                >
                    <div class="panel-body">
                        <p>
                            <strong>{{
                                reference.from?.name || reference.user_id_from
                            }}</strong>
                        </p>
                        <template v-if="editingId === reference.id">
                            <div class="form-group">
                                <label>{{ $t('adminUsuariosComentario') }}</label>
                                <textarea
                                    v-model="editComment"
                                    class="form-control"
                                    rows="4"
                                ></textarea>
                            </div>
                            <button
                                type="button"
                                class="btn btn-primary"
                                :disabled="saving"
                                @click="saveReference(reference)"
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
                            <p>{{ reference.comment }}</p>
                            <button
                                type="button"
                                class="btn btn-default btn-sm"
                                @click="startEdit(reference)"
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
import { UserApi, AdminApi } from '../../services/api';
import dialogs from '../../services/dialogs.js';

export default {
    name: 'admin-user-recommendations',
    components: {
        AdminLayout
    },
    data() {
        return {
            loading: true,
            saving: false,
            profileUser: null,
            editingId: null,
            editComment: '',
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
        },
        references() {
            return this.profileUser?.references_data || [];
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
        startEdit(reference) {
            this.editingId = reference.id;
            this.editComment = reference.comment || '';
        },
        cancelEdit() {
            this.editingId = null;
        },
        saveReference(reference) {
            this.saving = true;
            this.adminApi
                .updateReference(reference.id, {
                    comment: this.editComment
                })
                .then((response) => {
                    const updated = response.data;
                    const list = this.profileUser.references_data || [];
                    const idx = list.findIndex((r) => r.id === reference.id);
                    if (idx !== -1 && updated) {
                        list.splice(idx, 1, {
                            ...list[idx],
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
        this.adminApi = new AdminApi();
        this.load();
    }
};
</script>

<style scoped>
.admin-user-detail__back {
    margin-bottom: 12px;
}

.admin-user-recommendations__item {
    margin-bottom: 12px;
}
</style>
