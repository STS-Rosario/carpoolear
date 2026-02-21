<template>
    <div class="date-picker">
        <div
            v-if="browser"
            class="form-control picker"
            :class="focus ? 'input-border' : ''"
        >
            <DatepickerSystem
                ref="datepickerSystem"
                :clearable="true"
                :model-value="dateBrowser"
                :locale="datePickerLanguage"
                @open="focus = true"
                @closed="focus = false"
                @update:model-value="changeValue"
                :placeholder="t('fecha')"
                :format="'dd/MM/yyyy'"
                :min-date="min"
                :max-date="max"
                :disabled="disabledPicker"
                :enable-time-picker="false"
                :auto-apply="true"
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
                :min="formatDate(min, 'YYYY-MM-DD')"
                :max="formatDate(max, 'YYYY-MM-DD')"
                autocomplete="off"
            />
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUpdated } from 'vue';
import { useI18n } from 'vue-i18n';
import DatepickerSystem from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import moment from 'moment';
import bus from '../services/bus-event';
import { useDeviceStore } from '@/stores/device';
import { useCordovaStore } from '@/stores/cordova';
import { formatDate } from '@/composables/useFormatters';

const { t, locale } = useI18n();
const deviceStore = useDeviceStore();
const cordovaStore = useCordovaStore();

const props = defineProps({
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
});

const emit = defineEmits(['date_changed']);

const datepickerSystem = ref(null);
const mobileInput = ref(null);

const dateBrowser = ref('');
const dateMobile = ref('');
const date = ref('');
const update = ref(true);
const focus = ref(false);
const nextYear = ref(moment().add(2, 'years').format('YYYY-MM-DD'));
const lastCentury = ref(moment().subtract(100, 'years').format('YYYY-MM-DD'));
const niceDate = ref('');

const isMobile = computed(() => deviceStore.isMobile);
const device = computed(() => cordovaStore.device);

const datePickerLanguage = computed(() => {
    const loc = locale.value || 'arg';
    switch (loc) {
        case 'en':
            return 'en';
        case 'arg':
            return 'es';
        case 'chl':
            return 'es';
        default:
            return 'es';
    }
});

const browser = computed(() => {
    if (device.value) {
        if (device.value.platform === 'browser') {
            return true;
        } else {
            return false;
        }
    } else {
        return true;
    }
});

const max = computed(() => {
    let answer;
    if (props.maxDate) {
        answer = props.maxDate;
    } else {
        answer = nextYear.value;
    }
    if (browser.value) {
        return moment(answer).toDate();
    } else {
        return moment(answer).format('YYYY-MM-DD');
    }
});

const min = computed(() => {
    let answer;
    if (props.minDate) {
        answer = props.minDate;
    } else {
        answer = lastCentury.value;
    }
    if (browser.value) {
        let d = moment(answer).toDate();
        d.setHours(0);
        d.setMinutes(0);
        d.setSeconds(0);
        return d;
    } else {
        return moment(answer).format('YYYY-MM-DD');
    }
});

onMounted(() => {
    if (props.value !== '') {
        dateBrowser.value = moment(props.value).toDate();
        dateMobile.value = props.value;
        niceDate.value = moment(props.value).format('DD/MM/YYYY');
    }
});

onUpdated(() => {
    if (props.value !== '') {
        niceDate.value = moment(props.value).format('DD/MM/YYYY');
    }
});

function clear() {
    dateBrowser.value = '';
    dateMobile.value = '';
    niceDate.value = '';
}

function changeValue(value) {
    dateBrowser.value = value;
}

function changeMobileValue(el) {
    dateMobile.value = el.target.value;
    if (el.target.value) {
        niceDate.value = moment(el.target.value).format('DD/MM/YYYY');
    } else {
        niceDate.value = '';
    }
}

function setFocus() {
    if (browser.value) {
        datepickerSystem.value.openMenu();
    } else {
        mobileInput.value.focus();
    }
}

watch(dateBrowser, (value) => {
    value =
        value && value !== '' ? moment(value).format('YYYY-MM-DD') : '';

    bus.emit('date-change', value);

    emit('date_changed', value);
});

watch(dateMobile, (value) => {
    value = value && value !== '' ? value : '';

    bus.emit('date-change', value);

    emit('date_changed', value);
});

watch(() => props.value, (value) => {
    dateBrowser.value = moment(props.value).toDate();
    dateMobile.value = props.value;
    niceDate.value = moment(props.value).format('DD/MM/YYYY');
});

defineExpose({ clear, setFocus });
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
