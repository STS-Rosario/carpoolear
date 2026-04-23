<template>
    <div class="trip_actions" v-if="conversation && conversation.trip">
        <div class="trip_actions-detail">
            <span v-if="owner">{{ $t('coordinateTripTeEnviaUnaConsultaPorTuViajeDesde') }}</span>
            <span v-else>{{ $t('coordinateTripViajeDesde') }}</span>
            <strong>{{ conversation.trip.from_town }}</strong>
            {{ $t('coordinateTripHacia') }}
            <strong>{{ conversation.trip.to_town }}</strong>
            <span v-if="owner">
                {{ $t('coordinateTripDelDia') }}
                <strong>{{
                    dayjs(conversation.trip.trip_date).format('DD/MM/YYYY')
                }}</strong>
                {{ $t('coordinateTripALas') }}
                <strong
                    >{{
                        dayjs(conversation.trip.trip_date).format('HH:mm')
                    }})</strong
                >
                <template v-if="conversation.trip.return_trip">
                    {{ $t('coordinateTripYVueltaElDia') }}
                    <strong>{{
                        dayjs(conversation.return_trip.trip_date).format('DD/MM/YYYY')
                    }}</strong>
                    {{ $t('coordinateTripALas2') }}
                    <strong
                        >{{
                            dayjs(conversation.return_trip.trip_date).format('HH:mm')
                        }})</strong
                    >
                </template>
            </span>
        </div>
        <p v-if="contributionWarningData" class="trip_actions-contribution-warning">
            <template v-if="contributionWarningData.role === 'driver'">
                {{
                    $t('coordinateTripContributionWarningDriver', {
                        maxContribution: $n(
                            contributionWarningData.maxContributionCents / 100,
                            'currency'
                        )
                    })
                }}
            </template>
            <template v-else>
                {{ $t('coordinateTripContributionWarningPassengerPrefix') }}
                <a :href="contributionWarningData.reportPath">{{
                    $t('coordinateTripContributionWarningPassengerReportLink')
                }}</a>
                {{ $t('coordinateTripContributionWarningPassengerSuffix') }}
            </template>
        </p>
        <template v-if="!owner">
            <button
                :disabled="sending.trip || expiredTrip"
                :style="
                    !conversation.return_trip
                        ? { float: 'none', width: '100%' }
                        : {}
                "
                class="btn btn-primary"
                @click="
                    isPassengerTrip || conversation.trip.request === 'send'
                        ? cancelRequest(false)
                        : doRequest(false)
                "
            >
                <span v-if="isPassengerTrip">
                    {{ $t('bajarmeViaje') }}
                    <template v-if="conversation.return_trip">{{ $t('deIda') }}</template>
                </span>
                <span v-else-if="conversation.trip.request === 'send'">
                    {{ $t('retirarSolicitudDeAsiento') }}
                    <template v-if="conversation.return_trip">{{ $t('deIda') }}</template>
                </span>
                <span v-else-if="sending.trip">
                    <spinner
                        class="blue"
                        v-if="sending && sending.trip"
                    ></spinner>
                </span>
                <span v-else-if="expiredTrip">{{ $t('viajeCarpooleado') }}</span>
                <span v-else>
                    <template v-if="config && config.module_trip_seats_payment">
                        {{ $t('reservar') }} {{ $n(conversation.trip.seat_price_cents / 100, 'currency') }}
                        <template v-if="conversation.return_trip"
                            >{{ $t('deIda') }}</template
                        >
                    </template>
                    <template v-else>
                        {{ $t('solicitarAsiento') }}
                        <template v-if="conversation.return_trip"
                            >{{ $t('deIda') }}</template
                        >
                    </template>
                </span>
                <template v-if="!sending.trip">
                    <strong
                        >({{
                            dayjs(conversation.trip.trip_date).format('DD/MM/YYYY')
                        }}</strong
                    >
                    -
                    <strong
                        >{{
                            dayjs(conversation.trip.trip_date).format('HH:mm')
                        }})</strong
                    >
                </template>
            </button>
        </template>
        <template v-if="conversation.return_trip">
            <button
                :disabled="sending.returnTrip || expiredReturnTrip"
                class="btn btn-primary"
                @click="
                    isPassengerReturnTrip ||
                    conversation.return_trip.request === 'send'
                        ? cancelRequest(true)
                        : doRequest(true)
                "
            >
                <span v-if="isPassengerReturnTrip"
                    >{{ $t('bajarmeDelViajeDeVuelta') }}</span
                >
                <span v-else-if="conversation.return_trip.request === 'send'">
                    {{ $t('retirarSolicitudDeAsientoDeVuelta') }}
                </span>
                <span v-else-if="sending.returnTrip">
                    <spinner class="blue" v-if="sending.returnTrip"></spinner>
                </span>
                <span v-else-if="expiredReturnTrip">{{ $t('viajeCarpooleado') }}</span>
                <span v-else>
                    <template v-if="config && config.module_trip_seats_payment">
                        {{ $t('reservar') }} {{ $n(conversation.return_trip.seat_price_cents / 100, 'currency') }} {{ $t('deVuelta') }}
                    </template>
                    <template v-else>{{ $t('solicitarAsientoDeVuelta') }}</template>
                </span>
                <template v-if="!sending.returnTrip">
                    <strong>
                        ({{
                            dayjs(conversation.return_trip.trip_date).format('DD/MM/YYYY')
                        }}
                    </strong>
                    -
                    <strong
                        >{{
                            dayjs(conversation.return_trip.trip_date).format('HH:mm')
                        }})</strong
                    >
                </template>
            </button>
        </template>
    </div>
