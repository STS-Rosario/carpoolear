<template>
    <div>
        <datePicker :date="date"  :option="option" v-on:change="updateDate" :limit="limit" class='date-picker'></datePicker>
        <div class="date-picker--cross">
            <i v-on:click="resetDatePicker" class="fa fa-times" aria-hidden="true"></i>
        </div>
    </div>
</template>

<script>
import datePicker from 'vue-datepicker';
import moment from 'moment';
import {today} from '../services/utility.js';

export default {
    name: 'loading',
    data () {
        return {
            date: {
                time: this.value
            },
            option: {
                type: 'day',
                week: ['Lu', 'Ma', 'Mie', 'Ju', 'Vi', 'Sa', 'Do'],
                month: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
                format: this.format,
                placeholder: 'Fecha',
                inputStyle: {
                    'display': 'inline-block',
                    'line-height': '22px',
                    'border-radius': '2px',
                    'color': '#5F5F5F',
                    'width': '100%'
                },
                wrapperClass: this.class,
                color: {
                    header: '#016587',
                    headerText: '#FFF'
                },
                buttons: {
                    ok: 'Aceptar',
                    cancel: 'Cancelar'
                },
                overlayOpacity: 0.5, // 0.5 as default
                dismissible: true // as true as default
            },
            limit: [{
                type: 'fromto',
                from: today()
            }]
        };
    },
    mounted () {

    },
    computed: {
        dateSys: function () {
            return moment(this.date.time, this.format).format('YYYY-MM-DD');
        }
    },
    methods: {
        updateDate (date) {
            this.$emit('change', this.dateSys);
        },
        resetDatePicker () {
            this.date.time = '';
            this.$emit('change', '');
        }
    },
    props: {
        'format': {
            type: String,
            required: false,
            default: 'DD/MM/YYYY'
        },
        'class': {
            type: String,
            required: false,
            default: ''
        },
        'value': {
            type: String,
            required: false,
            default: ''
        }
    },
    components: {
        datePicker
    }
};
</script>

<style scoped>
    .date-picker--cross {
        width: calc(100% - 81px);
        display: inline-block;
        text-align: right;
    }
    .date-picker--cross i {
        cursor: pointer;
    }
    .date-picker {
        width: 77px;
    }
</style>