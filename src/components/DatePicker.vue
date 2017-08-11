<template>
    <div class="form-control form-control-with-icon form-control-date" :class="focus ? 'input-border' : ''">
        <input :class="{'hide' : isMobile}" @focus="focus = true" @blur="focus = false" v-mask="'##/##/####'" type="text"  id="datepicker" v-model="date" autocomplete="off" />
        <input :class="{'hide' : !isMobile}" @focus="focus = true" @blur="focus = false" type="date" id="datepicker-mobile" :min="minDate| moment('YYYY-MM-DD')" :max="max| moment('YYYY-MM-DD') " v-model="dateMobile" autocomplete="off" />
        <div v-if="!isMobile" @click="resetDatePicker" class="date-picker--cross"><i aria-hidden="true" class="fa fa-times"></i></div>
    </div>
</template>

<script>
require('../../node_modules/pikaday/css/pikaday.css');
import { mapGetters } from 'vuex';
import Pikaday from '../../node_modules/pikaday/pikaday.js';
import moment from 'moment';
import bus from '../services/bus-event';

export default {
    name: 'datePicker',
    data () {
        return {
            date: '',
            update: true,
            dateMobile: '',
            focus: false,
            picker: null,
            position: 0,
            nextYear: moment().add(1, 'Y').format('YYYY-MM-DD'),
            options: {
                previousMonth: 'Mes anterior',
                nextMonth: 'Mes siguiente',
                weekdays: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'],
                weekdaysShort: ['Lu', 'Ma', 'Mie', 'Ju', 'Vi', 'Sa', 'Do'],
                months: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
                theme: 'triangle-theme'
            }
        };
    },
    mounted () {
        let self = this;
        this.picker = new Pikaday({ 
            field: document.getElementById('datepicker'),
            format: 'DD/MM/YYYY',
            onSelect: function (value) {
                self.date = this.getMoment(value, 'DD/MM/YYYY').format('DD/MM/YYYY');
                self.dateMobile = this.getMoment(value, 'DD/MM/YYYY').format('YYYY-MM-DD');
            },
            i18n: this.options,
            defaultDate: this.value,
            minDate: this.minDate,
            maxDate: moment(this.max).toDate()
        });
        console.log(this.value);
        if (this.value !== '') {
            this.picker.setDate(moment(this.value, 'DD/MM/YYYY').toDate(), false);
            this.date = this.value;
        } else {
            let self = this;
            this.date = ' ';
            setTimeout(function () {
                self.resetDatePicker();
                this.dateMobile = '';
            });
        }
    },
    methods: {
        resetDatePicker () {
            console.log('reseting');
            this.date = '';
            this.dateMobile = '';
            this.picker.setDate(null);
        },
        getInputSelection (el) {
            let start = 0;
            let end = 0;
            let normalizedValue;
            let range;
            let textInputRange;
            let len;
            let endRange;

            if (typeof el.selectionStart === 'number' && typeof el.selectionEnd === 'number') {
                start = el.selectionStart;
                end = el.selectionEnd;
            } else {
                range = document.selection.createRange();

                if (range && range.parentElement() === el) {
                    len = el.value.length;
                    normalizedValue = el.value.replace(/\r\n/g, '\n');

                    // Create a working TextRange that lives only in the input
                    textInputRange = el.createTextRange();
                    textInputRange.moveToBookmark(range.getBookmark());

                    // Check if the start and end of the selection are at the very end
                    // of the input, since moveStart/moveEnd doesn't return what we want
                    // in those cases
                    endRange = el.createTextRange();
                    endRange.collapse(false);

                    if (textInputRange.compareEndPoints('StartToEnd', endRange) > -1) {
                        start = end = len;
                    } else {
                        start = -textInputRange.moveStart('character', -len);
                        start += normalizedValue.slice(0, start).split('\n').length - 1;

                        if (textInputRange.compareEndPoints('EndToEnd', endRange) > -1) {
                            end = len;
                        } else {
                            end = -textInputRange.moveEnd('character', -len);
                            end += normalizedValue.slice(0, end).split('\n').length - 1;
                        }
                    }
                }
            }

            return {
                start: start,
                end: end
            };
        },
        setCaretPosition (elem, caretPos) {
            if (elem !== null) {
                if (elem.createTextRange) {
                    let range = elem.createTextRange();
                    range.move('character', caretPos);
                    range.select();
                } else {
                    if (elem.selectionStart) {
                        elem.focus();
                        elem.setSelectionRange(caretPos, caretPos);
                    } else {
                        elem.focus();
                    }
                }
            }
        }
    },
    watch: {
        date: function (value) {
            bus.emit('date-change', value);
        },
        dateMobile: function (value) {
            this.date = moment(value, 'YYYY-MM-DD').format('DD/MM/YYYY');
            if (this.update) {
                console.log(this.value);
                if (this.value === '') {
                    console.log('reseting1');
                    this.date = '';
                    this.dateMobile = '';
                    this.resetDatePicker();
                }
                this.picker.setDate(moment(value).toDate(), false);
                this.update = false;
            }
        },
        value: function (value) {
            if (this.update) {
                this.dateMobile = moment(value, 'DD/MM/YYYY').format('YYYY-MM-DD');
            }
        }
    },
    props: {
        'format': {
            type: String,
            required: false,
            default: 'DD/MM/YYYY'
        },
        'value': {
            type: String,
            default: moment().format('DD/MM/YYYY'),
            required: false
        },
        'minDate': {
            type: Date,
            required: false
        },
        'maxDate': {
            type: Date,
            required: false
        }
    },
    computed: {
        ...mapGetters({
            isMobile: 'device/isMobile'
        }),
        max () {
            if (this.maxDate) {
                return this.maxDate;
            } else {
                return this.nextYear;
            }
        }
    }
};
</script>

<style scoped>
    .input-border {
        border-color: #66afe9;
        outline: 0;
        box-shadow: inset 0 1px 1px rgba(0, 0, 0, .075), 0 0 8px rgba(102, 175, 233, .6);
    }
    .date-picker--cross {
        position: absolute;
    }
    .date-picker--cross i {
        cursor: pointer;
    }
    .date-picker {
        width: 100%;
        border: none;
        vertical-align: middle;
    }
    .form-control {
        position: relative;
        vertical-align: middle;
        cursor: pointer;
    }

</style>
