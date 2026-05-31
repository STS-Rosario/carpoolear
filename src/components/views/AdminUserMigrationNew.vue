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
                            <template v-for="card in previewCards" :key="card.role">
                                <p class="lead">{{ $t(card.headingKey) }}</p>
                                <div class="media user-migration-card">
                                    <div
                                        v-if="hasUserImage(card.user)"
                                        class="media-left user-migration-card__avatar"
                                        v-imgSrc:profile="card.user.image"
                                    ></div>
                                    <div
                                        v-else
                                        class="media-left user-migration-card__avatar user-migration-card__avatar--placeholder"
                                        :aria-label="$t('sinFoto')"
                                    >?</div>
                                    <div class="media-body">
                                        <p><strong>ID:</strong> {{ card.user.id }}</p>
                                        <p><strong>{{ $t('nombre') }}:</strong> {{ card.user.name || '—' }}</p>
                                        <p>
                                            <strong>{{ $t('calificacionesPositivas') }}:</strong>
                                            {{ Number(card.user.positive_ratings || 0) }}
                                        </p>
                                        <p>
                                            <strong>{{ $t('calificacionesNegativas') }}:</strong>
                                            {{ Number(card.user.negative_ratings || 0) }}
                                        </p>
                                    </div>
                                </div>
                            </template>

                            <h4>{{ $t('migracionElegirDatos') }}</h4>
                            <p class="text-muted">{{ $t('migracionElegirDatosAyuda') }}</p>
                            <div class="table-responsive">
                                <table class="table table-bordered admin-user-migration-new__field-table">
                                    <thead>
                                        <tr>
                                            <th scope="col">{{ $t('migracionCampo') }}</th>
                                            <th scope="col">{{ $t('usuarioABorrar') }}</th>
                                            <th scope="col">{{ $t('usuarioAMantener') }}</th>
                                            <th scope="col">{{ $t('migracionValorElegido') }}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr
                                            v-for="field in migrationFields"
                                            :key="field.key"
                                        >
                                            <th scope="row">{{ $t(field.labelKey) }}</th>
                                            <td>
                                                <button
                                                    type="button"
                                                    class="admin-user-migration-new__field-cell"
                                                    :class="{
                                                        'admin-user-migration-new__field-cell--selected':
                                                            isFieldSourceSelected(field.key, 'removed')
                                                    }"
                                                    @click="selectFieldSource(field.key, 'removed')"
                                                >
                                                    {{ formatFieldValue(field.key, userToRemove) }}
                                                </button>
                                            </td>
                                            <td>
                                                <button
                                                    type="button"
                                                    class="admin-user-migration-new__field-cell"
                                                    :class="{
                                                        'admin-user-migration-new__field-cell--selected':
                                                            isFieldSourceSelected(field.key, 'kept')
                                                    }"
                                                    @click="selectFieldSource(field.key, 'kept')"
                                                >
                                                    {{ formatFieldValue(field.key, userToKeep) }}
                                                </button>
                                            </td>
                                            <td class="admin-user-migration-new__chosen-value">
                                                {{ chosenFieldValue(field.key) }}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <p
                                class="alert alert-warning admin-user-migration-new__warning"
                                role="alert"
                            >
                                {{ $t('advertenciaMigracionUsuarios') }}
                            </p>
                            <button
                                type="button"
                                class="btn btn-primary admin-user-migration-new__submit"
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
import dayjs from '../../dayjs';

const DEFAULT_FIELD_SOURCES = {
    email: 'removed',
    password: 'kept',
    nro_doc: 'removed',
    mobile_phone: 'kept',
    created_at: 'removed'
};

const migrationFields = [
    { key: 'email', labelKey: 'migracionCampoEmail' },
    { key: 'password', labelKey: 'migracionCampoContrasena' },
    { key: 'nro_doc', labelKey: 'migracionCampoDni' },
    { key: 'mobile_phone', labelKey: 'migracionCampoTelefono' },
    { key: 'created_at', labelKey: 'migracionCampoFechaCreacion' }
];

