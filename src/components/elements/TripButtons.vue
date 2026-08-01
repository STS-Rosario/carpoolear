<template>
    <div>
        <div
            class="buttons-container"
            v-if="!isPassengersView || (isPassengersView && owner)"
        >
            <AppButton
                v-if="owner && !expired"
                variant="primary"
                block
                :to="{ name: 'update-trip', params: { id: trip.id } }"
            >
                {{ $t('editarViaje') }}
            </AppButton>
            <AppButton
                v-if="owner && !expired"
                variant="tertiary"
                tone="destructive"
                block
                :disabled="sendingStatus"
                :loading="Boolean(sending && sending.deleteAction)"
                @click="$emit('deleteTrip')"
            >
                {{ $t('cancelarViaje') }}
                <template #loading>
                    <spinner class="blue"></spinner>
                </template>
            </AppButton>
            <template v-if="showMessageButton">
                <AppButton
                    v-if="!owner"
                    variant="primary"
                    block
                    :disabled="sendingStatus || seatRequestLimitReached"
                    :loading="Boolean(sending && sending.sendMessageAction)"
                    @click="$emit('toMessages')"
                >
                    {{ $t('enviarMensaje') }}
                    <template #loading>
                        <spinner class="blue"></spinner>
                    </template>
                </AppButton>
            </template>
            <template v-if="!owner && !trip.is_passenger && !expired">
                <template v-if="!isPassenger">
                    <AppButton
                        :variant="showMessageButton ? 'secondary' : 'primary'"
                        block
                        @click="$emit('onMakeRequest')"
                        v-if="canRequest && trip.seats_available > 0"
                        :disabled="sendingStatus || seatRequestLimitReached"
                        :loading="Boolean(sending && sending.requestAction)"
                        :class="{ 'trip-detail__cta-secondary': showMessageButton }"
                    >
                        <template v-if="trip.user.autoaccept_requests">
                            <template
                                v-if="
                                    config &&
                                    config.module_trip_seats_payment
                                "
                            >
                                {{ $t('reservar') }}
                                <template
                                    v-if="isVoluntaryContributionSeatPrice(trip.seat_price_cents)"
                                    >{{ $t('loQueSePuedaAportar') }}</template
                                >
                                <template v-else>{{
                                    $n(trip.seat_price_cents / 100, 'currency')
                                }}</template>
                            </template>
                            <template v-else>{{ $t('reservar') }}</template>
                        </template>
                        <template
                            v-else-if="config.module_coordinate_by_message"
                        >
                            {{ $t('enviarMensaje') }}
                        </template>
                        <template v-else>{{ $t('solicitarAsiento') }}</template>
                        <template #loading>
                            <spinner class="blue"></spinner>
                        </template>
                    </AppButton>
                    <button
                        class="btn"
                        v-if="!canRequest"
                        @click="$emit('cancelRequest')"
                        :disabled="sendingStatus"
                    >
                        <spinner
                            class="blue"
                            v-if="sending && sending.requestAction"
                        ></spinner>
                        <span v-else>{{ $t('solicitadoRetirar') }}</span>
                    </button>
                </template>

                <template v-if="isPassenger">
                    <button
                        class="btn btn-primary"
                        @click="$emit('cancelRequest')"
                        v-if="canRequest"
                        :disabled="sendingStatus"
                    >
                        <spinner
                            class="blue"
                            v-if="sending && sending.requestAction"
                        ></spinner>
                        <span v-else>{{ $t('bajarmeViaje') }}</span>
                    </button>
                </template>
            </template>
            <template v-if="expired">
                <button class="btn btn-primary" disabled>{{ $t('finalizado') }}</button>
            </template>
            <router-link
                v-if="showLiveLocationShare"
                class="btn btn-primary live-location-share-btn"
                :to="{ name: 'trip_live_share', params: { id: trip.id } }"
            >
                <i class="fa fa-wifi live-location-share-btn__icon" aria-hidden="true"></i>
                {{ $t('compartirUbicacionTiempoReal') }}
            </router-link>
            <button
                v-if="showGroupChatButton"
                class="btn btn-primary group-chat-btn"
                @click="$emit('toGroupChat')"
                :disabled="sendingStatus"
            >
                <spinner
                    class="blue"
                    v-if="sending && sending.groupChatAction"
                ></spinner>
                <template v-else>
                    <i class="fa fa-comments" aria-hidden="true"></i>
                    {{ $t('groupChatButton') }}
                    <span
                        v-if="groupChatUnreadCount > 0"
                        class="group-chat-btn__badge"
                    >
                        {{ groupChatUnreadCount }}
                    </span>
                </template>
            </button>
            <template v-if="trip.seats_available === 0 && !trip.is_passenger">
                <div class="carpooled-trip">{{ $t('viajeCarpooleado') }}</div>
            </template>
            <div
                class="alert alert-warning"
                role="alert"
                v-if="
                    config.module_show_pending_request_count &&
                    !isPassengersView &&
                    !owner &&
                    trip.passengerPending_count > 2
                "
                >
                    {{ $t('atencionViajeSolicitado', { count: trip.passengerPending_count }) }}
                </div>
            <div
                class="alert alert-warning"
                role="alert"
                v-if="showPassengerSeatRequestLimitMessage"
            >
                {{
                    $t('tripSeatRequestLimitPassengerMessage', {
                        limit: trip.seat_request_limit,
                    })
                }}
            </div>
        </div>
        <div class="buttons-container" v-if="isPassengersView && !owner">
            <template v-if="true">
                <AppButton
                    v-if="!owner"
                    variant="primary"
                    block
                    :disabled="sendingStatus || seatRequestLimitReached"
                    :loading="Boolean(sending && sending.sendMessageAction)"
                    @click="$emit('toMessages')"
                >
                    {{ $t('enviarMensaje') }}
                    <template #loading>
                        <spinner class="blue"></spinner>
                    </template>
                </AppButton>
            </template>
        </div>
    </div>
