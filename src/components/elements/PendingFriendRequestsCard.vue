<template>
    <div class="pending-friend-requests" v-if="hasPending">
        <router-link
            :to="FRIENDS_SOLICITUDES_RECIBIDAS_ROUTE"
            class="home-prompt-banner pending-friend-requests-card"
        >
            <div class="home-prompt-banner__icon" aria-hidden="true">
                <i class="fa fa-user-plus"></i>
            </div>
            <div class="home-prompt-banner__body">
                <div class="home-prompt-banner__title">
                    {{ $t('solicitudesDeAmistad') }}
                </div>
                <p class="home-prompt-banner__text">
                    {{ $t('tenesInvitacionesAmigosAntesClick') }}
                    <strong>{{ $t('clickAca') }}</strong>
                    {{ $t('paraVerlasInvitacionesAmigos') }}
                </p>
            </div>
        </router-link>
    </div>
</template>

<script>
import { mapState } from 'pinia';
import { useFriendsStore } from '../../stores/friends';
import { FRIENDS_SOLICITUDES_RECIBIDAS_ROUTE } from '../../utils/friendsDeepLinks';

export default {
    name: 'pending-friend-requests-card',

    data() {
        return {
            FRIENDS_SOLICITUDES_RECIBIDAS_ROUTE
        };
    },

    computed: {
        ...mapState(useFriendsStore, {
            hasPending: 'hasPendingFriendRequests'
        })
    }
};
</script>

<style scoped>
.pending-friend-requests {
    margin-top: 1rem;
    margin-right: auto;
    margin-bottom: 1.25rem;
    margin-left: auto;
    max-width: 500px;
}
</style>
