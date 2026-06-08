<template>
    <div class="profile-info-component" v-if="profile">
        <div class="list-group">
            <div class="pic-info col-sm-6">
                <div
                    class="circle-box profile"
                    v-imgSrc:profile="profile.image"
                ></div>
                <div class="profile-info">
                    <div class="profile-info--name mobile">
                        <UserNameWithBadge :user="profile" />
                    </div>
                    <div class="profile-info--ratings">
                        <i class="fa fa-thumbs-up" aria-hidden="true"></i>
                        <span>{{ profile.positive_ratings }}</span>
                        <i class="fa fa-thumbs-down" aria-hidden="true"></i>
                        <span>{{ profile.negative_ratings }}</span>
                    </div>
                    <div
                        v-if="memberSinceLabel || participatedTripsLabel"
                        class="profile-info--member-stats"
                    >
                        <div v-if="memberSinceLabel">{{ memberSinceLabel }}</div>
                        <div v-if="participatedTripsLabel">
                            {{ participatedTripsLabel }}
                        </div>
                    </div>
                </div>
                <div v-if="badges.length" class="profile-badges">
                    <img
                        v-for="badge in badges"
                        :key="badge.id"
                        :src="badgeImageUrl(badge.image_path)"
                        :alt="badge.title"
                        :title="badge.description || badge.title"
                        class="profile-badge"
                    />
                </div>
                <div class="profile-social-accounts">
                    <div v-for="account in profile.accounts" class="row">
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
                                <span class="">{{ $t('buscarFacebook') }}</span>
                            </a>
                            <!-- app_scoped_user_id -->
                        </div>
                    </div>
                    <div
                        class="row"
                        v-if="profile.accounts && profile.accounts.length"
                    >
                        <div class="col-xs-24">
                            <small>{{ $t('cambioFacebook') }}</small>
                        </div>
                    </div>
                </div>
            </div>
            <div class="data-info col-sm-offset-2 col-sm-16 col-md-offset-1">
                <div class="profile-info--name desktop"><UserNameWithBadge :user="profile" /></div>
                <div class="list-container">
                    <div class="list-group-item" v-if="profile.description">
                        <i class="fa fa-quote-left" aria-hidden="true"></i>
                        <div class="list-group-item--content italic">
                            {{ profile.description }}
                        </div>
                    </div>

                    <div class="list-group-item" v-if="profile.email">
                        <i class="fa fa-envelope" aria-hidden="true"></i>
                        <div class="list-group-item--content">
                            {{ profile.email }}
                        </div>
                    </div>
                    <div class="list-group-item">
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
                <div
                    class="edit-action"
                    v-if="user.is_admin && profile.id !== user.id"
                >
                    <button
                        class="btn btn-primary btn-circle"
                        v-on:click="messageUser()"
                    >
                        {{ $t('enviarMensaje') }}
                    </button>
                </div>
                <div class="edit-action" v-if="profile.id === user.id">
                    <router-link
                        class="btn btn-primary"
                        tag="button"
                        :to="{ name: 'profile_update' }"
                    >
                        {{ $t('editarPerfil') }}
                    </router-link>
                    <router-link
                        v-if="identityValidationAvailable"
                        class="btn btn-primary"
                        tag="button"
                        :to="{ name: 'identity_validation' }"
                    >
                        {{ $t('validarIdentidad') }}
                    </router-link>
                    <router-link
                        class="btn btn-primary"
                        tag="button"
                        :to="{ name: 'friends_setting' }"
                    >
                        {{ $t('verAmigos') }}
                    </router-link>
                    <router-link
                        class="btn btn-primary"
                        tag="button"
                        :to="{ name: 'debug_setting' }"
                    >
                        {{ $t('debug') }}
                    </router-link>
                    <router-link
                        v-if="config && config.module_trip_seats_payment"
                        class="btn btn-primary"
                        tag="button"
                        :to="{ name: 'transacciones' }"
                    >
                        {{ $t('transacciones') }}
                    </router-link>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { mapState, mapActions } from 'pinia';
import { useAuthStore } from '../../stores/auth';
import { useProfileStore } from '../../stores/profile';
import { useConversationsStore } from '../../stores/conversations';
import router from '../../router';
import UserNameWithBadge from '../elements/UserNameWithBadge.vue';
import { formatId } from '../../services/utility';
import { activeCarsWithPlate } from '../../utils/userCars.js';
import {
    formatMemberSinceMonthYear,
    normalizeTripsCount
} from '../../utils/profileMemberStats.js';

export default {
    computed: {
        ...mapState(useAuthStore, {
            user: 'user',
            config: 'appConfig'
        }),
        ...mapState(useProfileStore, {
            profile: 'user',
            badges: 'badges'
        }),
        identityValidationAvailable() {
            const c = this.config;
            return (
                c &&
                c.identity_validation_enabled === true &&
                (c.identity_validation_mercado_pago_enabled === true ||
                    c.identity_validation_manual_enabled === true)
            );
        },
        formattedNroDoc() {
            return formatId(this.profile.nro_doc, this.config.profile_id_format);
        },
        visibleCars() {
            return activeCarsWithPlate(this.profile?.cars);
        },
        memberSinceLabel() {
            const date = formatMemberSinceMonthYear(this.profile?.created_at);
            return date ? this.$t('miembroDesde', { date }) : '';
        },
        participatedTripsLabel() {
            if (!this.profile || this.profile.trips_count == null) {
                return '';
            }

            return this.$t('perfilViajesParticipados', {
                count: normalizeTripsCount(this.profile.trips_count)
            });
        }
    },
    methods: {
        ...mapActions(useConversationsStore, {
            lookConversation: 'createConversation'
        }),
        messageUser() {
            console.log('messageUser profileInfo', this.profile);
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
    },
    components: {
        UserNameWithBadge
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

.btn-primary {
    display: inline-block;
}
.label-reply {
    display: block;
    padding: 0;
    font-size: 0.9rem;
    font-weight: bold;
    line-height: 1.5em;
    color: #333;
    text-align: left;
    border-radius: 0;
}
.reply-btns button {
    min-width: 7rem;
}
</style>
