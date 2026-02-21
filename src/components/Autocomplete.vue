<template>
    <div class="osm-autocomplete" v-clickoutside="clickOutside" :id="name">
        <input
            ref="inputRef"
            :disabled="disabled"
            type="text"
            :placeholder="placeholder"
            v-model="input"
            @keydown="onKeyDown"
            @keyup="onKeyup"
            :class="classes"
            @focus="onFocus"
            autocomplete="new-password"
        />
        <div
            class="osm-autocomplete-results"
            v-if="results.length || waiting"
        >
            <button
                v-for="(result, index) in results"
                @click="onItemClick(result)"
                v-if="results.length"
                :key="index"
                :class="{ 'selected': index === indexAutocomplete }"
            >
                {{ result.name }}
                <small>{{ result.state }}, {{ result.country }}</small>
            </button>
            <small class="copy" v-if="results.length || waiting">
                <img
                    src="https://carpoolear.com.ar/static/img/loader.gif"
                    alt=""
                    class="ajax-loader"
                    v-if="input !== '' && waiting"
                />
                <span class="osm-copyright">&copy; OpenStreetMap</span>
            </small>
        </div>
    </div>
</template>
<script setup>
import { ref, watch, onMounted } from 'vue';
import TripApi from '../services/api/Trips';
import { useAuthStore } from '@/stores/auth';

const props = defineProps({
    name: {
        type: String,
        required: false
    },
    placeholder: {
        type: String,
        required: false,
        default: ''
    },
    disabled: {
        type: Boolean,
        required: false,
        default: false
    },
    inputCallback: {
        type: Function,
        required: false
    },
    vJumpDisabled: {
        required: false
    },
    value: {
        required: false
    },
    classes: {
        required: false
    },
    country: {
        required: false
    }
});

const emit = defineEmits(['place_changed', 'keyUpEnter']);

const authStore = useAuthStore();
const config = authStore.appConfig;

const inputRef = ref(null);
const input = ref('');
const keyUpTimerId = ref(0);
const waiting = ref(false);
const selectedValue = ref(null);
const results = ref([]);
const lastResults = ref([]);
const indexAutocomplete = ref(-1);
const resultFilterWatcher = ref(null);

watch(() => props.value, (n) => {
    if (!n) {
        input.value = '';
    } else {
        input.value = n;
    }
});

onMounted(() => {
    console.log('mounted', props.value);
    input.value = props.value ? props.value : '';
});

function onFocus($event) {
    $event.target.select();
    if (input.value !== '') {
        results.value = lastResults.value;
    }
}

function focus() {
    inputRef.value.focus();
}

function forceEmitChangeEvent() {
    if ('createEvent' in document) {
        let event = document.createEvent('HTMLEvents');
        event.initEvent('change', false, true);
        inputRef.value.dispatchEvent(event);
    } else {
        inputRef.value.fireEvent('onchange');
    }
}

function clickOutside() {
    if (keyUpTimerId.value) {
        clearTimeout(keyUpTimerId.value);
        waiting.value = false;
    }
    if (results.value && results.value.length > 0) {
        lastResults.value = results.value;
        results.value = [];
    }
}

function onKeyDown(event) {
    if (event.key === 'Enter') {
        if (results.value && results.value.length > 0) {
            onItemClick(results.value[indexAutocomplete.value]);
        } else {
            emit('keyUpEnter', event);
        }
    }
    if (event.key === 'Tab' || event.key === 'Escape') {
        clickOutside();
        if (document) {
            document.activeElement.blur();
        }
    }
    if (event.key === 'ArrowDown') {
        if (results.value && results.value.length > 0) {
            event.preventDefault();
            if (indexAutocomplete.value < results.value.length - 1) {
                indexAutocomplete.value++;
            }
        }
    } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        if (indexAutocomplete.value > 0) {
            indexAutocomplete.value--;
        }
    }
}

function onKeyup(event) {
    if (
        [
            'Tab',
            'ArrowUp',
            'ArrowDown',
            'ArrowLeft',
            'ArrowRight',
            'Enter'
        ].indexOf(event.key) > -1
    ) {
        return;
    }
    waiting.value = true;
    results.value = [];
    if (props.inputCallback) {
        props.inputCallback();
    }
    if (keyUpTimerId.value) {
        clearTimeout(keyUpTimerId.value);
    }
    keyUpTimerId.value = setTimeout(() => {
        forceEmitChangeEvent();
        autocomplete();
    }, 750);
}

function autocomplete() {
    waiting.value = true;
    results.value = [];
    /* eslint-disable */
    let tripsApi = new TripApi();
    let multi = props.country ? false : true;
    tripsApi
        .autocomplete(input.value, config.osm_country, multi)
        .then((data) => {
            waiting.value = false;
            console.log('data', data);
            data = data.nodes_geos;
            if (data) {
                data.sort((a, b) => {
                    return b.importance - a.importance;
                });
                results.value = data;
                if (config.autocomplete_select_first) {
                    indexAutocomplete.value = 0;
                }
            } else {
                results.value = [];
            }
        })
        .then(() => {
            waiting.value = false;
        });
}

function onItemClick(item) {
    waiting.value = false;
    emit('place_changed', item);
    results.value = [];
    input.value = item.name;
}

defineExpose({ focus });
</script>

<style scoped>
.osm-autocomplete {
    position: relative;
}
.osm-autocomplete-results {
    position: absolute;
    top: 100%;
    z-index: 100;
    width: 100%;
}
.osm-autocomplete-results button {
    white-space: nowrap;
    width: 100%;
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 14px;
    padding: 5px 4px;
    background: #fff;
    border: 1px solid #aaa;
    color: #000;
    text-align: left;
    border-bottom: 0;
}
.osm-autocomplete-results button small {
    font-size: 11px;
    color: #aaa;
}
.osm-autocomplete-results button.selected {
    background-color: #e0e0e0;
}
.osm-autocomplete-results .copy {
    white-space: nowrap;
    width: 100%;
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 12px;
    padding: 5px 4px;
    background: #fff;
    border: 1px solid #aaa;
    color: #000;
    text-align: right;
}
.osm-autocomplete input[disabled] {
    background-color: #ddd;
    color: #555;
    opacity: 0.85;
}
</style>
