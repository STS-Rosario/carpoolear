<template>
    <div class="col-md-24">
        <div class="row">
            <adminNav></adminNav>
        </div>
        <div class="row">
            <div class="col-md-22 col-md-offset-1">
                <adminSearchTrip v-on:admin-trip-search="research"></adminSearchTrip>
            </div>
        </div>
        <div class="row">
            <div class="col-md-22 col-md-offset-1">
                <table class="table table-dark">
                    <thead>
                        <tr>
                        <th scope="col">Usuario</th>
                        <th scope="col">Desde</th>
                        <th scope="col">Hasta</th>
                        <th scope="col">Fecha</th>
                        <th scope="col">Hora</th>
                        <th scope="col">Asientos Totales</th>
                        <th scope="col">Ocupados</th>
                        <th scope="col">Solicitudes</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="viaje in viajes">
                            <th scope="row">{{ viaje.user.name }}</th>
                            <td> {{ viaje.from_town }} </td>
                            <td> {{ viaje.to_town }} </td>
                            <td>  {{ viaje.trip_date.slice(0,10) }} </td>
                            <td>  {{ viaje.trip_date.slice(10,20) }} </td>
                            <td>  {{ viaje.total_seats }} </td>
                            <td> {{ (viaje.passenger) }} </td>
                            <td> {{ viaje.request }} </td>
                        </tr>
                    </tbody>
                    </table>
            </div>
        </div>
    </div>
</template>

<script>
import adminNav from '../sections/adminNav';
import adminSearchTrip from '../sections/AdminSearchTrips';
import { mapActions } from 'vuex';

// TODO next page button
// FIXME ocupados y solicitados
export default {
    name: 'admin-trips',
    data () {
        return {
            viajes: []
        };
    },
    methods: {
        ...mapActions({
            search: 'trips/tripsSearch'
        }),
        research (params) {
            console.log('busqueda');
            console.log(params);
            this.search(params)
            .then((data) => {
                this.viajes = data.data;
                this.$set(this, 'viajes', data.data);
                console.log(this.viajes);
            });
        },
        calculatePassengers (passengers) {
            let counter = 0;
            passengers.forEach(pass => {
                if (pass.request_state) {
                    counter += 1;
                }
            });
            return counter;
        }
    },
    components: {
        adminNav,
        adminSearchTrip
    },
    mounted () {
    }
};
</script>

<style scoped>

.chart-card {
    margin-bottom: 20px;
}
.card {
    background-color: #fff;
    border-radius: 2px;
}
.picker {
    margin-top: 1em;
}

</style>
