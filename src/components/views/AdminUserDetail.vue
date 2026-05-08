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
                        <h3>
                            {{ user.name }}
                            <small class="text-muted">#{{ user.id }}</small>
                        </h3>
                        <p>
                            <strong>{{ $t('eMail') }}:</strong>
                            {{ user.email || '—' }}
                        </p>
                        <p>
                            <strong>{{ $t('numeroDeTelefono') }}:</strong>
                            {{ user.mobile_phone || '—' }}
                        </p>
                        <p>
                            <strong>{{ $t('doc') }}:</strong>
                            {{ user.nro_doc || '—' }}
                        </p>
                        <p>
                            <strong>{{ $t('ultimaConexion') }}</strong>
                            {{ user.last_connection || '—' }}
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
                                :to="{
                                    name: 'admin-support-ticket-new',
                                    query: {
                                        userId: user.id,
                                        userName: user.name,
                                        type: 'account_verification',
                                        subject: $t('ticketTypeAccountVerification')
                                    }
                                }"
                                class="btn btn-default"
                            >
                                {{ $t('crearTicketSoporte') }}
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
import { mapActions } from 'pinia';
import { useConversationsStore } from '../../stores/conversations';
import AdminLayout from '../layouts/AdminLayout.vue';
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
</style>
