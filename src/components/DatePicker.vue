<template>
    <div class="date-picker">
        <div
            v-if="browser"
            class="date-picker__surface picker"
            :class="focus ? 'input-border' : ''"
        >
            <VueDatePicker
                ref="datepickerSystem"
                :model-value="dateBrowser"
                class="carpoolear-vue-dp"
                model-type="yyyy-MM-dd"
                :locale="dpLocale"
                :formats="dpFormats"
                :min-date="min"
                :max-date="max"
                :disabled="disabledPicker"
                :placeholder="$t('fecha')"
                :time-picker="false"
                :time-config="dpTimeConfig"
                :hide-navigation="['time']"
                :auto-apply="true"
                :input-attrs="dpInputAttrs"
                teleport="body"
                @open="focus = true"
                @closed="focus = false"
                @update:model-value="onDpModelValue"
            />
            <div
                class="date-picker--cross"
                @click.stop="clearBrowserCross"
            >
                <i class="fa fa-times" aria-hidden="true"></i>
            </div>
        </div>
        <div
            v-if="!browser"
            class="date-picker__surface date-picker__surface--mobile"
        >
            <input
                ref="mobileInput"
                @focus="focus = true"
                @blur="focus = false"
                :value="dateMobile"
                @change="changeMobileValue"
                type="date"
                id="datepicker-mobile"
                :min="dayjs(min).format('YYYY-MM-DD')"
                :max="dayjs(max).format('YYYY-MM-DD')"
                autocomplete="off"
            />
        </div>
    </div>
</template>

<script>
import { VueDatePicker } from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import { enUS, es } from 'date-fns/locale';
import { mapState } from 'pinia';
import { useDeviceStore } from '../stores/device';
import { useCordovaStore } from '../stores/cordova';
import dayjs from '../dayjs';
import bus from '../services/bus-event';

