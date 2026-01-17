<template>
    <div class="date-picker">
        <div
            v-if="browser"
            class="form-control picker"
            :class="focus ? 'input-border' : ''"
        >
            <DatepickerSystem
                ref="datepickerSystem"
                :clear-button="true"
                :clear-button-icon="'fa fa-times'"
                :calendar-button="true"
                :calendar-button-icon="'fa fa-calendar'"
                :value="dateBrowser"
                :language="datePickerLanguage"
                v-on:opened="focus = true"
                v-on:closed="focus = false"
                v-on:selected="changeValue"
                :placeholder="this.$t('fecha')"
                :format="'dd/MM/yyyy'"
                :disabled="{
                    to: min,
                    from: max
                }"
                :disabled-picker="disabledPicker"
                autocomplete="off"
            ></DatepickerSystem>
        </div>
        <div
            v-if="!browser"
            class="form-control form-control-with-icon form-control-date"
        >
            <input
                ref="mobileInput"
                @focus="focus = true"
                @blur="focus = false"
                :value="dateMobile"
                @change="changeMobileValue"
                type="date"
                id="datepicker-mobile"
                :min="min | moment('YYYY-MM-DD')"
                :max="max | moment('YYYY-MM-DD')"
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
/*

*/
export default {
    name: 'datePicker',
    data() {
        return {
            dateBrowser: '',
            dateMobile: '',
            date: '',
            update: true,
            focus: false,
            nextYear: moment().add(2, 'years').format('YYYY-MM-DD'),
            lastCentury: moment().subtract(100, 'years').format('YYYY-MM-DD'),
            niceDate: ''
        };
    },
    mounted() {
        if (this.value !== '') {
            this.dateBrowser = moment(this.value).toDate();
            this.dateMobile = this.value;
            this.niceDate = moment(this.value).format('DD/MM/YYYY');
        }
    },

    updated() {
        if (this.value !== '') {
            this.niceDate = moment(this.value).format('DD/MM/YYYY');
        }
    },
    methods: {
        clear() {
            this.dateBrowser = '';
            this.dateMobile = '';
            this.niceDate = '';
        },
        changeValue(value) {
            this.dateBrowser = value;
        },
        changeMobileValue(el) {
            this.dateMobile = el.target.value;
            // Update the nice formatted date for consistency
            if (el.target.value) {
                this.niceDate = moment(el.target.value).format('DD/MM/YYYY');
            } else {
                this.niceDate = '';
            }
        },
        setFocus() {
            if (this.browser) {
                this.$refs.datepickerSystem.showCalendar();
            } else {
                this.$refs.mobileInput.focus();
            }
        }
    },
    watch: {
        dateBrowser: function (value) {
            value =
                value && value !== '' ? moment(value).format('YYYY-MM-DD') : '';

            bus.emit('date-change', value);

            this.$emit('date_changed', value);
        },
        dateMobile: function (value) {
            value = value && value !== '' ? value : '';

            bus.emit('date-change', value);

            this.$emit('date_changed', value);
        },
        value: function (value) {
            this.dateBrowser = moment(this.value).toDate();
            this.dateMobile = this.value;
            this.niceDate = moment(this.value).format('DD/MM/YYYY');
        }
    },
    props: {
        format: {
            type: String,
            required: false,
            default: 'DD/MM/YYYY'
        },
        value: {
            type: String,
            required: false
        },
        minDate: {
            type: Date,
            required: false
        },
        maxDate: {
            type: Date,
            required: false
        },
        disabledPicker: {
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
        datePickerLanguage() {
            const locale = this.$i18n.locale || 'arg';
            switch (locale) {
                case 'en':
                    return 'en';
                case 'arg':
                    return 'es';
                case 'chl':
                    return 'es';
                default:
                    return 'es';
            } 
        },
        browser() {
            if (this.device) {
                if (this.device.platform === 'browser') {
                    return true;
                } else {
                    return false;
                }
            } else {
                return true;
            }
        },
        max() {
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
        min() {
            let answer;
            if (this.minDate) {
                answer = this.minDate;
            } else {
                answer = this.lastCentury;
            }
            if (this.browser) {
                let date = moment(answer).toDate();
                date.setHours(0);
                date.setMinutes(0);
                date.setSeconds(0);
                return date;
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
    padding-left: 0.4em;
    line-height: 40px;
    font-size: 13px;
}

.user-form .vdp-datepicker input[type='text'] {
    display: inline-block;
    padding: 0;
    margin-bottom: 0;
    padding-left: 0.4em;
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
    padding: 0.1em 0.6em;
}
@media only screen and (min-width: 992px) {
    .search-section .picker.form-control {
        padding: 0.8em 0.6em;
    }
}
.input-border.form-control {
    border-color: #66afe9;
    outline: 0;
    box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075),
        0 0 8px rgba(102, 175, 233, 0.6);
}
@media only screen and (max-width: 991px) {
    .vdp-datepicker .vdp-datepicker__calendar {
        font-size: 1.6em;
        box-shadow: 2px 2px 11px;
        z-index: 100;
        padding: 2.5em 1em;
        position: fixed;
        /* height: 40%; */
        width: 90%;
        top: 0px;
        left: 0px;
        margin: 5%;
        margin-top: 40%;
    }
}
</style>
