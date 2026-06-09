<template>
    <div class="col-xs-24" v-if="hasPending">
        <router-link
            :to="{ name: 'friends_setting' }"
            class="pending-friend-requests-card"
        >
            <div class="rate-pending_component clearfix">
                <div class="rate-pending-message">
                    <div class="rate-pending-message--content">
                        <i class="fa fa-user" aria-hidden="true"></i>
                        {{ $t('tenesInvitacionesAmigosClickParaVerlas') }}
                    </div>
                </div>
                <div class="float-margin">
                    <i class="fa fa-chevron-right" aria-hidden="true"></i>
                </div>
            </div>
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
.pending-friend-requests-card {
    display: block;
    color: inherit;
    text-decoration: none;
    margin-bottom: 1em;
}

.pending-friend-requests-card:hover,
.pending-friend-requests-card:focus {
    color: inherit;
    text-decoration: none;
}
</style>
