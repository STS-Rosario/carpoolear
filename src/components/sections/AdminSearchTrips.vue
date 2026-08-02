<template>
    <div class="admin-search-trips">
        <div class="admin-search-trips__foreign">
            <input
                type="checkbox"
                v-model="allowForeignPoints"
                id="adminCbxAllowForeignPoints"
                class="cbx"
            />
            <label for="adminCbxAllowForeignPoints" class="cbx_label">
                {{ $t('origenODestinoFueraDe') }}
                {{ config ? config.country_name : '' }}
            </label>
            <span
                class="tooltip-bottom"
                :data-tooltip="$t('marcandoEstaOpcionPodrasSeleccionar')"
            ></span>
            <i class="fa fa-info-circle" aria-hidden="true"></i>
        </div>

        <AppSegmentToggle
            v-model="isPassenger"
            class="admin-search-trips__toggle"
            :options="roleToggleOptions"
        />

        <div class="admin-search-trips__fields">
            <AppField
                class="admin-search-trips__field admin-search-trips__field--origin"
                :label="$t('origen')"
                optional
                icon-left="fa fa-map-marker"
            >
                <Autocomplete
                    :placeholder="$t('origen')"
                    name="from_town"
                    ref="from_town"
                    :model-value="from_town.name"
                    v-on:place_changed="(data) => getPlace(0, data)"
                    :classes="'admin-search-trips__autocomplete-input'"
                    :country="allowForeignPoints ? null : 'AR'"
                ></Autocomplete>
                <template #actionRight>
                    <button
                        type="button"
                        class="admin-search-trips__clear"
                        @click="resetInput('from_town')"
                    >
                        <i class="fa fa-times" aria-hidden="true"></i>
                    </button>
                </template>
            </AppField>

            <button
                type="button"
                class="admin-search-trips__swap"
                @click="swapCities"
            >
                <img
                    alt=""
                    class="swap-horizontal"
                    :src="swap_horizontal"
                />
                <img
                    alt=""
                    class="swap-vertical"
                    :src="swap_vertical"
                />
            </button>

            <AppField
                class="admin-search-trips__field admin-search-trips__field--destiny"
                :label="$t('destino')"
                optional
                icon-left="fa fa-map-marker"
            >
                <Autocomplete
                    :placeholder="$t('destino')"
                    name="to_town"
                    ref="to_town"
                    :model-value="to_town.name"
                    v-on:place_changed="(data) => getPlace(1, data)"
                    :classes="'admin-search-trips__autocomplete-input'"
                    :country="allowForeignPoints ? null : 'AR'"
                ></Autocomplete>
                <template #actionRight>
                    <button
                        type="button"
                        class="admin-search-trips__clear"
                        @click="resetInput('to_town')"
                    >
                        <i class="fa fa-times" aria-hidden="true"></i>
                    </button>
                </template>
            </AppField>

            <AppField
                class="admin-search-trips__field admin-search-trips__field--date"
                :label="$t('fecha')"
                optional
                icon-left="fa fa-calendar"
            >
                <DatePicker
                    ref="datepickerFrom"
                    :model-value="from_date"
                    :class="{ 'has-error': dateError.state }"
                    v-on:date_changed="(date) => (from_date = date)"
                ></DatePicker>
            </AppField>

            <AppField
                class="admin-search-trips__field admin-search-trips__field--date"
                :label="$t('fecha')"
                optional
                icon-left="fa fa-calendar"
            >
                <DatePicker
                    ref="datepickerTo"
                    :model-value="to_date"
                    :class="{ 'has-error': dateError.state }"
                    v-on:date_changed="(date) => (to_date = date)"
                ></DatePicker>
            </AppField>

            <AppField
                class="admin-search-trips__field admin-search-trips__field--user"
                :label="$t('usuario')"
                optional
                icon-left="fa fa-user"
            >
                <UserSearchAutocomplete
                    v-model="user"
                    :placeholder="$t('escribeUnNombre')"
                    :max-results="3"
                    input-class="admin-search-trips__user-search-input"
                />
                <template #actionRight>
                    <button
                        type="button"
                        class="admin-search-trips__clear"
                        @click="resetUser()"
                    >
                        <i class="fa fa-times" aria-hidden="true"></i>
                    </button>
                </template>
            </AppField>

            <div class="admin-search-trips__submit">
                <AppButton
                    variant="primary"
                    size="sm"
                    @click="submitSearch"
                >
                    {{ $t('buscar') }}
                </AppButton>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState, mapActions } from 'pinia';