export default {
    name: 'datePicker',
    components: {
        VueDatePicker
    },
    data() {
        return {
            dateBrowser: null,
            dpTimeConfig: {
                enableTimePicker: false,
                enableMinutes: false,
                enableSeconds: false,
                timePickerInline: false
            },
            dateMobile: '',
            focus: false,
            nextYear: dayjs().add(2, 'years').format('YYYY-MM-DD'),
            lastCentury: dayjs().subtract(100, 'years').format('YYYY-MM-DD'),
            niceDate: '',
            dpFormats: { input: 'dd/MM/yyyy' },
            dpInputAttrs: {
                autocomplete: 'off',
                clearable: false,
                hideInputIcon: true
            }
        };
    },
    mounted() {
        this.syncFromValue(this.modelValue);
    },
    methods: {
        dayjs,
        syncFromValue(val) {
            if (val && dayjs(val).isValid()) {
                const ymd = dayjs(val).format('YYYY-MM-DD');
                this.dateBrowser = ymd;
                this.dateMobile = ymd;
                this.niceDate = dayjs(val).format('DD/MM/YYYY');
            } else {
                this.dateBrowser = null;
                this.dateMobile = '';
                this.niceDate = '';
            }
        },
        onDpModelValue(val) {
            this.dateBrowser = val;
            this.$nextTick(() => {
                const dp = this.$refs.datepickerSystem;
                if (dp && typeof dp.formatInputValue === 'function') {
                    dp.formatInputValue();
                }
            });
        },
        clearBrowserCross() {
            if (this.disabledPicker) {
                return;
            }
            this.clear();
        },
        clear() {
            this.dateBrowser = null;
            this.dateMobile = '';
            this.niceDate = '';
        },
        changeMobileValue(el) {
            this.dateMobile = el.target.value;
            if (el.target.value) {
                this.niceDate = dayjs(el.target.value).format('DD/MM/YYYY');
            } else {
                this.niceDate = '';
            }
        },
        setFocus() {
            if (this.browser) {
                const dp = this.$refs.datepickerSystem;
                if (dp && typeof dp.openMenu === 'function') {
                    dp.openMenu();
                }
            } else {
                this.$refs.mobileInput.focus();
            }
        }
    },
    watch: {
        dateBrowser(value) {
            const str =
                value && dayjs(value).isValid()
                    ? dayjs(value).format('YYYY-MM-DD')
                    : '';
            bus.emit('date-change', str);
            this.$emit('date_changed', str);
            this.$emit('update:modelValue', str);
        },
        dateMobile(value) {
            const str = value && value !== '' ? value : '';
            bus.emit('date-change', str);
            this.$emit('date_changed', str);
            this.$emit('update:modelValue', str);
        },
        modelValue(val) {
            this.syncFromValue(val);
        }
    },
    props: {
        format: {
            type: String,
            required: false,
            default: 'DD/MM/YYYY'
        },
        modelValue: {
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
        ...mapState(useDeviceStore, {
            isMobile: 'isMobile'
        }),
        ...mapState(useCordovaStore, {
            device: 'device'
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
        dpLocale() {
            return this.datePickerLanguage === 'en' ? enUS : es;
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
                return dayjs(answer).toDate();
            } else {
                return dayjs(answer).format('YYYY-MM-DD');
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
                const date = dayjs(answer).toDate();
                date.setHours(0);
                date.setMinutes(0);
                date.setSeconds(0);
                return date;
            } else {
                return dayjs(answer).format('YYYY-MM-DD');
            }
        }
    }
};
</script>

<style>
/* Icon is CSS background on .dp__input (see base.css); library calendar SVG hidden */
.carpoolear-vue-dp {
    --dp-font-size: 14px;
    --dp-input-icon-padding: 0;
    /* room for Font Awesome clear (same as .location-autocomplete input padding-right) */
    --dp-input-padding: 6px 30px 6px 12px;
    width: 100%;
}

.carpoolear-vue-dp .dp__input_wrap {
    width: 100%;
    display: block;
}

.carpoolear-vue-dp .dp__input,
.user-form .carpoolear-vue-dp .dp__input {
    border: 0;
    width: 100%;
    max-width: 100%;
    font-size: 14px;
    line-height: 22px;
    box-sizing: border-box;
}

.user-form .carpoolear-vue-dp .dp__input {
    display: block;
    margin-bottom: 0;
}

@media only screen and (min-width: 992px) {
    .search-section .carpoolear-vue-dp .dp__input {
        line-height: 42px;
        min-height: 42px;
    }
}

.date-picker .date-picker__surface.picker .date-picker--cross {
    color: #666;
    z-index: 2;
}
.date-picker--cross {
    position: absolute;
}
.date-picker--cross i {
    cursor: pointer;
    margin-left: 2px;
}
/* Match destiny field: .location-autocomplete .date-picker--cross */
.search-section .date-picker .date-picker--cross {
    right: 22px;
    top: 14px;
}
@media only screen and (min-width: 992px) {
    .search-section .date-picker .date-picker--cross {
        top: 23px;
        right: 20px;
    }
}
.date-picker {
    width: 100%;
    border: none;
    vertical-align: middle;
}
.date-picker__surface {
    position: relative;
    vertical-align: middle;
    cursor: pointer;
}
.date-picker__surface.picker {
    padding: 0.1em 0.6em;
}
@media only screen and (min-width: 992px) {
    .search-section .date-picker__surface.picker {
        padding: 0.4em 0.6em;
    }
}
.date-picker__surface.input-border {
    border-color: #66afe9;
    outline: 0;
    box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075),
        0 0 8px rgba(102, 175, 233, 0.6);
}

.date-picker__surface--mobile {
    display: block;
    width: 100%;
    height: 3em;
    box-sizing: border-box;
    padding: 0;
    background: var(--ds-input-bg, #fff)
        url("data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%27http%3A//www.w3.org/2000/svg%27%20viewBox%3D%270%200%20448%20512%27%20fill%3D%27%23555555%27%3E%3Cpath%20d%3D%27M152%2064H296V24C296%2010.7%20306.7%200%20320%200C333.3%200%20344%2010.7%20344%2024V64H384C419.3%2064%20448%2092.7%20448%20128V448C448%20483.3%20419.3%20512%20384%20512H64C28.7%20512%200%20483.3%200%20448V128C0%2092.7%2028.7%2064%2064%2064H104V24C104%2010.7%20114.7%200%20128%200C141.3%200%20152%2010.7%20152%2024V64zM48%20448C48%20456.8%2055.2%20464%2064%20464H384C392.8%20464%20400%20456.8%20400%20448V192H48V448z%27/%3E%3C/svg%3E")
        0.75rem center / 1.1rem 1.1rem no-repeat;
}

.date-picker__surface--mobile #datepicker-mobile {
    -webkit-appearance: none;
    width: 100%;
    height: 100%;
    background: transparent;
    border: 0;
    padding-left: 2.5rem;
    box-sizing: border-box;
}

@media only screen and (max-width: 991px) {
    .carpoolear-vue-dp .dp__menu {
        font-size: 1.6em;
        box-shadow: 2px 2px 11px;
        z-index: 10050;
        padding: 2.5em 1em;
        position: fixed;
        width: 90%;
        top: 0px;
        left: 0px;
        margin: 5%;
        margin-top: 40%;
    }
}

/* Date-only: no time row in popover (backup if props are ignored) */
.carpoolear-vue-dp .dp__time_input,
.carpoolear-vue-dp .dp--tp-wrap {
    display: none !important;
}
</style>
