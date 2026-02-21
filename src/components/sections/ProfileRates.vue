<template>
    <div class="profile-rates-component container">
        <div class="clearfix">
            <h2>{{ t('calificaciones') }}</h2>
            <Loading :data="rates">
                <div class="list-group">
                    <div class="column-rating">
                        <div
                            class="list-group-item clearfix"
                            v-for="rate in rating.col1"
                        >
                            <RateItem
                                :user="user"
                                :id="id"
                                :rate="rate"
                            ></RateItem>
                        </div>
                    </div>
                    <div class="column-rating">
                        <div
                            class="list-group-item clearfix"
                            v-for="rate in rating.col2"
                        >
                            <RateItem
                                :user="user"
                                :id="id"
                                :rate="rate"
                            ></RateItem>
                        </div>
                    </div>
                    <div class="column-rating">
                        <div
                            class="list-group-item clearfix"
                            v-for="rate in rating.col3"
                        >
                            <RateItem
                                :user="user"
                                :id="id"
                                :rate="rate"
                            ></RateItem>
                        </div>
                    </div>
                </div>

                <template #no-data>
                    <p class="alert alert-warning" role="alert">
                        {{ t('noCalificaciones') }}
                    </p>
                </template>
                <template #loading>
                    <p class="alert alert-info" role="alert">
                        <img
                            src="https://carpoolear.com.ar/static/img/loader.gif"
                            alt=""
                            class="ajax-loader"
                        />
                        {{ t('cargandoNotificaciones') }}
                    </p>
                </template>
            </Loading>
        </div>

        <template v-if="config && config.module_references">
            <div class="clearfix">
                <h2>{{ t('referencias') }}</h2>
                <Loading :data="references">
                    <div class="list-group">
                        <div class="column-rating">
                            <div
                                class="list-group-item clearfix"
                                v-for="reference in referencesCol.col1"
                            >
                                <RateItem
                                    :notReply="true"
                                    :user="user"
                                    :id="id"
                                    :rate="reference"
                                ></RateItem>
                            </div>
                        </div>
                        <div class="column-rating">
                            <div
                                class="list-group-item clearfix"
                                v-for="reference in referencesCol.col2"
                            >
                                <RateItem
                                    :notReply="true"
                                    :user="user"
                                    :id="id"
                                    :rate="reference"
                                ></RateItem>
                            </div>
                        </div>
                        <div class="column-rating">
                            <div
                                class="list-group-item clearfix"
                                v-for="reference in referencesCol.col3"
                            >
                                <RateItem
                                    :notReply="true"
                                    :user="user"
                                    :id="id"
                                    :rate="reference"
                                ></RateItem>
                            </div>
                        </div>
                    </div>
                    <template #no-data>
                        <p class="alert alert-warning" role="alert">
                            {{ t('noReferences') }}
                        </p>
                    </template>
                    <template #loading>
                        <p class="alert alert-info" role="alert">
                            <img
                                src="https://carpoolear.com.ar/static/img/loader.gif"
                                alt=""
                                class="ajax-loader"
                            />
                            {{ t('cargandoNotificaciones') }}
                        </p>
                    </template>
                </Loading>
            </div>
        </template>
    </div>
</template>
<script setup>
import { ref, reactive, computed, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useAuthStore } from '@/stores/auth';
import { useProfileStore } from '@/stores/profile';
import { useDeviceStore } from '@/stores/device';
import Loading from '../Loading.vue';
import RateItem from '../RateItem';

const { t } = useI18n();
const authStore = useAuthStore();
const profileStore = useProfileStore();
const deviceStore = useDeviceStore();

const props = defineProps(['id']);

const emptyCols = {
    col1: [],
    col2: [],
    col3: []
};

const rating = ref({});
const referencesCol = ref({});

const user = computed(() => authStore.user);
const rates = computed(() => profileStore.rates);
const isMobile = computed(() => deviceStore.isMobile);
const isTablet = computed(() => deviceStore.isTablet);
const isDesktop = computed(() => deviceStore.isDesktop);
const config = computed(() => authStore.appConfig);
const references = computed(() => profileStore.references);

function cleanCols(array) {
    if (array === 'rating') {
        rating.value = JSON.parse(JSON.stringify(emptyCols));
    } else {
        referencesCol.value = JSON.parse(JSON.stringify(emptyCols));
    }
}

function makeRows(arrayToCheck, arrayToPush) {
    const sourceMap = { rates: rates, references: references };
    const targetMap = { rating: rating, referencesCol: referencesCol };
    const source = sourceMap[arrayToCheck]?.value;
    if (source) {
        cleanCols(arrayToPush);
        if (isMobile.value) {
            targetMap[arrayToPush].value.col1 = source.slice(0);
        } else {
            let i, j;
            let rows = isTablet.value ? 2 : 3;
            for (j = 0; j < rows; j++) {
                i = j;
                for (i; i < source.length; i += rows) {
                    targetMap[arrayToPush].value[`col${j + 1}`].push(
                        source[i]
                    );
                }
            }
        }
    }
}

watch(rates, () => {
    makeRows('rates', 'rating');
});

watch(references, () => {
    if (config.value && config.value.module_references) {
        makeRows('references', 'referencesCol');
    }
});

watch(isMobile, () => {
    console.log('isMobileChange');
    makeRows('rates', 'rating');
    if (config.value && config.value.module_references) {
        makeRows('references', 'referencesCol');
    }
});

watch(isDesktop, () => {
    makeRows('rates', 'rating');
    if (config.value && config.value.module_references) {
        makeRows('references', 'referencesCol');
    }
});
</script>
<style scoped>
.profile-rates-component {
    padding-bottom: 6em;
}
</style>