export default {
    name: 'admin-user-migration-new',
    data() {
        return {
            userToRemove: null,
            userToKeep: null,
            fieldSources: { ...DEFAULT_FIELD_SOURCES },
            migrating: false,
            adminApi: null,
            DEFAULT_FIELD_SOURCES,
            migrationFields
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
        },
        previewCards() {
            return [
                {
                    role: 'remove',
                    headingKey: 'vasAMigrarLosDatosDeEsteUsuario',
                    user: this.userToRemove
                },
                {
                    role: 'keep',
                    headingKey: 'yLosVasAJuntarConLosDeEsteUsuario',
                    user: this.userToKeep
                }
            ];
        }
    },
    methods: {
        applyPrefillFromQuery() {
            const query = this.$route.query || {};
            const removeUserId = parseInt(query.removeUserId, 10);
            const keepUserId = parseInt(query.keepUserId, 10);
            if (!Number.isNaN(removeUserId) && removeUserId > 0) {
                this.userToRemove = {
                    id: removeUserId,
                    name: query.removeUserName ? String(query.removeUserName) : ''
                };
            }
            if (!Number.isNaN(keepUserId) && keepUserId > 0) {
                this.userToKeep = {
                    id: keepUserId,
                    name: query.keepUserName ? String(query.keepUserName) : ''
                };
            }
        },
        syncRouteQuery() {
            const query = {};
            if (this.userToRemove && this.userToRemove.id) {
                query.removeUserId = String(this.userToRemove.id);
                query.removeUserName = String(this.userToRemove.name || '');
            }
            if (this.userToKeep && this.userToKeep.id) {
                query.keepUserId = String(this.userToKeep.id);
                query.keepUserName = String(this.userToKeep.name || '');
            }
            this.$router.replace({ query });
        },
        resetFieldSources() {
            this.fieldSources = { ...DEFAULT_FIELD_SOURCES };
        },
        selectFieldSource(fieldKey, source) {
            this.fieldSources = {
                ...this.fieldSources,
                [fieldKey]: source
            };
        },
        isFieldSourceSelected(fieldKey, source) {
            return this.fieldSources[fieldKey] === source;
        },
        userForFieldSource(source) {
            return source === 'removed' ? this.userToRemove : this.userToKeep;
        },
        formatFieldValue(fieldKey, user) {
            if (!user) {
                return '—';
            }
            if (fieldKey === 'password') {
                return this.$t('migracionContrasenaConfigurada');
            }
            if (fieldKey === 'created_at') {
                return this.formatJoinDate(user.created_at);
            }
            const value = user[fieldKey];
            return value ? String(value) : '—';
        },
        chosenFieldValue(fieldKey) {
            const source = this.fieldSources[fieldKey] || DEFAULT_FIELD_SOURCES[fieldKey];
            return this.formatFieldValue(fieldKey, this.userForFieldSource(source));
        },
        async ensureUserDetails(userRef) {
            const user = this[userRef];
            if (!user || !user.id) {
                return;
            }
            if (user.email !== undefined && user.nro_doc !== undefined) {
                return;
            }
            try {
                const response = await this.adminApi.searchUsers({ name: String(user.id) });
                const rows = Array.isArray(response.data) ? response.data : [];
                const match = rows.find((row) => Number(row.id) === Number(user.id));
                if (match) {
                    this[userRef] = match;
                }
            } catch (e) {
                console.error(e);
            }
        },
        async loadPreviewUsers() {
            if (!this.previewReady) {
                return;
            }
            await Promise.all([
                this.ensureUserDetails('userToRemove'),
                this.ensureUserDetails('userToKeep')
            ]);
        },
        hasUserImage(user) {
            if (!user) return false;
            const img = (user.image || '').toString().trim();
            if (!img) return false;
            return img !== 'default.png';
        },
        formatJoinDate(iso) {
            if (!iso) return '—';
            const d = dayjs(iso);
            return d.isValid() ? d.format('LL') : '—';
        },
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
                    user_id_removed: this.userToRemove.id,
                    field_sources: { ...this.fieldSources }
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
        this.applyPrefillFromQuery();
        this.loadPreviewUsers();
    },
    watch: {
        userToRemove() {
            this.syncRouteQuery();
            this.resetFieldSources();
            this.loadPreviewUsers();
        },
        userToKeep() {
            this.syncRouteQuery();
            this.resetFieldSources();
            this.loadPreviewUsers();
        }
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
    width: 100px;
    height: 100px;
    max-width: 100px;
    max-height: 100px;
    border-radius: 50%;
    overflow: hidden;
    background: #eee;
    background-size: cover;
    background-position: center;
}

.user-migration-card__avatar--placeholder {
    display: flex;
    align-items: center;
    justify-content: center;
    color: #888;
    font-size: 48px;
    font-weight: 700;
    line-height: 1;
    background: #f2f2f2;
    border: 1px solid #ddd;
}

.admin-user-migration-new__preview {
    margin-top: 16px;
}

.admin-user-migration-new__field-table {
    margin-top: 12px;
}

.admin-user-migration-new__field-cell {
    display: block;
    width: 100%;
    padding: 8px 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    background: #fff;
    text-align: left;
    cursor: pointer;
}

.admin-user-migration-new__field-cell:hover {
    background: #f7f7f7;
}

.admin-user-migration-new__field-cell--selected {
    border-color: #337ab7;
    background: #e8f4fc;
    box-shadow: inset 0 0 0 1px #337ab7;
    font-weight: 600;
}

.admin-user-migration-new__chosen-value {
    vertical-align: middle;
    font-weight: 600;
}

.admin-user-migration-new__submit {
    margin-top: 24px;
}
</style>
