<template>
    <div class="row trip-stats" v-if="!trip.is_passenger && !isPassengersView">
        <div>
            <i
                class="fa fa-link"
                aria-hidden="true"
                v-if="tripCardTheme === 'light'"
            ></i>
            <span v-if="tripCardTheme !== 'light' || !isMobile"
                >{{ $t('distanciaARecorrer') }}</span
            >
            <br v-if="tripCardTheme !== 'light'" />
            <span>
                {{ distanceString }}
                <abbr :title="$t('kilometros')">{{ $t('km') }}</abbr>
            </span>
        </div>
        <div>
            <i
                class="fa fa-clock-o"
                aria-hidden="true"
                v-if="tripCardTheme === 'light'"
            ></i>
            <span v-if="tripCardTheme !== 'light' || !isMobile"
                >{{ $t('tiempoEstimado') }}</span
            >
            <br v-if="tripCardTheme !== 'light'" />
            <span>{{ trip.estimated_time }} {{ $t('horas') }}</span>
        </div>
        <div>
            <i
                class="fa fa-leaf"
                aria-hidden="true"
                v-if="tripCardTheme === 'light'"
            ></i>
            <span v-if="tripCardTheme !== 'light' || !isMobile">
                {{ $t('huellaCarbono') }} (
                <abbr :title="$t('aproximada')">{{ $t('aprox') }}</abbr>
                )
            </span>
            <br v-if="tripCardTheme !== 'light'" />
            <span>
                {{ ((trip.distance / 1000) * 0.15).toFixed(2) }}
                <abbr :title="$t('kilogramosDioxidoCarbono')">
                    kg CO<sub>2</sub> eq.
                </abbr>
            </span>
        </div>
    </div>
</template>
<script>
import { mapGetters } from 'vuex';
import SvgItem from '../SvgItem';
export default {
    name: 'TripDate',
    computed: {
        ...mapGetters({
            trip: 'trips/currentTrip',
            tripCardTheme: 'auth/tripCardTheme',
            isMobile: 'device/isMobile'
        }),
        distanceString() {
            return Math.floor(this.trip.distance / 1000);
        },
        isPassengersView() {
            return this.trip.is_passenger;
        }
    },
    components: {
        SvgItem
    },
    methods: {}
};
</script>
<style scoped></style>
