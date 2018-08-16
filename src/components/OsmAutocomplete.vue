<template>
    <div class="osm-autocomplete"><!-- v-click-outside="clickOutside" -->
        <input ref="input" :disabled="disabled"  type="text" :placeholder="placeholder" v-model="input" @keydown="onKeyDown" @keyup="onKeyup" :id="name" :class="classes" @focus="onFocus" />
        <div class="osm-autocomplete-results" v-if="results.length">
            <button v-for="result in results" @click="onItemClick(result)">
                {{ result.address[result.type] ? result.address[result.type] : (result.address['county'] ? result.address['county'] : result.address['city']) }}
                <small>{{ result.address.state }}, {{ result.address.country }}</small>
            </button>
            <small class="copy">© OpenStreetMap</small>
        </div>
    </div>
</template>
<script>
import OsmApi from '../services/api/Osm';

let osmApi = new OsmApi();
export default {
    name: 'osmautocomplete',
    watch: {
        value (n, o) {
            if (!n) {
                this.input = '';
            }
        }
    },
    data () {
        return {
            input: '',
            keyUpTimerId: 0,
            waiting: false,
            selectedValue: null,
            results: [],
            lastResults: [],
            indexAutocomplete: -1,
            resultFilterWatcher: null
        };
    },
    mounted () {

    },
    computed: {
    },
    methods: {
        onFocus ($event) {
            $event.target.select();
            if (this.input !== '') {
                this.results = this.lastResults;
            }
        },
        focus () {
            this.$refs.input.focus();
        },
        forceEmitChangeEvent () {
            if ('createEvent' in document) {
                let event = document.createEvent('HTMLEvents');
                event.initEvent('change', false, true);
                this.$refs.input.dispatchEvent(event);
            } else {
                this.$refs.input.fireEvent('onchange');
            }
        },
        clickOutside () {
            if (this.keyUpTimerId) {
                clearTimeout(this.keyUpTimerId);
                this.waiting = false;
            }
            if (this.results && this.results.length > 0) {
                this.lastResults = this.results;
                this.results = [];
            }
        },
        onKeyDown (event) {
            if (event.key === 'Enter') {
                if (this.results && this.results.length > 0) {
                    this.onItemClick(this.results[this.indexAutocomplete]);
                } else {
                    if (this.$parent.$jump && !this.vJumpDisabled) {
                        this.$parent.$jump(this.type);
                    }
                    this.$emit('keyUpEnter', event);
                }
            }
            if (event.key === 'Tab' || event.key === 'Escape') {
                this.clickOutside();
                if (document) {
                    document.activeElement.blur();
                }
            }
            if (event.key === 'ArrowDown') {
                if (this.results && this.results.length > 0) {
                    event.preventDefault();
                    if (this.indexAutocomplete < this.results.length - 1) {
                        this.indexAutocomplete++;
                    }
                }
            } else if (event.key === 'ArrowUp') {
                event.preventDefault();
                if (this.indexAutocomplete > 0) {
                    this.indexAutocomplete--;
                }
            }
        },
        onKeyup (event) {
            if (['Tab', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Enter'].indexOf(event.key) > -1) {
                return;
            }
            this.waiting = true;
            if (this.inputCallback) {
                this.inputCallback();
            }
            if (this.keyUpTimerId) {
                clearTimeout(this.keyUpTimerId);
            }
            this.keyUpTimerId = setTimeout(() => {
                this.forceEmitChangeEvent();
                this.autocomplete();
            }, 500);
        },
        autocomplete () {
            /* eslint-disable */
            let data = {
                input: this.input,
                country: this.country
            };
            osmApi.search(data).then(data => {
                console.log(data);
                data = data.filter(o => {
                    let type = ['city', 'town', 'village', 'hamlet', 'administrative'].indexOf(o.type) >= 0;
                    let osmType = ['node', 'relation'].indexOf(o.osm_type) >= 0;
                    let county = true;
                    if (o.class === 'boundary') {
                        if (o.address.county) {
                            let city = data.find(c => c.address.city === o.address.county);
                            if (city) {
                                county = false;
                            } else {
                                // county = o.address.county.toLowerCase().indexOf(this.input.toLowerCase()) >= 0;
                                county = new RegExp(this.input.toLowerCase(), 'gi').test(o.address.county.normalize('NFD').replace(/[\u0300-\u036f]/g, ""));
                            }
                        } else {
                            if (o.address.city) {
                                // county = o.address.city.match(new RegExp(this.input.toLowerCase(), 'g'));
                                county = new RegExp(this.input.toLowerCase(), 'gi').test(o.address.city.normalize('NFD').replace(/[\u0300-\u036f]/g, ""));
                                county = county && !o.address.city_district;
                            } else {
                                county = false;
                            }
                        }
                    }
                    return type && osmType && county;
                });
                data.sort((a, b) => {
                    return b - a;
                });
                this.results = data.slice(0, 6);
                console.log(this.results);
            });
        },
        onItemClick (item) {
            this.$emit('place_changed', item);
            this.results = [];
            this.input = item.address[item.type] ? item.address[item.type] : item.address['county'];
        }
    },
    props: {
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
    }
};
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
        background: #FFF;
        border: 1px solid #AAA;
        color: #000;
        text-align: left;
        border-bottom: 0;
    }
    .osm-autocomplete-results button small {
        font-size: 11px;
        color: #AAA;
    }
    .osm-autocomplete-results .copy {
        white-space: nowrap;
        width: 100%;
        display: block;
        overflow: hidden;
        text-overflow: ellipsis;
        font-size: 12px;
        padding: 5px 4px;
        background: #FFF;
        border: 1px solid #AAA;
        color: #000;
        text-align: right;
    }
</style>