import { useDeviceStore } from '../../stores/device';
import { useAuthStore } from '../../stores/auth';
import { useTripsStore } from '../../stores/trips';
import DatePicker from '../DatePicker';
import dayjs from '../../dayjs';
import dialogs from '../../services/dialogs.js';
import loading from '../Loading';
import Autocomplete from '../Autocomplete';
import UserSearchAutocomplete from '../UserSearchAutocomplete.vue';
import AppButton from '../ui/AppButton.vue';
import AppField from '../ui/AppField.vue';
import AppSegmentToggle from '../ui/AppSegmentToggle.vue';

export default {
    name: 'search-trip',
    data() {
        return {
            minDate: dayjs().toDate(),
            isPassenger: false,
            isAdmin: true,
            from_town: {
                name: '',
                location: null,
                radio: 0,
                country: 'ARG'
            },
            to_town: {
                name: '',
                location: null,
                radio: 0,
                country: 'ARG'
            },
            from_date: '',
            to_date: '',
            dateAnswer: '',
            dateError: {
                message: '',
                state: ''
            },
            user: null,
            swap_horizontal:
                process.env.ROUTE_BASE + 'img/flechas_horizontales.png',
            swap_vertical:
                process.env.ROUTE_BASE + 'img/flechas_verticales.png',
            allowForeignPoints: false,
            options: []
        };
    },
    computed: {
        ...mapState(useDeviceStore, {
            isMobile: 'isMobile'
        }),
        ...mapState(useAuthStore, {
            config: 'appConfig'
        }),
        paramsSignature() {
            const p = this.params || {};
            const keys = Object.keys(p).sort();
            return JSON.stringify(
                keys.reduce((acc, k) => {
                    acc[k] = p[k];
                    return acc;
                }, {})
            );
        },
        roleToggleOptions() {
            return [
                {
                    value: false,
                    label: this.$t('comoConductor'),
                    icon: 'fa fa-car'
                },
                {
                    value: true,
                    label: this.$t('comoPasajero'),
                    icon: 'fa fa-user'
                }
            ];
        }
    },
    methods: {
        ...mapActions(useTripsStore, {
            search: 'tripsSearch'
        }),
        getPlace(i, data) {
            console.log('getPlace', data);
            let obj = {};
            // FIXME falta bounding box
            if (data) {
                obj = {
                    name: data.name,
                    location: {
                        lat: parseFloat(data.lat),
                        lng: parseFloat(data.lng)
                    },
                    country: data.country
                };
            }
            if (i === 0) {
                this.from_town = obj;
            } else {
                this.to_town = obj;
            }
        },
        submitSearch() {
            this.emit(false);
        },
        emit(includeRoutePage = false) {
            let params = {};
            let foreignCountry = 0;
            if (this.from_town.location) {
                console.log('emit', this.from_town.location);
                params.origin_lat = this.from_town.location.lat;
                params.origin_lng = this.from_town.location.lng;
                params.origin_radio = this.from_town.radio;
                params.origin_name = this.from_town.name;
                params.origin_id = this.from_town.id;
            } else {
                params.origin_name = this.$refs['from_town'].input;
            }
            if (
                this.from_town &&
                this.from_town.country &&
                this.from_town.country.toLowerCase() !==
                    this.config.osm_country.toLowerCase()
            ) {
                foreignCountry++;
            }
            if (this.to_town.location) {
                params.destination_lat = this.to_town.location.lat;
                params.destination_lng = this.to_town.location.lng;
                params.destination_radio = this.to_town.radio;
                params.destination_name = this.to_town.name;
                params.destination_id = this.to_town.id;
            } else {
                params.destination_name = this.$refs['to_town'].input;
            }
            if (
                this.to_town &&
                this.to_town.country &&
                this.to_town.country.toLowerCase() !==
                    this.config.osm_country.toLowerCase()
            ) {
                foreignCountry++;
            }
            if (this.from_date) {
                params.from_date = this.from_date;
            }
            if (this.to_date) {
                params.to_date = this.to_date;
            }

            if (!this.from_date && !this.to_date) {
                params.history = true;
            }
            if (this.user && this.user.id) {
                params.user_id = this.user.id;
            }
            params.is_passenger = this.isPassenger;
            params.is_admin = this.isAdmin;
            if (
                includeRoutePage &&
                this.params &&
                this.params.page != null
            ) {
                const p = parseInt(String(this.params.page), 10);
                if (Number.isFinite(p) && p >= 1) {
                    params.page = p;
                }
            }
            if (foreignCountry < 2) {
                this.$emit('admin-trip-search', params);
            } else {
                dialogs.message(
                    this.$t('origenYDestinoNoPuedenSerAmbosDelExterior'),
                    {
                        duration: 10,
                        estado: 'error'
                    }
                );
            }
        },
        resetInput(input) {
            if (this.$refs[input]) {
                this.$refs[input].input = '';
            }
            this[input] = {
                name: '',
                location: null,
                radio: 0,
                country: this.config.osm_country
            };
        },
        resetUser() {
            this.user = null;
        },
        swapCities() {
            let temp;
            temp = this['to_town'];
            this['to_town'] = Object.assign({}, this['from_town']);
            this['from_town'] = Object.assign({}, temp);
        },
        clear() {
            this.resetInput('from_town');
            this.$refs['from_town'].input = '';
            this.resetInput('to_town');
            this.$refs['to_town'].input = '';
            if (this.$refs.datepickerFrom) {
                this.$refs.datepickerFrom.clear();
            }
            if (this.$refs.datepickerTo) {
                this.$refs.datepickerTo.clear();
            }
        },
        onSearch(search, loading) {
            loading(true);
            this.search(loading, search, this);
        },
        applyParams() {
            const params = this.params || {};
            if (params.user_id) {
                const userId = parseInt(params.user_id, 10);
                if (!Number.isNaN(userId) && userId > 0) {
                    this.user = {
                        id: userId,
                        name: params.user_name ? String(params.user_name) : ''
                    };
                }
            }
            if (params.is_passenger != null) {
                const raw = String(params.is_passenger).toLowerCase();
                this.isPassenger = raw === '1' || raw === 'true';
            }
            if (params.from_date) this.from_date = String(params.from_date);
            if (params.to_date) this.to_date = String(params.to_date);

            const hasAnyParam = Object.keys(params).length > 0;
            if (hasAnyParam) {
                this.emit(true);
            }
        }
    },
    props: ['params'],
    components: {
        DatePicker,
        Autocomplete,
        loading,
        UserSearchAutocomplete,
        AppButton,
        AppField,
        AppSegmentToggle
    },
    watch: {
        paramsSignature: {
            immediate: true,
            handler() {
                this.applyParams();
            }
        }
    }
};
</script>

