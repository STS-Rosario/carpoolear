<template>
    <div class="incoming-friend-request-card">
        <router-link
            class="incoming-friend-request-card__avatar"
            :to="profileRoute"
        >
            <div
                class="incoming-friend-request-card__photo circle-box"
                v-imgSrc:profile="user.image"
            ></div>
        </router-link>
        <div class="incoming-friend-request-card__body">
            <div class="incoming-friend-request-card__name-row">
                <router-link
                    class="incoming-friend-request-card__name"
                    :to="profileRoute"
                >
                    {{ user.name }}
                </router-link>
                <span
                    v-if="isVerified"
                    class="incoming-friend-request-card__verified"
                    :title="$t('usuarioVerificado')"
                >
                    <i class="fa fa-shield" aria-hidden="true"></i>
                </span>
            </div>
            <div class="incoming-friend-request-card__meta">
                <span
                    v-if="memberSinceLabel"
                    class="incoming-friend-request-card__member-since"
                >
                    {{ memberSinceLabel }}
                </span>
                <router-link
                    class="incoming-friend-request-card__profile-link"
                    :to="profileRoute"
                >
                    {{ $t('verPerfil') }}
                </router-link>
            </div>
        </div>
        <div class="incoming-friend-request-card__actions">
            <AppButton
                variant="tertiary"
                tone="destructive"
                icon-right="fa fa-times"
                :disabled="isRequesting"
                @click="$emit('reject', user)"
            >
                {{ $t('rechazar') }}
            </AppButton>
            <AppButton
                variant="primary"
                icon-right="fa fa-check"
                :disabled="isRequesting"
                @click="$emit('accept', user)"
            >
                <span v-if="!isRequesting">{{ $t('aceptar') }}</span>
                <span v-else>{{ $t('enProceso') }}</span>
            </AppButton>
        </div>
    </div>
</template>

<script>
import AppButton from '../ui/AppButton.vue';
import { getMembershipDuration } from '../../utils/profileMemberStats.js';

export default {
    name: 'incoming-friend-request-card',

    components: {
        AppButton
    },

    props: {
        user: {
            type: Object,
            required: true
        },
        idRequesting: {
            type: Number,
            default: 0
        }
    },

    emits: ['accept', 'reject'],

    computed: {
        isRequesting() {
            return this.idRequesting === this.user.id;
        },
        isVerified() {
            return !!(
                this.user &&
                (this.user.identity_validated ||
                    this.user.identity_validated_at)
            );
        },
        memberSinceLabel() {
            const duration = getMembershipDuration(this.user?.created_at);
            if (!duration) {
                return '';
            }
            if (duration.unit === 'years') {
                return duration.count === 1
                    ? this.$t('miembroHaceUnAnio')
                    : this.$t('miembroHaceAnios', { count: duration.count });
            }
            if (duration.unit === 'months') {
                return duration.count === 1
                    ? this.$t('miembroHaceUnMes')
                    : this.$t('miembroHaceMeses', { count: duration.count });
            }
            return duration.count === 1
                ? this.$t('miembroHaceUnDia')
                : this.$t('miembroHaceDias', { count: duration.count });
        },
        profileRoute() {
            return {
                name: 'profile',
                params: {
                    id: this.user.id,
                    userProfile: this.user,
                    activeTab: 1
                }
            };
        }
    }
};
</script>

<style scoped>
.incoming-friend-request-card {
    display: flex;
    align-items: center;
    gap: 0.85rem;
    width: 100%;
    max-width: 100%;
    margin: 0;
    padding: 1rem 0;
    border-bottom: 1px solid #e5e5e5;
    background: transparent;
}

.incoming-friend-request-card__avatar {
    flex-shrink: 0;
    text-decoration: none;
}

.incoming-friend-request-card__photo {
    width: 48px;
    height: 48px;
    max-width: 48px;
    max-height: 48px;
}

.incoming-friend-request-card__body {
    flex: 1 1 auto;
    min-width: 0;
}

.incoming-friend-request-card__name-row {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    min-width: 0;
}

.incoming-friend-request-card__name {
    display: inline-block;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 1rem;
    font-weight: 700;
    line-height: 1.3;
    color: #222;
    text-decoration: none;
}

.incoming-friend-request-card__name:hover,
.incoming-friend-request-card__name:focus {
    text-decoration: underline;
}

.incoming-friend-request-card__verified {
    flex-shrink: 0;
    color: var(--ds-action, #1e5f9e);
    font-size: 0.95rem;
    line-height: 1;
}

.incoming-friend-request-card__meta {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.5rem 0.75rem;
    margin-top: 0.2rem;
}

.incoming-friend-request-card__member-since {
    font-size: 0.85rem;
    line-height: 1.3;
    color: #888;
}

.incoming-friend-request-card__profile-link {
    font-size: 0.85rem;
    line-height: 1.3;
    font-weight: 600;
    color: var(--ds-action, #1e5f9e);
    text-decoration: none;
}

.incoming-friend-request-card__profile-link:hover,
.incoming-friend-request-card__profile-link:focus {
    text-decoration: underline;
}

.incoming-friend-request-card__actions {
    display: flex;
    flex-shrink: 0;
    flex-wrap: wrap;
    align-items: center;
    justify-content: flex-end;
    gap: 0.5rem;
    margin-left: auto;
}

@media only screen and (max-width: 640px) {
    .incoming-friend-request-card {
        flex-wrap: wrap;
    }

    .incoming-friend-request-card__actions {
        width: 100%;
        margin-left: 0;
        padding-left: calc(48px + 0.85rem);
        justify-content: flex-start;
    }
}
</style>