</template>

<script>
import { mapState, mapActions } from 'pinia';
import { useConversationsStore } from '../../stores/conversations';
import { useAuthStore } from '../../stores/auth';
import { usePassengerStore } from '../../stores/passenger';
import dialogs from '../../services/dialogs.js';
import spinner from '../Spinner.vue';
import dayjs from '../../dayjs';
import { getConversationContributionWarningData } from '../../utils/conversationContributionWarning.js';

export default {
    name: 'conversation-chat',
    data() {
        return {
            sending: {
                trip: false,
                returnTrip: false
            }
        };
    },
    computed: {
        ...mapState(useConversationsStore, {
            conversation: 'selectedConversation'
        }),
        ...mapState(useAuthStore, {
            config: 'appConfig',
            user: 'user'
        }),
        owner() {
            return (
                this.conversation.trip &&
                this.user &&
                this.user.id === this.conversation.trip.user.id
            );
        },
        isPassengerTrip() {
            return (
                this.conversation.trip &&
                this.conversation.trip.passenger.findIndex(
                    (item) =>
                        item.user_id === this.user.id &&
                        (item.request_state === 1 || item.request_state === 4)
                ) >= 0
            );
        },
        isPassengerReturnTrip() {
            return (
                this.conversation.return_trip &&
                this.conversation.return_trip.passenger.findIndex(
                    (item) =>
                        item.user_id === this.user.id &&
                        (item.request_state === 1 || item.request_state === 4)
                ) >= 0
            );
        },
        expiredTrip() {
            return (
                dayjs(this.conversation.trip.trip_date).format() <
                dayjs().format()
            );
        },
        expiredReturnTrip() {
            return (
                dayjs(this.conversation.return_trip.trip_date).format() <
                dayjs().format()
            );
        },
        contributionWarningData() {
            return getConversationContributionWarningData({
                conversation: this.conversation,
                user: this.user
            });
        }
    },
    methods: {
        dayjs,
        ...mapActions(usePassengerStore, {
            make: 'makeRequest',
            cancel: 'cancel'
        }),

        doRequest(isReturnTrip = false) {
            if (this.$redirectToIdentityValidationIfRequired()) return;
            if (this.config.module_coordinate_by_message) {
                this.sending[isReturnTrip ? 'returnTrip' : 'trip'] = true;
                let trip = isReturnTrip
                    ? this.conversation.return_trip
                    : this.conversation.trip;
                this.make(trip.id)
                    .then((response) => {
                        trip.request = 'send';
                    })
                    .catch((error) => {
                        if (this.$checkError(error, 'identity_validation_required')) {
                            this.$router.push({ name: 'identity_validation' });
                            dialogs.message(this.$t('debesValidarIdentidadParaAccion'), {
                                estado: 'error'
                            });
                        }
                    })
                    .finally(() => {
                        this.sending[isReturnTrip ? 'returnTrip' : 'trip'] = false;
                    });
            }
        },

        cancelRequest(isReturnTrip = false) {
            if (this.config.module_coordinate_by_message) {
                if (
                    window.confirm(
                        this.$t('seguroBajarteViaje')
                    )
                ) {
                    this.sending[isReturnTrip ? 'trip' : 'returnTrip'] = true;
                    let trip = isReturnTrip
                        ? this.conversation.return_trip
                        : this.conversation.trip;
                    this.cancel({ user: this.user, trip: trip })
                        .then(() => {
                            dialogs.message(this.$t('teHasBajadoViaje'));
                            if (trip.request === 'send') {
                                trip.request = '';
                            }
                            if (
                                this.isPassengerTrip ||
                                this.isPassengerReturnTrip
                            ) {
                                let index = trip.passenger.findIndex(
                                    (item) =>
                                        item.id === this.user.id &&
                                        (item.request_state === 1 ||
                                            item.request_state === 4)
                                );
                                if (index >= 0) {
                                    trip.passenger[index].request_state = 3;
                                    trip.seats_available++;
                                    trip.passenger_count--;
                                }
                            }
                        })
                        .catch((error) => {
                            console.error(error);
                            dialogs.message(
                                this.$t('problemaSolicitar'),
                                { estado: 'error' }
                            );
                        })
                        .finally(() => {
                            this.sending[isReturnTrip ? 'trip' : 'returnTrip'] = false;
                        });
                }
            }
        }
    },
    components: {
        spinner
    }
};
</script>

