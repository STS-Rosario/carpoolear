<template>
    <AdminLayout>
        <div class="container admin-user-migration-new">
            <div class="row">
                <div class="col-md-22 col-md-offset-1">
                    <p class="admin-user-migration-new__back">
                        <router-link
                            :to="{ name: 'admin-user-migrations' }"
                            class="btn btn-default btn-sm"
                        >
                            {{ $t('migrarUsuariosVolverAlListado') }}
                        </router-link>
                    </p>
                    <h3>{{ $t('nuevaMigracionDeUsuario') }}</h3>

                    <div class="form-group">
                        <label>{{ $t('usuarioABorrar') }}</label>
                        <UserSearchAutocomplete
                            v-model="userToRemove"
                            :placeholder="$t('escribeUnNombreYPresionaBuscar')"
                            :max-results="8"
                        />
                    </div>
                    <div class="form-group">
                        <label>{{ $t('usuarioAMantener') }}</label>
                        <UserSearchAutocomplete
                            v-model="userToKeep"
                            :placeholder="$t('escribeUnNombreYPresionaBuscar')"
                            :max-results="8"
                        />
                    </div>

                    <div
                        v-if="previewReady"
                        class="panel panel-default admin-user-migration-new__preview"
                    >
                        <div class="panel-body">
                            <p class="lead">{{ $t('vasAMigrarLosDatosDeEsteUsuario') }}</p>
                            <div class="media user-migration-card">
                                <div
                                    class="media-left user-migration-card__avatar"
                                    v-imgSrc:profile="userToRemove.image"
                                ></div>
                                <div class="media-body">
                                    <p><strong>ID:</strong> {{ userToRemove.id }}</p>
                                    <p><strong>{{ $t('nombre') }}:</strong> {{ userToRemove.name || '—' }}</p>
                                    <p>
                                        <strong>{{ $t('calificacionesPositivas') }}:</strong>
                                        {{ Number(userToRemove.positive_ratings || 0) }}
                                    </p>
                                    <p>
                                        <strong>{{ $t('calificacionesNegativas') }}:</strong>
                                        {{ Number(userToRemove.negative_ratings || 0) }}
                                    </p>
                                </div>
                            </div>
                            <p class="lead">{{ $t('yLosVasAJuntarConLosDeEsteUsuario') }}</p>
                            <div class="media user-migration-card">
                                <div
                                    class="media-left user-migration-card__avatar"
                                    v-imgSrc:profile="userToKeep.image"
                                ></div>
                                <div class="media-body">
                                    <p><strong>ID:</strong> {{ userToKeep.id }}</p>
                                    <p><strong>{{ $t('nombre') }}:</strong> {{ userToKeep.name || '—' }}</p>
                                    <p>
                                        <strong>{{ $t('calificacionesPositivas') }}:</strong>
                                        {{ Number(userToKeep.positive_ratings || 0) }}
                                    </p>
                                    <p>
                                        <strong>{{ $t('calificacionesNegativas') }}:</strong>
                                        {{ Number(userToKeep.negative_ratings || 0) }}
                                    </p>
                                </div>
                            </div>
                            <button
                                type="button"
                                class="btn btn-primary"
                                :disabled="migrateDisabled || migrating"
                                @click="onMigrateClick"
                            >
                                {{ migrating ? $t('guardando') : $t('migrar') }}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </AdminLayout>
</template>

<script>
import AdminLayout from '../layouts/AdminLayout.vue';
import UserSearchAutocomplete from '../UserSearchAutocomplete.vue';
import { AdminApi } from '../../services/api';
import dialogs from '../../services/dialogs.js';

export default {
    name: 'admin-user-migration-new',
    data() {
        return {
            userToRemove: null,
            userToKeep: null,
            migrating: false,
            adminApi: null
        };
    },
    computed: {
        previewReady() {
            return (
                this.userToRemove &&
                this.userToKeep &&
                this.userToRemove.id &&
                this.userToKeep.id &&
                this.userToRemove.id !== this.userToKeep.id
            );
        },
        migrateDisabled() {
            return !this.previewReady;
        }
    },
    methods: {
        onMigrateClick() {
            if (!this.previewReady) return;
            if (!window.confirm(this.$t('confirmacionMigracionUsuarios'))) {
                return;
            }
            this.runMigration();
        },
        async runMigration() {
            this.migrating = true;
            try {
                await this.adminApi.createUserMigration({
                    user_id_kept: this.userToKeep.id,
                    user_id_removed: this.userToRemove.id
                });
                dialogs.message(this.$t('usuariosMigrados'), { estado: 'success' });
                this.$router.push({
                    name: 'admin-users-user',
                    params: { userId: String(this.userToKeep.id) }
                });
            } catch (e) {
                console.error(e);
                dialogs.message(this.$t('errorMigrandoUsuarios'), {
                    estado: 'error',
                    duration: 6
                });
            } finally {
                this.migrating = false;
            }
        }
    },
    mounted() {
        this.adminApi = new AdminApi();
    },
    components: {
        AdminLayout,
        UserSearchAutocomplete
    }
};
</script>

<style scoped>
.admin-user-migration-new__back {
    margin-bottom: 12px;
}

.user-migration-card__avatar {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    overflow: hidden;
    background: #eee;
}

.admin-user-migration-new__preview {
    margin-top: 16px;
}
</style>
