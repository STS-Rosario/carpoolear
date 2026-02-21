<template>
    <div>
        <datePicker
            :date="date"
            ref="calendar"
            :option="option"
            v-on:change="updateDate"
            :limit="limit"
            class="date-picker"
        ></datePicker>
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
import { ref, reactive, computed, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import datePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import moment from 'moment';

const { t } = useI18n();

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
        default: () => {
            return {};
        }
    }
});

const emit = defineEmits(['change']);

const calendar = ref(null);

const date = reactive({
    time: props.value
});

const option = reactive({
    type: 'day',
    week: [
        t('lunes'),
        t('martes'),
        t('miercoles'),
        t('jueves'),
        t('viernes'),
        t('sabado'),
        t('domingo')
    ],
    month: [
        t('enero'),
        t('febrero'),
        t('marzo'),
        t('abril'),
        t('mayo'),
        t('junio'),
        t('julio'),
        t('agosto'),
        t('septiembre'),
        t('octubre'),
        t('noviembre'),
        t('diciembre')
    ],
    format: props.format,
    placeholder: t('fecha'),
    inputStyle: {
        display: 'inline-block',
        'line-height': '22px',
        'border-radius': '2px',
        color: '#5F5F5F',
        width: '100%',
        border: 'none'
    },
    wrapperClass: props.class,
    color: {
        header: '#016587',
        headerText: '#FFF'
    },
    buttons: {
        ok: t('aceptar'),
        cancel: t('cancelar')
    },
    overlayOpacity: 0.5,
    dismissible: true
});

const limit = ref([props.limitFilter]);

const dateSys = computed(() => {
    return moment(date.time, props.format).format('YYYY-MM-DD');
});

watch(() => props.value, () => {
    let format = 'YYYY-MM-DD';
    if (props.value.indexOf('/') >= 0) {
        format = 'DD/MM/YYYY';
    }
    let time = moment(props.value, format).format('DD/MM/YYYY');
    calendar.value.showDay(time);
    date.time = moment(props.value, format).format('DD/MM/YYYY');
});

function updateDate() {
    emit('change', dateSys.value);
}

function resetDatePicker() {
    date.time = '';
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