<style scoped>
.trip_actions .btn-primary {
    font-size: 12px;
    width: 100%;
}

.trip_actions-contribution-warning {
    margin: 0.6em 0 0.8em;
    padding: 0.65em 0.75em;
    font-size: 12px;
    line-height: 1.35;
    color: #8a1f11;
    background-color: #fff5f4;
    border: 1px solid #e8b8b4;
    border-radius: 4px;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.06);
}

.trip_actions-contribution-warning a {
    color: #6b150d;
    text-decoration: underline;
    font-weight: bold;
}
@media only screen and (max-width: 768px) {
    .trip_actions {
        padding: 0.4em 0.8em;
        width: 100%;
        border-radius: 0;
        box-shadow: 1px 1px 1px rgba(0, 0, 0, 0.4);
        font-size: 0.9em;
        position: fixed;
        z-index: 10;
        background-color: #f6f6f6;
    }
    .trip_actions .btn-primary {
        display: block;
        width: 100%;
        font-size: 11px;
        margin-bottom: 0;
        margin: 0;
        padding: 0;
    }
    .trip_actions-detail {
        padding-bottom: 0.3em;
        padding-left: 0.4em;
    }
}
@media only screen and (min-width: 1100px) {
    .trip_actions .btn-primary {
        float: left;
        width: 50%;
    }
}
</style>

<style>
.module--coordinate-by-message #btn-more {
    padding: 0.4em;
}
.module--coordinate-by-message .conversation_chat p,
.module--coordinate-by-message .message_text {
    font-size: 12px;
}
.module--coordinate-by-message .conversation-lastmessage {
    font-size: 12px;
}
.module--coordinate-by-message .conversation-component.container {
    padding-bottom: 0;
    margin-bottom: 0;
}
.module--coordinate-by-message
    .conversation_chat
    .list-group-item:nth-child(2) {
    height: calc(100% - 245px);
}
@media only screen and (min-width: 768px) {
    .module--coordinate-by-message .conversation_chat p,
    .module--coordinate-by-message .message_text {
        font-size: 12px;
    }
    @media only screen and (min-width: 1000px) {
        .module--coordinate-by-message
            .conversation_chat
            .list-group-item:nth-child(2) {
            height: calc(100% - 205px);
        }
    }
}
</style>
