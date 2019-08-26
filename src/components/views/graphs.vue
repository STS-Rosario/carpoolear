<template>
<div
    <div class="row">
        <div class="col-md-20 col-md-offset-2">
            <div class="card chart-card">
                <div class="row">
                    <div class="col-md-9 col-md-offset-1">
                        <datePicker class="picker"
                            :value="dateLimits.start"
                            :class="{'has-error': dateLimits.dateError.state}"
                            v-on:date_changed="(date) => this.dateLimits.start = formatDate(date)"
                            :format="'YYYY-MM'"></datePicker>
                    </div>
                    <div class="col-md-9 col-md-offset-4">
                        <datePicker class="picker"
                            :value="dateLimits.end"
                            :class="{'has-error': dateLimits.dateError.state}"               
                            v-on:date_changed="(date) => this.dateLimits.end = formatDate(date)"
                            :format="'YYYY-MM'"></datePicker>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="row">
        <div class="col-md-9 col-md-offset-2">
            <TripsChart class="chart-card"
            :minDate="dateLimits.start"
            :maxDate="dateLimits.end"></TripsChart>
            <MonthlyUsersChart class="chart-card"
            :minDate="dateLimits.start"
            :maxDate="dateLimits.end">></MonthlyUsersChart>
        </div>
        <div class="col-md-9 col-md-offset-2">
            <SeatsChart class="chart-card"
            :minDate="dateLimits.start"
            :maxDate="dateLimits.end">></SeatsChart>
            <TotalUsersChart class="chart-card"
            :minDate="dateLimits.start"
            :maxDate="dateLimits.end">></TotalUsersChart>
        </div>
    </div>
</div>
</template>

<script>
import router from '../../router';
import TripsChart from '../elements/TripsChart';
import SeatsChart from '../elements/SeatsChart';
import MonthlyUsersChart from '../elements/MonthlyUsersChart';
import TotalUsersChart from '../elements/TotalUsersChart';
import datePicker from '../DatePicker';
import moment from 'moment';

export default {
    name: 'admin-page',
    data () {
        return {
            dateLimits: {
                start: moment(new Date(new Date().getFullYear(), 0, 1)).format('YYYY-MM'),
                end: moment().format('YYYY-MM'),
                dateError: new Error()
            }
        };
    },
    methods: {
        goToAbm () {
            router.replace({name: 'admin-users'});
        },
        formatDate (date) {
            return date.slice(0, 7);
        }
    },
    components: {
        TripsChart,
        SeatsChart,
        MonthlyUsersChart,
        TotalUsersChart,
        datePicker
    },
    mounted () {
        this.loadData();
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