</template>
<script>
import { mapState } from 'pinia';
import { useTripsStore } from '../../stores/trips';
import { useAuthStore } from '../../stores/auth';
import { useDeviceStore } from '../../stores/device';
import dayjs from '../../dayjs';
import spinner from '../Spinner.vue';
import AppButton from '../ui/AppButton.vue';
import Transactions from '../views/transactions.vue';
import { isVoluntaryContributionSeatPrice } from '../../utils/tripSeatPrice.js';
import { shouldShowLiveLocationShare } from '../../utils/ongoingTrip.js';
import { shouldShowPassengerSeatRequestLimitMessage } from '../../utils/tripSeatRequestsWarning.js';

export default {
    name: 'TripButtons',
    data() {
        return {};
    },
    props: ['sending'],
    components: {
        spinner,
        AppButton,
        Transactions
    },
    computed: {
        ...mapState(useTripsStore, {
            trip: 'currentTrip'
        }),
        ...mapState(useAuthStore, {
            tripCardTheme: 'tripCardTheme',
            user: 'user',
            config: 'appConfig'
        }),
        ...mapState(useDeviceStore, {
            isMobile: 'isMobile'
        }),
        sendingStatus() {
            Object.keys(this.sending).some((k) => this.sending[k] === true);
        },
        isPassenger() {
            return Array.isArray(this.trip.allPassengerRequest)
                ? this.trip.allPassengerRequest.findIndex(
                      (item) =>
                          item.user_id === this.user.id &&
                          (item.request_state === 1 || item.request_state === 4)
                  ) >= 0
                : false;
        },
        expired() {
            return dayjs(this.trip.trip_date).format() < dayjs().format();
        },
        owner() {
            return this.trip && this.user && this.user.id === this.trip.user.id;
        },
        canRequest() {
            return !this.owner && !this.trip.request;
        },
        showMessageButton() {
            return (
                !this.owner &&
                !this.expired &&
                (!this.canRequest ||
                    !this.config.module_coordinate_by_message ||
                    (this.config.module_coordinate_by_message &&
                        this.isPassenger))
            );
        },
        seatRequestLimitReached() {
            return Boolean(this.trip && this.trip.seat_request_limit_reached);
        },
        showPassengerSeatRequestLimitMessage() {
            return shouldShowPassengerSeatRequestLimitMessage(
                this.owner,
                this.trip
            );
        },
        showLiveLocationShare() {
            if (!this.trip || !this.user) {
                return false;
            }
            return shouldShowLiveLocationShare(this.trip, this.user.id, dayjs());
        },
        showGroupChatButton() {
            return (
                (this.owner || this.isPassenger) &&
                !!this.trip?.group_chat_conversation_id
            );
        },
        groupChatUnreadCount() {
            return Number(this.trip?.group_chat_unread_count || 0);
        },
        isPassengersView() {
            return this.trip.is_passenger;
        }
    },
    methods: {
        isVoluntaryContributionSeatPrice,
        onShareLinkClick(event) {
            if (
                window.device &&
                window.device.platform &&
                window.device.platform.toLowerCase() !== 'browser'
            ) {
                // {{ $t('estoyEnMovil') }}
                event.preventDefault();
                let href = event.target.getAttribute('href');
                if (!href) {
                    href = event.target.parentElement.getAttribute('href');
                }
                if (href) {
                    window.location.href = href;
                }
            }
        },
        onWhatsAppShareClick(event) {
            if (
                window.device &&
                window.device.platform &&
                window.device.platform.toLowerCase() !== 'browser'
            ) {
                // {{ $t('estoyEnMovil') }}
                event.preventDefault();
                if (
                    window &&
                    window.plugins &&
                    window.plugins.socialsharing &&
                    window.plugins.socialsharing.shareWithOptions
                ) {
                    let message = this.$t('publicarUnViajeCompartir');
                    window.plugins.socialsharing.shareViaWhatsApp(
                        message,
                        null /* img */,
                        decodeURIComponent(this.currentUrl),
                        function () {
                            console.log('share ok');
                        },
                        function (errormsg) {
                            console.log('share not ok:', errormsg);
                        }
                    );
                }
            }
        }
    }
};
</script>
<style scoped>
.buttons-container {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: 0.4em;
    text-align: center;
    margin-top: 1em;
    padding-bottom: 2rem;
}
.buttons-container .app-button,
.buttons-container .btn {
    width: 100%;
    box-sizing: border-box;
}
.live-location-share-btn__icon {
    transform: rotate(90deg);
    margin-right: 0.35rem;
}
.group-chat-btn__badge {
    display: inline-block;
    min-width: 1.5em;
    margin-left: 0.35rem;
    padding: 0 0.35em;
    border-radius: 999px;
    background: #d9534f;
    color: #fff;
    font-size: 0.85em;
    line-height: 1.5;
}

@media only screen and (min-width: 768px) {
    .buttons-container {
        margin-top: 1.5em;
    }
}
.alert-warning {
    max-width: 400px;
    margin: 1em auto;
}
</style>
