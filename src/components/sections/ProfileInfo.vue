<template>
    <div class="profile-info-component profile-info-panel" v-if="profile">
        <template v-if="profile.description">
            <h3 class="profile-info-panel__section-label">{{ $t('sobreMi') }}</h3>
            <p class="profile-info-panel__bio">{{ profile.description }}</p>
        </template>

        <div class="profile-info-panel__tiles">
            <div
                v-if="isIdentityVerified"
                class="profile-info-panel__tile"
            >
                <i
                    class="fa fa-shield profile-info-panel__tile-icon"
                    aria-hidden="true"
                ></i>
                <div>
                    <p class="profile-info-panel__tile-title">
                        {{ $t('identidadVerificadaTitulo') }}
                    </p>
                    <p class="profile-info-panel__tile-sub">
                        {{ $t('identidadVerificadaSub') }}
                    </p>
                </div>
            </div>
            <div
                v-if="responseRateLabel"
                class="profile-info-panel__tile"
            >
                <i
                    class="fa fa-comment profile-info-panel__tile-icon"
                    aria-hidden="true"
                ></i>
                <div>
                    <p class="profile-info-panel__tile-title">
                        {{ responseRateLabel }}
                    </p>
                    <p v-if="responseDelayLabel" class="profile-info-panel__tile-sub">
                        {{ responseDelayLabel }}
                    </p>
                </div>
            </div>
        </div>

        <div
            v-if="badges.length"
            class="profile-badges"
        >
            <img
                v-for="badge in badges"
                :key="badge.id"
                :src="badgeImageUrl(badge.image_path)"
                :alt="badge.title"
                :title="badge.description || badge.title"
                class="profile-badge"
            />
        </div>

        <div class="list-container profile-info-panel__details" v-if="hasPrivateDetails">
            <div class="list-group-item" v-if="profile.email">
                <i class="fa fa-envelope" aria-hidden="true"></i>
                <div class="list-group-item--content">
                    {{ profile.email }}
                </div>
            </div>
            <div class="list-group-item" v-if="formattedNroDoc">
                <i class="fa fa-id-card" aria-hidden="true"></i>
                <div class="list-group-item--content">
                    {{ formattedNroDoc }}
                </div>
            </div>
            <div
                class="list-group-item"
                v-if="
                    config &&
                    config.module_facebook_profile_url_enabled &&
                    profile.facebook_profile_url
                "
            >
                <i class="fa fa-facebook" aria-hidden="true"></i>
                <div class="list-group-item--content">
                    <a
                        :href="profile.facebook_profile_url"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        {{ profile.facebook_profile_url }}
                    </a>
                </div>
            </div>
            <div class="list-group-item" v-if="profile.mobile_phone">
                <i class="fa fa-mobile bigger" aria-hidden="true"></i>
                <div class="list-group-item--content">
                    {{ profile.mobile_phone }}
                </div>
            </div>
            <div
                class="list-group-item profile-cars"
                v-if="visibleCars.length"
            >
                <i class="fa fa-car" aria-hidden="true"></i>
                <div class="list-group-item--content">
                    <div
                        v-for="car in visibleCars"
                        :key="car.id"
                        class="profile-car-patente"
                    >
                        {{ car.patente }}
                    </div>
                </div>
            </div>
        </div>

        <div class="profile-social-accounts" v-if="profile.accounts && profile.accounts.length">
            <div v-for="account in profile.accounts" :key="account.id || account" class="row">
                <div class="col-xs-24">
                    <a
                        :href="
                            'https://www.facebook.com/search/top/?q=' +
                            encodeURIComponent(profile.name)
                        "
                        target="_blank"
                        class="btn-primary btn-search"
                        style="border: 0"
                        :title="$t('cambioFacebook')"
                    >
                        <span>{{ $t('buscarFacebook') }}</span>
                    </a>
                </div>
            </div>
            <div class="row">
                <div class="col-xs-24">
                    <small>{{ $t('cambioFacebook') }}</small>
                </div>
            </div>
        </div>

        <div
            class="profile-info-panel__privacy"
            v-if="!hasPrivateDetails"
        >
            <i class="fa fa-lock" aria-hidden="true"></i>
            <span>{{ $t('contactoPrivacidadPerfil') }}</span>
        </div>

        <div
            class="edit-action profile-friend-actions"
            v-if="user && profile.id !== user.id && showFriendActions"
        >
            <button
                v-if="profile.friendship_state === 'none'"
                class="btn btn-primary"
                :disabled="friendActionLoading"
                v-on:click="onInviteFriend()"
            >
                <i class="fa fa-user" aria-hidden="true"></i>
                {{ $t('invitarAmigos') }}
            </button>
            <button
                v-else-if="profile.friendship_state === 'pending_sent'"
                class="btn btn-primary"
                disabled
            >
                {{ $t('solicitudEnviada') }}
            </button>
            <template v-else-if="profile.friendship_state === 'pending_received'">
                <button
                    class="btn btn-primary"
                    :disabled="friendActionLoading"
                    v-on:click="onAcceptFriend()"
                >
                    {{ $t('aceptar') }}
                </button>
                <button
                    class="btn btn-default"
                    :disabled="friendActionLoading"
                    v-on:click="onRejectFriend()"
                >
                    {{ $t('rechazar') }}
                </button>
            </template>
            <button
                v-else-if="profile.friendship_state === 'friend'"
                class="btn btn-primary"
                :disabled="friendActionLoading"
                v-on:click="onToggleTripAlerts()"
            >
                {{ tripAlertsButtonLabel }}
            </button>
        </div>
        <div
            class="edit-action"
            v-if="user && user.is_admin && profile.id !== user.id"
        >
            <button
                class="btn btn-primary btn-circle"
                v-on:click="messageUser()"
            >
                {{ $t('enviarMensaje') }}
            </button>
        </div>
    </div>
