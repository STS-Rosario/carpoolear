<template>
    <div class="pending-friend-requests" v-if="hasPending">
        <router-link
            :to="{ name: 'friends_setting' }"
            class="pending-friend-requests-card"
        >
            <div class="pending-friend-requests-card__icon" aria-hidden="true">
                <i class="fa fa-user"></i>
            </div>
            <div class="pending-friend-requests-card__body">
                <div class="pending-friend-requests-card__title">
                    {{ $t('solicitudesDeAmistad') }}
                </div>
                <p class="pending-friend-requests-card__text">
                    {{ $t('tenesInvitacionesAmigosAntesClick') }}
                    <strong>{{ $t('clickAca') }}</strong>
                    {{ $t('paraVerlasInvitacionesAmigos') }}
                </p>
            </div>
            <i
                class="fa fa-chevron-right pending-friend-requests-card__chevron"
                aria-hidden="true"
            ></i>
        </router-link>
    </div>
</template>

<script>
import { mapState } from 'pinia';
import { useFriendsStore } from '../../stores/friends';

export default {
    name: 'pending-friend-requests-card',

    computed: {
        ...mapState(useFriendsStore, {
            hasPending: 'hasPendingFriendRequests'
        })
    }
};
</script>

<style scoped>
.pending-friend-requests {
    margin: 0 auto 1.25rem;
    max-width: 500px;
}

.pending-friend-requests-card {
    display: flex;
    align-items: center;
    gap: 0.85rem;
    padding: 1rem 1.1rem;
    border-radius: 16px;
    background: #fce4e4;
    color: inherit;
    text-decoration: none;
}

.pending-friend-requests-card:hover,
.pending-friend-requests-card:focus {
    color: inherit;
    text-decoration: none;
}

.pending-friend-requests-card__icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 50px;
    height: 50px;
    max-width: 50px;
    max-height: 50px;
    flex-shrink: 0;
    border-radius: 50%;
    background: #e53935;
    color: #fff;
    font-size: 1.25rem;
}

.pending-friend-requests-card__body {
    flex: 1 1 auto;
    min-width: 0;
}

.pending-friend-requests-card__title {
    font-size: 1rem;
    font-weight: 700;
    line-height: 1.25;
    margin-bottom: 0.2rem;
}

.pending-friend-requests-card__text {
    margin: 0;
    font-size: 0.95rem;
    line-height: 1.35;
    color: #333;
}

.pending-friend-requests-card__chevron {
    flex-shrink: 0;
    color: #555;
    font-size: 1.1rem;
}
</style>
