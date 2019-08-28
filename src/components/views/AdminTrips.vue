<template>
    <div class="col-md-24">
        <div class="row">
            <adminNav></adminNav>
        </div>
        <div class="row">
            <div class="col-md-22 col-md-offset-1">
                <adminSearchTrip></adminSearchTrip>
            </div>
        </div>
    </div>
</template>

<script>
import adminNav from '../sections/adminNav';
import adminSearchTrip from '../sections/AdminSearchTrips';

export default {
    name: 'admin-trips',
    data () {
        return {
        };
    },
    methods: {

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