<style scoped>
.admin-search-trips {
    margin-bottom: 1rem;
}

.admin-search-trips__foreign {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 0.35rem;
    margin-bottom: 0.75rem;
}

.admin-search-trips__foreign .cbx,
.admin-search-trips__foreign .cbx_label {
    margin: 0;
    vertical-align: middle;
}

.admin-search-trips__foreign .cbx_label {
    margin-left: 0.35rem;
    color: var(--ds-action, #00a3e0);
}

.admin-search-trips__toggle {
    max-width: 32rem;
    margin-bottom: 1rem;
}

.admin-search-trips__fields {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-end;
    gap: 0.75rem;
}

.admin-search-trips__field {
    flex: 1 1 12rem;
    min-width: 10rem;
    margin-bottom: 0;
}

.admin-search-trips__field--date {
    flex: 1 1 9rem;
    max-width: 12rem;
}

.admin-search-trips__field--user {
    flex: 1 1 12rem;
}

.admin-search-trips__swap {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2rem;
    height: 2rem;
    margin: 0 0 0.35rem;
    padding: 0;
    border: 0;
    background: transparent;
    cursor: pointer;
    flex-shrink: 0;
}

.admin-search-trips__swap img {
    width: 1.25rem;
    height: 1.25rem;
}

.admin-search-trips__swap .swap-vertical {
    display: none;
}

.admin-search-trips__clear {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2rem;
    height: 2rem;
    padding: 0;
    border: 0;
    border-radius: 999px;
    background: transparent;
    color: var(--ds-action);
    cursor: pointer;
}

.admin-search-trips__submit {
    flex-shrink: 0;
    padding-bottom: 0.15rem;
}

.admin-search-trips__field--origin :deep(.admin-search-trips__autocomplete-input) {
    border-color: transparent;
    color: var(--ds-input-text);
}

.admin-search-trips__field--destiny :deep(.admin-search-trips__autocomplete-input) {
    border-color: transparent;
    color: var(--ds-input-text);
}

.admin-search-trips :deep(.admin-search-trips__user-search-input),
.admin-search-trips :deep(.app-input__control.admin-search-trips__user-search-input) {
    border: 0;
    background: transparent;
    box-shadow: none;
    margin: 0;
    line-height: 1.3;
    padding: var(--ds-input-padding-y, 0.75rem) 0;
    width: 100%;
    font-size: var(--ds-input-font-size, 1rem);
    color: var(--ds-input-text, #22211f);
}

.admin-search-trips :deep(.carpoolear-vue-dp) {
    width: 100%;
    --dp-font-family: var(--ds-font-family);
    --dp-font-size: var(--ds-input-font-size);
    --dp-input-padding: var(--ds-input-padding-y) 2rem var(--ds-input-padding-y) 0;
    --dp-input-icon-padding: 0;
}

.admin-search-trips :deep(.carpoolear-vue-dp .dp__input_wrap) {
    width: 100%;
}

.admin-search-trips :deep(.app-field .carpoolear-vue-dp .dp__input) {
    min-height: 0;
    line-height: 1.3;
    padding-top: var(--ds-input-padding-y);
    padding-right: 2rem;
    padding-bottom: var(--ds-input-padding-y);
    padding-left: 0 !important;
    border: 0;
    background: transparent;
    background-image: none !important;
    box-shadow: none;
    font-family: var(--ds-font-family);
    font-size: var(--ds-input-font-size);
    font-weight: var(--ds-font-weight-normal);
    color: var(--ds-input-text);
}

.admin-search-trips :deep(.app-field .carpoolear-vue-dp .dp__input::placeholder) {
    color: var(--ds-input-placeholder);
    opacity: 1;
    font-family: var(--ds-font-family);
    font-size: var(--ds-input-font-size);
    font-weight: var(--ds-font-weight-normal);
}

.admin-search-trips :deep(.date-picker .date-picker--cross) {
    top: 50%;
    right: 0.5rem;
    transform: translateY(-50%);
    color: var(--ds-action);
}

.admin-search-trips :deep(.date-picker .date-picker--cross i) {
    color: var(--ds-action);
}

.admin-search-trips :deep(.date-picker__surface.picker) {
    padding: 0;
}

@media (max-width: 767px) {
    .admin-search-trips__swap .swap-horizontal {
        display: none;
    }

    .admin-search-trips__swap .swap-vertical {
        display: block;
    }

    .admin-search-trips__field--date {
        max-width: none;
    }
}
</style>
