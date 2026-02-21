<template>
    <div class="row trip-stats" v-if="!trip.is_passenger && !isPassengersView">
        <div>
            <i
                class="fa fa-link"
                aria-hidden="true"
                v-if="tripCardTheme === 'light'"
            ></i>
            <span v-if="tripCardTheme !== 'light' || !isMobile"
                >{{ t('distanciaARecorrer') }}</span
            >
            <br v-if="tripCardTheme !== 'light'" />
            <span>
                {{ distanceString }}
                <abbr :title="t('kilometros')">{{ t('km') }}</abbr>
            </span>
        </div>
        <div>
            <i
                class="fa fa-clock-o"
                aria-hidden="true"
                v-if="tripCardTheme === 'light'"
            ></i>
            <span v-if="tripCardTheme !== 'light' || !isMobile"
                >{{ t('tiempoEstimado') }}</span
            >
            <br v-if="tripCardTheme !== 'light'" />
            <span>{{ trip.estimated_time }} {{ t('horas') }}</span>
        </div>
        <div>
            <i
                class="fa fa-leaf"
                aria-hidden="true"
                v-if="tripCardTheme === 'light'"
            ></i>
            <span v-if="tripCardTheme !== 'light' || !isMobile">
                {{ t('huellaCarbono') }} (
                <abbr :title="t('aproximada')">{{ t('aprox') }}</abbr>
                )
            </span>
            <br v-if="tripCardTheme !== 'light'" />
            <span>
                {{ ((trip.distance / 1000) * 0.15).toFixed(2) }}
                <abbr :title="t('kilogramosDioxidoCarbono')">
                    kg CO<sub>2</sub> eq.
                </abbr>
            </span>
        </div>
    </div>
</template>
<script setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useTripsStore } from '@/stores/trips';
import { useAuthStore } from '@/stores/auth';
import { useDeviceStore } from '@/stores/device';
import SvgItem from '../SvgItem';

const { t } = useI18n();
const tripsStore = useTripsStore();
const authStore = useAuthStore();
const deviceStore = useDeviceStore();

const trip = computed(() => tripsStore.currentTrip);
const tripCardTheme = computed(() => authStore.tripCardTheme);
const isMobile = computed(() => deviceStore.isMobile);

const distanceString = computed(() => {
    return Math.floor(trip.value.distance / 1000);
});

const isPassengersView = computed(() => {
    return trip.value.is_passenger;
});
</script>
<style scoped></style>
