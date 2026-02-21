<template>
    <div
        class="trip-seats"
        v-if="tripCardTheme === 'light' || !trip.is_passenger"
    >
        <div class="row" v-if="tripCardTheme !== 'light'">
            <div
                class="trip_seats-available col-xs-offset-4 col-sm-offset-4 col-xs-12"
            >
                <span class="trip_seats-available_value pull-left">{{
                    trip.seats_available
                }}</span>
                <span v-if="trip.seats_available == 1"
                    class="trip_seats-available_label"
                >
                    {{ t('Lugar') }}
                    <br />
                    {{ t('libre') }}
                </span>
                <span v-if="trip.seats_available > 1"
                    class="trip_seats-available_label"
                >
                    {{ t('Lugares') }}
                    <br />
                    {{ t('libres') }}
                </span>
            </div>
        </div>
        <div v-if="tripCardTheme !== 'light'" style="height: 2em"></div>
        <template v-else>
            <div class="trip_seats-available" v-if="!trip.is_passenger">
                <template v-for="n in trip.total_seats">
                    <span
                        :class="
                            n < trip.total_seats - trip.seats_available
                                ? 'seat-taken'
                                : 'seat-free'
                        "
                    >
                        <svg-item :icon="'seat'" :size="18"></svg-item>
                    </span>
                </template>
            </div>
        </template>
    </div>
</template>
<script setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useTripsStore } from '@/stores/trips';
import { useAuthStore } from '@/stores/auth';
import SvgItem from '../SvgItem';

const { t } = useI18n();
const tripsStore = useTripsStore();
const authStore = useAuthStore();

const trip = computed(() => tripsStore.currentTrip);
const tripCardTheme = computed(() => authStore.tripCardTheme);
</script>
