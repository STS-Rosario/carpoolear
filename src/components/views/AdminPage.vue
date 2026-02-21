<template>
    <div class="col-md-24">
        <div class="row">
            <adminNav></adminNav>
        </div>
        <div class="row">
            <div class="col-md-20 col-md-offset-2">
                <div class="card chart-card">
                    <div class="row">
                        <div class="col-md-9 col-md-offset-1">
                            <datePicker
                                class="picker"
                                :value="dateLimits.start"
                                :class="{
                                    'has-error': dateLimits.dateError.state
                                }"
                                v-on:date_changed="
                                    (date) =>
                                        (dateLimits.start =
                                            formatDateSlice(date))
                                "
                                :format="'YYYY-MM'"
                            ></datePicker>
                        </div>
                        <div class="col-md-9 col-md-offset-4">
                            <datePicker
                                class="picker"
                                :value="dateLimits.end"
                                :class="{
                                    'has-error': dateLimits.dateError.state
                                }"
                                v-on:date_changed="
                                    (date) =>
                                        (dateLimits.end = formatDateSlice(date))
                                "
                                :format="'YYYY-MM'"
                            ></datePicker>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-md-9 col-md-offset-2">
                <TripsChart
                    class="chart-card"
                    :minDate="dateLimits.start"
                    :maxDate="dateLimits.end"
                ></TripsChart>
                <MonthlyUsersChart
                    class="chart-card"
                    :minDate="dateLimits.start"
                    :maxDate="dateLimits.end"
                >
                    >
                </MonthlyUsersChart>
            </div>
            <div class="col-md-9 col-md-offset-2">
                <SeatsChart
                    class="chart-card"
                    :minDate="dateLimits.start"
                    :maxDate="dateLimits.end"
                >
                    >
                </SeatsChart>
                <TotalUsersChart
                    class="chart-card"
                    :minDate="dateLimits.start"
                    :maxDate="dateLimits.end"
                >
                    >
                </TotalUsersChart>
            </div>
        </div>
    </div>
</template>

<script setup>
import { reactive } from 'vue';
import { useRouter } from 'vue-router';
import TripsChart from '../elements/TripsChart';
import SeatsChart from '../elements/SeatsChart';
import MonthlyUsersChart from '../elements/MonthlyUsersChart';
import TotalUsersChart from '../elements/TotalUsersChart';
import datePicker from '../DatePicker';
import moment from 'moment';
import adminNav from '../sections/adminNav';

const router = useRouter();

const dateLimits = reactive({
    start: moment(new Date(new Date().getFullYear(), 0, 1)).format('YYYY-MM'),
    end: moment().format('YYYY-MM'),
    dateError: new Error()
});

const goToAbm = () => {
    router.replace({ name: 'admin-users' });
};

const formatDateSlice = (date) => {
    return date.slice(0, 7);
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
