<template>
    <div class="trip-invite-friends">
        <p>{{ $t('queresInvitarTusAmigos') }}</p>
        <div v-if="friends && friends.length" class="trip-invite-friends__list">
            <div class="checkbox">
                <label>
                    <input
                        type="checkbox"
                        v-model="inviteAllFriends"
                        @change="onInviteAllChange"
                    />
                    {{ $t('invitarATodosMisAmigos') }}
                </label>
            </div>
            <div
                v-for="friend in friends"
                :key="friend.id"
                class="trip-invite-friends__friend"
            >
                <label>
                    <input
                        type="checkbox"
                        v-model="selectedFriendIds"
                        :value="friend.id"
                    />
                    {{ friend.name }}
                </label>
            </div>
        </div>
        <p v-else class="text-muted">{{ $t('noTienesNingunAmigoAun') }}</p>
        <div class="trip-invite-friends__actions">
            <button
                class="btn btn-primary"
                :disabled="submitting || !selectedFriendIds.length"
                @click="onSubmit"
            >
                {{ $t('invitarAmigos') }}
            </button>
            <button class="btn btn-default" @click="onClose">
                {{ $t('cerrar') }}
            </button>
        </div>
    </div>
</template>

<script>
import { mapState, mapActions } from 'pinia';
import { useFriendsStore } from '../../stores/friends';
import TripApi from '../../services/api/Trips';
import dialogs from '../../services/dialogs.js';

const tripApi = new TripApi();

export default {
    name: 'trip_invite_friends',

    props: {
        tripId: {
            type: [Number, String],
            required: true
        }
    },

    emits: ['close'],

    data() {
        return {
            selectedFriendIds: [],
            inviteAllFriends: false,
            submitting: false
        };
    },

    computed: {
        ...mapState(useFriendsStore, {
            friends: 'friends'
        })
    },

    methods: {
        ...mapActions(useFriendsStore, {
            loadFriends: 'friendsSearch'
        }),
        onInviteAllChange() {
            if (this.inviteAllFriends && Array.isArray(this.friends)) {
                this.selectedFriendIds = this.friends.map((friend) => friend.id);
            } else if (!this.inviteAllFriends) {
                this.selectedFriendIds = [];
            }
        },
        inviteFriends(tripId, friendIds) {
            return tripApi.inviteFriends(tripId, friendIds);
        },
        onSubmit() {
            if (!this.selectedFriendIds.length) {
                return;
            }
            this.submitting = true;
            this.inviteFriends(this.tripId, this.selectedFriendIds)
                .then(() => {
                    dialogs.message(this.$t('invitarAmigos'), {
                        estado: 'success'
                    });
                    this.$emit('close');
                })
                .catch(() => {
                    dialogs.message(this.$t('problemaAlCargarElViaje'), {
                        estado: 'error'
                    });
                })
                .finally(() => {
                    this.submitting = false;
                });
        },
        onClose() {
            this.$emit('close');
        }
    },

    mounted() {
        this.loadFriends({});
    }
};
</script>

<style scoped>
.trip-invite-friends__friend {
    margin: 0.4rem 0;
}

.trip-invite-friends__actions {
    margin-top: 1rem;
}

.trip-invite-friends__actions .btn + .btn {
    margin-left: 0.5rem;
}
</style>
