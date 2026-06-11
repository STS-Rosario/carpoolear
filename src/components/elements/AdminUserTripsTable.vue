<template>
    <div class="admin-user-trips-table">
        <p v-if="!trips.length" class="alert alert-warning" role="alert">
            {{ emptyMessage }}
        </p>
        <table v-else class="table table-dark">
            <thead>
                <tr>
                    <th scope="col">{{ $t('id') }}</th>
                    <th scope="col">{{ $t('origen') }}</th>
                    <th scope="col">{{ $t('destino') }}</th>
                    <th scope="col">{{ $t('fecha') }}</th>
                    <th scope="col">{{ $t('hora') }}</th>
                    <th scope="col">{{ $t('asientosTotales') }}</th>
                    <th scope="col">{{ $t('ocupados') }}</th>
                    <th scope="col">{{ $t('estado') }}</th>
                    <th scope="col">{{ $t('acciones') }}</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="trip in trips" :key="trip.id">
                    <td>{{ trip.id }}</td>
                    <td>{{ trip.from_town }}</td>
                    <td>{{ trip.to_town }}</td>
                    <td>{{ tripDate(trip) }}</td>
                    <td>{{ tripTime(trip) }}</td>
                    <td>{{ trip.total_seats }}</td>
                    <td>{{ occupiedSeats(trip) }}</td>
                    <td>{{ tripStatus(trip) }}</td>
                    <td class="admin-user-trips-table__actions">
                        <router-link
                            :to="{ name: 'detail_trip', params: { id: trip.id } }"
                            class="btn btn-default btn-sm"
                            target="_blank"
                        >
                            {{ $t('verDetalleViaje') }}
                        </router-link>
                        <button
                            v-if="!trip.deleted"
                            type="button"
                            class="btn btn-danger btn-sm"
                            :disabled="cancelingId === trip.id"
                            v-on:click="cancelTrip(trip)"
                        >
                            {{ $t('cancelarViaje') }}
                        </button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
export default {
    name: 'admin-user-trips-table',
    props: {
        trips: {
            type: Array,
            default: () => []
        },
        emptyMessage: {
            type: String,
            required: true
        },
        cancelingId: {
            type: [Number, String, null],
            default: null
        }
    },
    emits: ['cancel'],
    methods: {
        tripDate(trip) {
            if (!trip.trip_date) {
                return '';
            }
            return String(trip.trip_date).slice(0, 10);
        },
        tripTime(trip) {
            if (!trip.trip_date) {
                return '';
            }
            return String(trip.trip_date).slice(11, 16);
        },
        occupiedSeats(trip) {
            if (trip.passengerAccepted_count != null) {
                return trip.passengerAccepted_count;
            }
            return '—';
        },
        tripStatus(trip) {
            if (trip.hidden) {
                return this.$t('oculto');
            }
            if (trip.deleted) {
                return this.$t('borrado');
            }
            return this.$t('activo');
        },
        cancelTrip(trip) {
            this.$emit('cancel', trip);
        }
    }
};
</script>

<style scoped>
.admin-user-trips-table__actions {
    white-space: nowrap;
}

.admin-user-trips-table__actions .btn + .btn {
    margin-left: 6px;
}
</style>
