<template>
    <datePicker :date="date"  :option="option" v-on:change="updateDate"></datePicker> 
</template>

<script>
import datePicker from 'vue-datepicker';
import moment from 'moment';

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
                    'padding': '6px',
                    'line-height': '22px',
                    'font-size': '16px',
                    'border': '2px solid #fff',
                    'box-shadow': '0 1px 3px 0 rgba(0, 0, 0, 0.2)',
                    'border-radius': '2px',
                    'color': '#5F5F5F',
                    'width': '100%'
                },
                wrapperClass: this.class,
                color: {
                    header: '#ccc',
                    headerText: '#f00'
                },
                buttons: {
                    ok: 'Aceptar',
                    cancel: 'Cancelar'
                },
                overlayOpacity: 0.5, // 0.5 as default
                dismissible: true // as true as default
            }
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
