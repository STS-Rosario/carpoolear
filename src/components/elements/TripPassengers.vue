<template>
    <div
        class="row passengers"
        v-if="!trip.is_passenger && owner && acceptedPassengers.length"
    >
        <div class="col-xs-24" v-if="owner && acceptedPassengers.length">
            <h4 class="title-margined">
                <strong>{{ t('pasajerosSubidos') }}</strong>
            </h4>
            <div
                v-for="p in acceptedPassengers"
                class="list-item"
                v-bind:key="p.id"
            >
                <span
                    @click="toUserProfile(p)"
                    class="trip_driver_img circle-box passenger trip_passenger_image"
                    v-imgSrc:profile="p.image"
                ></span>
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
                    :aria-label="t('irAMensajes')"
                    class="trip_passenger-chat"
                >
                    <i class="fa fa-comments" aria-hidden="true"></i>
                </a>
                <button
                    @click="removePassenger(p)"
                    class="trip_passenger-remove pull-right"
                    :aria-label="t('bajarPasajeroViaje')"
                >
                    <i class="fa fa-times" aria-hidden="true"></i>
                </button>
            </div>
            <div v-if="trip.passenger.length === 0">
                {{ t('aunNoHayPasajeros') }}
            </div>
        </div>
        <div v-else style="height: 2em"></div>
        <div
            class="col-xs-24"
            v-if="owner && waitingForPaymentsPassengers.length"
        >
            <h4 class="title-margined">
                <strong>{{ t('pasajerosPendientePago') }}</strong>
            </h4>
            <div
                v-for="p in waitingForPaymentsPassengers"
                class="list-item"
                v-bind:key="p.id"
            >
                <span
                    @click="toUserProfile(p)"
                    class="trip_driver_img circle-box passenger trip_passenger_image"
                    v-imgSrc:profile="p.image"
                ></span>
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
                    :aria-label="t('irAMensajes')"
                    class="trip_passenger-chat"
                >
                    <i class="fa fa-comments" aria-hidden="true"></i>
                </a>
                <button
                    @click="removePassenger(p)"
                    class="trip_passenger-remove pull-right"
                    :aria-label="t('bajarPasajeroViaje')"
                >
                    <i class="fa fa-times" aria-hidden="true"></i>
                </button>
            </div>
        </div>
    </div>
</template>
<script setup>
import { ref, computed, watch, onMounted, nextTick } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { useTripsStore } from '@/stores/trips';
import { useAuthStore } from '@/stores/auth';
import { useConversationsStore } from '@/stores/conversations';
import { usePassengerStore } from '@/stores/passenger';
import dialogs from '../../services/dialogs.js';
import bus from '../../services/bus-event';

const { t } = useI18n();
const router = useRouter();
const tripsStore = useTripsStore();
const authStore = useAuthStore();
const conversationsStore = useConversationsStore();
const passengerStore = usePassengerStore();

const sending = ref(false);

const trip = computed(() => tripsStore.currentTrip);
const tripCardTheme = computed(() => authStore.tripCardTheme);
const user = computed(() => authStore.user);

const owner = computed(() => {
    return trip.value && user.value && user.value.id === trip.value.user.id;
});

const acceptedPassengers = computed(() => {
    console.log('acceptedPassengers', trip.value);
    return trip.value.allPassengerRequest
        ? trip.value.allPassengerRequest.filter(
              (item) => item.request_state === 1
          )
        : [];
});

const waitingForPaymentsPassengers = computed(() => {
    return trip.value.allPassengerRequest
        ? trip.value.allPassengerRequest.filter(
              (item) => item.request_state === 4
          )
        : [];
});

function calculateHeight() {
    nextTick(() => {
        bus.emit('calculate-height');
    });
}

function toUserMessages(targetUser) {
    conversationsStore.createConversation(targetUser)
        .then((conversation) => {
            router.push({
                name: 'conversation-chat',
                params: { id: conversation.id }
            });
        })
        .catch((error) => {
            console.error(error);
            sending.value = false;
        });
}

function toUserProfile(targetUser) {
    router.replace({
        name: 'profile',
        params: {
            id: targetUser.id,
            userProfile: targetUser,
            activeTab: 1
        }
    });
}

function removePassenger(targetUser) {
    if (
        window.confirm(
            t('seguroBajarPasajero')
        )
    ) {
        sending.value = true;
        passengerStore.cancel({ user: targetUser, trip: trip.value })
            .then(() => {
                sending.value = false;
                dialogs.message(t('removerPasajeroExitoso'), {
                    estado: 'success'
                });
            })
            .catch(() => {
                sending.value = false;
            });
    }
}

watch(acceptedPassengers, () => {
    calculateHeight();
});

watch(waitingForPaymentsPassengers, () => {
    calculateHeight();
});

onMounted(() => {
    calculateHeight();
});
</script>
<style scoped>
.trip_driver_img.circle-box.passenger {
    width: 3.5em;
    height: 3.5em;
    position: relative;
    margin-right: 0.5em;
}
.passengers {
    margin-bottom: 0.8em;
}
.trip_passenger-chat,
.trip_passenger-remove,
.trip_passenger_image,
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
@media only screen and (min-width: 400px) and (max-width: 767px) {
    .trip_driver_img {
        width: 6.7rem;
        height: 6.7rem;
    }
}
</style>
