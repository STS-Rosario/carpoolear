<template>
    <div>
        <VueDatePicker
            v-model="date"
            ref="calendar"
            :format="displayFormat"
            :locale="locale"
            :min-date="minDate"
            :placeholder="t('fecha')"
            :auto-apply="true"
            :enable-time-picker="false"
            @update:model-value="updateDate"
            class="date-picker"
        />
        <div class="date-picker--cross">
            <i
                v-on:click="resetDatePicker"
                class="fa fa-times"
                aria-hidden="true"
            ></i>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import moment from 'moment';

const { t, locale: i18nLocale } = useI18n();

const props = defineProps({
    format: {
        type: String,
        required: false,
        default: 'DD/MM/YYYY'
    },
    class: {
        type: String,
        required: false,
        default: ''
    },
    value: {
        type: String,
        required: false,
        default: ''
    },
    limitFilter: {
        type: Object,
        required: false,
        default: () => ({})
    }
});

const emit = defineEmits(['change']);

const calendar = ref(null);

const date = ref(props.value ? moment(props.value, props.format).toDate() : null);

const locale = computed(() => {
    const localeMap = { arg: 'es', chl: 'es', en: 'en' };
    return localeMap[i18nLocale.value] || 'es';
});

const displayFormat = computed(() => {
    return props.format.replace('DD', 'dd').replace('MM', 'MM').replace('YYYY', 'yyyy');
});

const minDate = computed(() => {
    if (props.limitFilter && props.limitFilter.from) {
        return new Date(props.limitFilter.from);
    }
    return undefined;
});

watch(() => props.value, (newVal) => {
    if (newVal) {
        let format = 'YYYY-MM-DD';
        if (newVal.indexOf('/') >= 0) {
            format = 'DD/MM/YYYY';
        }
        date.value = moment(newVal, format).toDate();
    } else {
        date.value = null;
    }
});

function updateDate(modelData) {
    if (modelData) {
        const formatted = moment(modelData).format('YYYY-MM-DD');
        emit('change', formatted);
    }
}

function resetDatePicker() {
    date.value = null;
    emit('change', '');
}
</script>

<style scoped>
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