</template>
<script>
import { mapState, mapActions } from 'pinia';
import { useAuthStore } from '../../stores/auth';
import { useProfileStore } from '../../stores/profile';
import { useConversationsStore } from '../../stores/conversations';
import { useFriendsStore } from '../../stores/friends';
import router from '../../router';
import dialogs from '../../services/dialogs.js';
import { formatId } from '../../services/utility';
import { activeCarsWithPlate } from '../../utils/userCars.js';

export default {
    data() {
        return {
            friendActionLoading: false
        };
    },
    computed: {
        ...mapState(useAuthStore, {
            user: 'user',
            config: 'appConfig'
        }),
        ...mapState(useProfileStore, {
            profile: 'user',
            badges: 'badges'
        }),
        formattedNroDoc() {
            if (!this.profile || !this.profile.nro_doc) {
                return '';
            }
            return formatId(this.profile.nro_doc, this.config.profile_id_format);
        },
        visibleCars() {
            return activeCarsWithPlate(this.profile?.cars);
        },
        isIdentityVerified() {
            return !!(
                this.profile &&
                (this.profile.identity_validated ||
                    this.profile.identity_validated_at)
            );
        },
        hasPrivateDetails() {
            return !!(
                this.profile &&
                (this.profile.email ||
                    this.formattedNroDoc ||
                    this.profile.mobile_phone ||
                    this.visibleCars.length ||
                    (this.config &&
                        this.config.module_facebook_profile_url_enabled &&
                        this.profile.facebook_profile_url))
            );
        },
        responseRateLabel() {
            if (
                !this.profile ||
                !this.profile.conversation_opened_count ||
                !this.config?.module_conversation_average_delay
            ) {
                return '';
            }
            const percentage =
                this.profile.conversation_answered_count /
                this.profile.conversation_opened_count;
            return this.$t('respondeMensajesPorcentaje', {
                percent: Math.round(percentage * 100)
            });
        },
        responseDelayLabel() {
            if (
                !this.profile ||
                !this.profile.conversation_answered_count ||
                !this.config?.module_conversation_average_delay
            ) {
                return '';
            }
            const time =
                this.profile.answer_delay_sum /
                this.profile.conversation_answered_count;
            let delay;
            if (time / 3600 > 24) {
                delay = this.$t('masDeUnDia');
            } else if (time / 3600 > 12) {
                delay = this.$t('enElDia');
            } else if (time / 3600 > 1) {
                delay = this.$t('enUnParDeHoras');
            } else {
                delay = this.$t('enElMomento');
            }
            return this.$t('tiempoPromedioRespuesta', { delay });
        },
        showFriendActions() {
            if (!this.profile || !this.user) {
                return false;
            }
            const state = this.profile.friendship_state || 'none';
            return ['none', 'pending_sent', 'pending_received', 'friend'].includes(
                state
            );
        },
        tripAlertsButtonLabel() {
            if (!this.profile || !this.profile.name) {
                return '';
            }
            const params = { name: this.profile.name };
            return this.profile.friend_trip_alerts_enabled
                ? this.$t('detenerAlertasViajeAmigo', params)
                : this.$t('recibirAlertasViajeAmigo', params);
        }
    },
    methods: {
        ...mapActions(useConversationsStore, {
            lookConversation: 'createConversation'
        }),
        ...mapActions(useFriendsStore, {
            requestFriend: 'request',
            acceptFriend: 'accept',
            rejectFriend: 'reject',
            toggleTripAlerts: 'toggleTripAlerts'
        }),
        ...mapActions(useProfileStore, {
            setProfileUser: 'setUser',
            setFriendTripAlertsEnabled: 'setFriendTripAlertsEnabled'
        }),
        updateFriendshipState(friendshipState) {
            this.setProfileUser({
                ...this.profile,
                friendship_state: friendshipState
            });
        },
        runFriendAction(action, friendshipState) {
            this.friendActionLoading = true;
            return action(this.profile.id)
                .then(() => this.updateFriendshipState(friendshipState))
                .finally(() => {
                    this.friendActionLoading = false;
                });
        },
        onInviteFriend() {
            this.runFriendAction(this.requestFriend, 'pending_sent');
        },
        onAcceptFriend() {
            this.runFriendAction(this.acceptFriend, 'friend');
        },
        onRejectFriend() {
            this.runFriendAction(this.rejectFriend, 'none');
        },
        onToggleTripAlerts() {
            this.friendActionLoading = true;
            const friendName = this.profile.name;
            this.toggleTripAlerts(this.profile.id)
                .then((data) => {
                    const enabled = Boolean(
                        data && data.friend_trip_alerts_enabled
                    );
                    this.setFriendTripAlertsEnabled(enabled);
                    dialogs.message(
                        this.$t(
                            enabled
                                ? 'alertasViajeAmigoActivadas'
                                : 'alertasViajeAmigoDesactivadas',
                            { name: friendName }
                        ),
                        { estado: 'success' }
                    );
                })
                .catch(() => {
                    dialogs.message(this.$t('errorAlertasViajeAmigo'), {
                        estado: 'error'
                    });
                })
                .finally(() => {
                    this.friendActionLoading = false;
                });
        },
        messageUser() {
            this.lookConversation(this.profile).then((conversation) => {
                router.push({
                    name: 'conversation-chat',
                    params: { id: conversation.id }
                });
            });
        },
        badgeImageUrl(imagePath) {
            if (!imagePath) return '';
            if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
                return imagePath;
            }
            const base = process.env.ROUTE_BASE + 'img';
            return base + (base && !imagePath.startsWith('/') ? '/' : '') + imagePath;
        }
    }
};
</script>
<style scoped>
.profile-badges {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 12px;
    margin-bottom: 12px;
}

.profile-badge {
    width: 50px;
    height: 50px;
    object-fit: contain;
}

.profile-info-panel__details .list-group-item {
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
    padding: 0.75rem 0;
    border: none;
    border-top: 1px solid #e6e6e6;
    background: transparent;
}

.profile-friend-actions {
    margin-top: 1.25rem;
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
}

.btn-primary {
    display: inline-block;
}
</style>
