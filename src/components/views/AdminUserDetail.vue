<template>
    <AdminLayout>
        <div class="container admin-user-detail">
            <div class="row">
                <div class="col-md-20 col-md-offset-2">
                    <p class="admin-user-detail__back">
                        <router-link
                            :to="{ name: 'admin-users' }"
                            class="btn btn-default btn-sm"
                        >
                            {{ $t('adminUsuariosVolverAlListado') }}
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
                    <div
                        v-else-if="user"
                        class="user-settings settings-container user-admin-view"
                    >
                        <div
                            class="admin-user-detail__status alert"
                            :class="'alert-' + bannedBanner.modifier"
                            role="status"
                        >
                            <strong>{{ bannedBanner.label }}</strong>
                        </div>
                        <h3>
                            {{ user.name }}
                            <small class="text-muted">#{{ user.id }}</small>
                        </h3>
                        <p>
                            <router-link
                                :to="{
                                    name: 'profile',
                                    params: { id: user.id }
                                }"
                            >
                                {{ $t('verPerfilPublico') }}
                            </router-link>
                        </p>
                        <dl class="admin-user-detail__properties">
                            <div
                                v-for="row in propertyRows"
                                :key="row.key"
                                class="admin-user-detail__property"
                            >
                                <dt>{{ row.label }}</dt>
                                <dd>
                                    <a
                                        v-if="
                                            row.key === 'facebook_profile_url' &&
                                            row.value !== '—'
                                        "
                                        :href="row.value"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {{ row.value }}
                                    </a>
                                    <span v-else>{{ row.value }}</span>
                                </dd>
                            </div>
                        </dl>
                        <p class="user-admin-view-nav">
                            <router-link
                                :to="{
                                    name: 'admin-users-trips',
                                    params: { userId: String(user.id) }
                                }"
                                class="btn btn-default"
                            >
                                {{ adminUserNavLabel('adminUsuariosVerViajes', user.admin_trips_count) }}
                            </router-link>
                            <router-link
                                :to="{
                                    name: 'admin-users-ratings',
                                    params: { userId: String(user.id) }
                                }"
                                class="btn btn-default"
                            >
                                {{ adminUserNavLabel('adminUsuariosVerCalificaciones', user.admin_ratings_count) }}
                            </router-link>
                            <router-link
                                :to="{
                                    name: 'admin-users-recommendations',
                                    params: { userId: String(user.id) }
                                }"
                                class="btn btn-default"
                            >
                                {{ adminUserNavLabel('adminUsuariosVerReferencias', user.references) }}
                            </router-link>
                        </p>
                        <p class="user-admin-view-actions">
                            <router-link
                                :to="{
                                    name: 'admin-users-edit',
                                    params: { userId: String(user.id) }
                                }"
                                class="btn btn-primary"
                            >
                                {{ $t('adminUsuariosEditar') }}
                            </router-link>
                            <router-link
                                :to="supportTicketRoute(user)"
                                class="btn btn-default"
                            >
                                {{ $t('crearTicketSoporte') }}
                            </router-link>
                            <router-link
                                v-if="user.support_tickets_count"
                                :to="adminUserSupportTicketsRoute(user.id)"
                                class="btn btn-default"
                            >
                                {{ $t('adminUsuarioVerTicketsSoporte', { count: user.support_tickets_count }) }}
                            </router-link>
                            <button
                                type="button"
                                class="btn btn-success btn-circle"
                                @click="toUserMessages"
                            >
                                <i
                                    class="fa fa-comments medium-icon"
                                    aria-hidden="true"
                                ></i>
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </AdminLayout>
</template>

<script>
import { mapActions, mapState } from 'pinia';
import { useConversationsStore } from '../../stores/conversations';
import { useAuthStore } from '../../stores/auth';
import AdminLayout from '../layouts/AdminLayout.vue';
import { adminUserSupportTicketsRoute } from '../../utils/adminUserSupportTicketsLink';
import { formatAdminUserNavLabelFromKey } from '../../utils/adminUserNavLabel';
import {
    buildAdminUserPropertyRows,
    getAdminUserBannedBanner
} from '../../utils/adminUserDetailProperties';
import router from '../../router';
import { UserApi } from '../../services/api';
import dialogs from '../../services/dialogs.js';

export default {
    name: 'admin-user-detail',
    data() {
        return {
            loading: true,
            user: null,
            userApi: null
        };
    },
    computed: {
        ...mapState(useAuthStore, {
            config: 'appConfig'
        }),
        bannedBanner() {
            return getAdminUserBannedBanner(this.user, this.$t.bind(this));
        },
        propertyRows() {
            return buildAdminUserPropertyRows(this.user, {
                translate: this.$t.bind(this),
                profileIdFormat: this.config && this.config.profile_id_format,
                showFacebookProfileUrl: !!(
                    this.config && this.config.module_facebook_profile_url_enabled
                )
            });
        }
    },
    methods: {
        ...mapActions(useConversationsStore, {
            lookConversation: 'createConversation'
        }),
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
                    this.user = body.data || null;
                    if (!this.user) {
                        dialogs.message(this.$t('noSeEncontroNingunUsuario'), {
                            estado: 'error'
                        });
                        this.$router.replace({ name: 'admin-users' });
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
        toUserMessages() {
            if (!this.user) return;
            this.lookConversation({ user: this.user, tripId: null }).then(
                (conversation) => {
                    router.push({
                        name: 'conversation-chat',
                        params: { id: conversation.id }
                    });
                }
            );
        },
        supportTicketRoute(user) {
            return {
                name: 'admin-support-ticket-new',
                query: {
                    userId: user.id,
                    userName: user.name,
                    type: 'account_verification',
                    subject: this.$t('ticketTypeAccountVerification')
                }
            };
        },
        adminUserSupportTicketsRoute,
        adminUserNavLabel(labelKey, count) {
            return formatAdminUserNavLabelFromKey(this.$t.bind(this), labelKey, count);
        }
    },
    watch: {
        '$route.params.userId'() {
            this.load();
        }
    },
    mounted() {
        this.userApi = new UserApi();
        this.load();
    },
    components: {
        AdminLayout
    }
};
</script>

<style scoped>
.user-settings {
    background-color: #fff;
    border: 1px solid #ddd;
    padding: 10px;
}

.user-admin-view h3 {
    margin-top: 0;
}

.user-admin-view-nav .btn,
.user-admin-view-actions .btn {
    margin-right: 8px;
    margin-bottom: 8px;
}

.medium-icon {
    font-size: 1.5em;
}

.admin-user-detail__back {
    margin-bottom: 12px;
}

.admin-user-detail__status {
    margin-bottom: 16px;
}

.admin-user-detail__properties {
    margin: 0 0 16px;
}

.admin-user-detail__property {
    display: grid;
    grid-template-columns: minmax(140px, 32%) 1fr;
    gap: 8px 16px;
    padding: 8px 0;
    border-bottom: 1px solid #eee;
}

.admin-user-detail__property:last-child {
    border-bottom: none;
}

.admin-user-detail__property dt {
    margin: 0;
    font-weight: 600;
}

.admin-user-detail__property dd {
    margin: 0;
    word-break: break-word;
}
</style>
