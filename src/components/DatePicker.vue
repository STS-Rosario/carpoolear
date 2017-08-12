<template>
    <div class="date-picker">
        <div v-if="browser" class="form-control picker" :class="focus ? 'input-border' : ''">
            <DatepickerSystem 
                :clear-button="true" 
                :clear-button-icon="'fa fa-times'" 
                :calendar-button="true" 
                :calendar-button-icon="'fa fa-calendar'" 
                :value="dateBrowser" 
                :language="'es'" 
                v-on:opened="focus = true" 
                v-on:closed="focus = false" 
                v-on:selected="changeValue"
                :placeholder="'dd/mm/yyyy'" 
                :format="'dd/MM/yyyy'"
                :disabled="{
                    to: min,
                    from: max
                }"
                :disabled-picker = "disabledPicker"
                autocomplete="off">
            </DatepickerSystem>
        </div>
        <div v-if="!browser" class="form-control form-control-with-icon form-control-date">
            <input 
                @focus="focus = true" 
                @blur="focus = false"
                :value = "dateMobile"
                @change="changeMobileValue"
                type="date" 
                id="datepicker-mobile" 
                :min="min| moment('YYYY-MM-DD')" 
                :max="max| moment('YYYY-MM-DD')" 
                autocomplete="off" 
            />
        </div>
    </div>
</template>

<script>
import DatepickerSystem from 'vuejs-datepicker';
import { mapGetters } from 'vuex';
import moment from 'moment';
import bus from '../services/bus-event';

export default {
    name: 'datePicker',
    data () {
        return {
            dateBrowser: '',
            dateMobile: '',
            date: '',
            update: true,
            focus: false,
            nextYear: moment().add(1, 'years').format('YYYY-MM-DD'),
            lastCentury: moment().subtract(100, 'years').format('YYYY-MM-DD')
        };
    },
    mounted () {
        console.log(this.value);
        if (this.value !== '') {
            this.dateBrowser = this.value;
            this.dateMobile = this.value;
        }
    },
    methods: {
        changeValue (value) {
            console.log(value, this);
            this.dateBrowser = value;
        },
        changeMobileValue (el) {
            console.log(el);
            this.dateMobile = el.target.value;
        }
    },
    watch: {
        dateBrowser: function (value) {
            if (value && value !== '') {
                bus.emit('date-change', moment(value).format('YYYY-MM-DD'));
            } else {
                bus.emit('date-change', '');
            }
            console.log('emiting');
        },
        dateMobile: function (value) {
            if (value && value !== '') {
                bus.emit('date-change', value);
            } else {
                bus.emit('date-change', '');
            }
        },
        value: function (value) {
            this.dateBrowser = this.value;
            this.dateMobile = this.value;
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
            required: false
        },
        'minDate': {
            type: Date,
            required: false
        },
        'maxDate': {
            type: Date,
            required: false
        },
        'disabledPicker': {
            type: Boolean,
            required: false,
            default: false
        }
    },
    computed: {
        ...mapGetters({
            isMobile: 'device/isMobile',
            device: 'cordova/device'
        }),
        browser () {
            if (this.device) {
                if (this.device.platform === 'browser') {
                    return true;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        },
        max () {
            console.log(this.maxDate, this.minDate);
            let answer;
            if (this.maxDate) {
                answer = this.maxDate;
            } else {
                answer = this.nextYear;
            }
            if (this.browser) {
                return moment(answer).toDate();
            } else {
                return moment(answer).format('YYYY-MM-DD');
            }
        },
        min () {
            let answer;
            if (this.minDate) {
                answer = this.minDate;
            } else {
                answer = this.lastCentury;
            }
            if (this.browser) {
                return moment(answer).toDate();
            } else {
                return moment(answer).format('YYYY-MM-DD');
            }
        }
    },
    components: {
        DatepickerSystem
    }
};
</script>

<style>
    .vdp-datepicker i {
        font-size: 16px;
        padding-left: 4px;
    }
    .vdp-datepicker i.fa-times {
        font-size: 14.4px;
    }

    .vdp-datepicker__calendar-button {
        width: 18px;
    }
    .vdp-datepicker input,
    .user-form .vdp-datepicker input[type='text'] {
        border: 0;
        width: calc(100% - 44px);
        padding-left: .4em;
        line-height: 40px;
        font-size: 13px;
    }

    .user-form .vdp-datepicker input[type='text'] {
        display: inline-block;
        padding: 0;
        margin-bottom: 0;
        padding-left: .4em;
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
    .picker.form-control {
        padding: .1em .6em;
    }
    @media only screen and (min-width: 992px) {
        .search-section .picker.form-control {
            padding: .8em .6em;
        }
    }
    .input-border.form-control {
        border-color: #66afe9;
        outline: 0;
        box-shadow: inset 0 1px 1px rgba(0, 0, 0, .075), 0 0 8px rgba(102, 175, 233, .6);
    }
    @media only screen and (max-width: 991px) {
        .vdp-datepicker .vdp-datepicker__calendar {
            box-shadow: 2px 2px 11px;
            z-index: 100;
            padding: 5em 1em;
            position: fixed;
            height: 80%;
            width: 80%;
            top: 0px;
            left: 0px;
            margin: 10%;
        }
    }
</style>
