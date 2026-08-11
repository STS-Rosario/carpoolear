<template>
    <div
        class="row passengers trip-detail__passengers"
        v-if="
            displayPassengers.length ||
            (owner && waitingForPaymentsPassengers.length)
        "
    >
        <div class="col-xs-24" v-if="displayPassengers.length">
            <h4 class="title-margined" :class="{ 'trip-detail__section-title': isMobile }">
                <strong>{{ joinedTitle }}</strong>
            </h4>
            <div
                v-for="p in displayPassengers"
                class="list-item"
                v-bind:key="p.id"
            >
                <span
                    @click="toUserProfile(p)"
                    class="trip_passenger_avatar"
                >
                    <i class="fa fa-user" aria-hidden="true"></i>
                </span>
                <a
                    href="#"
                    @click="toUserProfile(p)"
                    class="trip_passenger_name"
                >
                    {{ p.first_name }}
                </a>
                <a
                    v-if="owner"
                    href="#"
                    @click="toUserMessages(p)"
                    :aria-label="$t('irAMensajes')"
                    class="trip_passenger-chat"
                >
                    <i class="fa fa-comments" aria-hidden="true"></i>
                </a>
                <button
                    v-if="owner"
                    @click="removePassenger(p)"
                    class="trip_passenger-remove pull-right"
                    :aria-label="$t('bajarPasajeroViaje')"
                >
                    <i class="fa fa-times" aria-hidden="true"></i>
                </button>
            </div>
        </div>
        <div
            class="col-xs-24"
            v-if="owner && waitingForPaymentsPassengers.length"
        >
            <h4 class="title-margined">
                <strong>{{ $t('pasajerosPendientePago') }}</strong>
            </h4>
            <div
                v-for="p in waitingForPaymentsPassengers"
                class="list-item"
                v-bind:key="p.id"
            >
                <span
                    @click="toUserProfile(p)"
                    class="trip_passenger_avatar"
                >
                    <i class="fa fa-user" aria-hidden="true"></i>
                </span>
                <a
                    href="#"
                    @click="toUserProfile(p)"
                    class="trip_passenger_name"
                >
                    {{ p.user ? p.user.name : p.name }}
                </a>
                <a
                    href="#"
                    @click="toUserMessages(p)"
                    :aria-label="$t('irAMensajes')"
                    class="trip_passenger-chat"
                >
                    <i class="fa fa-comments" aria-hidden="true"></i>
                </a>
                <button
                    @click="removePassenger(p)"
                    class="trip_passenger-remove pull-right"
                    :aria-label="$t('bajarPasajeroViaje')"
                >
                    <i class="fa fa-times" aria-hidden="true"></i>
                </button>
            </div>
        </div>
    </div>
</template>
<script>
import { mapState, mapActions } from 'pinia';
import { useTripsStore } from '../../stores/trips';
import { useAuthStore } from '../../stores/auth';
import { useDeviceStore } from '../../stores/device';
import { useConversationsStore } from '../../stores/conversations';
import { usePassengerStore } from '../../stores/passenger';
import router from '../../router';
import dialogs from '../../services/dialogs.js';
import bus from '../../services/bus-event';
export default {
    name: 'TripPassengers',
    data() {
        return {};
    },
    props: {
        sectionTitle: {
            type: String,
            default: ''
        }
    },
    computed: {
        ...mapState(useTripsStore, {
            trip: 'currentTrip'
        }),
        ...mapState(useAuthStore, {
            tripCardTheme: 'tripCardTheme',
            user: 'user'
        }),
        ...mapState(useDeviceStore, {
            isMobile: 'isMobile'
        }),
        joinedTitle() {
            if (this.sectionTitle) {
                return this.sectionTitle;
            }
            return this.isMobile
                ? this.$t('tripDetailJoined')
                : this.$t('pasajerosSubidos');
        },
        owner() {
            return this.trip && this.user && this.user.id === this.trip.user.id;
        },
        displayPassengers() {
            if (Array.isArray(this.trip.passenger) && this.trip.passenger.length) {
                return this.trip.passenger;
            }
            return [];
        },
        waitingForPaymentsPassengers() {
            return this.trip.allPassengerRequest
                ? this.trip.allPassengerRequest.filter(
                      (item) => item.request_state === 4
                  )
                : [];
        }
    },
    components: {},
    mounted() {
        this.calculateHeight();
    },
    methods: {
        ...mapActions(useConversationsStore, {
            lookConversation: 'createConversation'
        }),
        ...mapActions(usePassengerStore, {
            cancel: 'cancel'
        }),
        calculateHeight() {
            this.$nextTick(() => {
                bus.emit('calculate-height');
            });
        },
        passengerUser(passenger) {
            if (passenger.user) {
                return passenger.user;
            }
            const passengerId = passenger.id;
            const request = this.trip.allPassengerRequest?.find(
                (item) =>
                    item.user?.id === passengerId || item.id === passengerId
            );
            if (request?.user) {
                return request.user;
            }
            return passenger;
        },
        toUserMessages(passenger) {
            const user = this.passengerUser(passenger);
            this.lookConversation(user)
                .then((conversation) => {
                    router.push({
                        name: 'conversation-chat',
                        params: { id: conversation.id }
                    });
                })
                .catch((error) => {
                    console.error(error);
                    this.sending = false;
                });
        },
        toUserProfile(passenger) {
            const user = this.passengerUser(passenger);
            router.replace({
                name: 'profile',
                params: {
                    id: user.id,
                    userProfile: user,
                    activeTab: 1
                }
            });
        },
        removePassenger(passenger) {
            const user = this.passengerUser(passenger);
            if (
                window.confirm(
                    this.$t('seguroBajarPasajero')
                )
            ) {
                this.sending = true;
                this.cancel({ user: user, trip: this.trip })
                    .then(() => {
                        this.sending = false;
                        dialogs.message(this.$t('removerPasajeroExitoso'), {
                            estado: 'success'
                        });
                    })
                    .catch(() => {
                        this.sending = false;
                    });
            }
        }
    },
    watch: {
        displayPassengers() {
            this.calculateHeight();
        },
        waitingForPaymentsPassengers() {
            this.calculateHeight();
        }
    }
};
</script>
<style scoped>
.passengers {
    margin-bottom: 0.8em;
}
.trip_passenger-chat,
.trip_passenger-remove,
.trip_passenger_avatar,
.trip_passenger_name {
    vertical-align: middle;
    cursor: pointer;
}
.trip_passenger-chat,
.trip_passenger-remove {
    font-size: 1.8em;
    background: none;
    border: 0;
}
.trip_passenger-remove {
    margin-left: 0.5em;
    margin-top: 0.25em;
}
.trip_passenger-chat {
    margin-left: 0.5em;
}
</style>
