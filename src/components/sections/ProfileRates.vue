<template>
    <div class="profile-rates-component container">
        <div class="clearfix">
            <h2>{{ $t('calificaciones') }}</h2>
            <Loading :data="rates">
                <div class="list-group">
                    <div class="column-rating">
                        <div class="list-group-item clearfix" v-for="rate in rating.col1">
                            <RateItem :user="user" :id="id" :rate="rate"></RateItem>
                        </div>
                    </div>
                    <div class="column-rating">
                        <div class="list-group-item clearfix" v-for="rate in rating.col2">
                            <RateItem :user="user" :id="id" :rate="rate"></RateItem>
                        </div>
                    </div>
                    <div class="column-rating">
                        <div class="list-group-item clearfix" v-for="rate in rating.col3">
                            <RateItem :user="user" :id="id" :rate="rate"></RateItem>
                        </div>
                    </div>
                </div>
                <!--
                <div v-if="morePages">
                    <button class="btn btn-primary" @click="nextPage">Más resultados</button>
                </div>
                -->

                <p slot="no-data" class="alert alert-warning"  role="alert">{{ $t('noCalificaciones') }}</p>
                <p slot="loading" class="alert alert-info" role="alert">
                    <img src="https://carpoolear.com.ar/static/img/loader.gif" alt="" class="ajax-loader" />
                    {{ $t('cargandoNotificaciones') }}
                </p>
            </Loading>
        </div>

        <template v-if="config && config.module_references">
            <div class="clearfix">
                <h2>{{ $t('referencias') }}</h2>
                <Loading :data="references">
                    <div class="list-group">
                        <div class="column-rating">
                            <div class="list-group-item clearfix" v-for="reference in referencesCol.col1">
                                <RateItem :notReply="true" :user="user" :id="id" :rate="reference"></RateItem>
                            </div>
                        </div>
                        <div class="column-rating">
                            <div class="list-group-item clearfix" v-for="reference in referencesCol.col2">
                                <RateItem :notReply="true" :user="user" :id="id" :rate="reference"></RateItem>
                            </div>
                        </div>
                        <div class="column-rating">
                            <div class="list-group-item clearfix" v-for="reference in referencesCol.col3">
                                <RateItem :notReply="true" :user="user" :id="id" :rate="reference"></RateItem>
                            </div>
                        </div>
                    </div>
                    <!--
                    <div v-if="morePages">
                        <button class="btn btn-primary" @click="nextPage">Más resultados</button>
                    </div>
                    -->
                    <p slot="no-data" class="alert alert-warning"  role="alert">{{ $t('noReferences') }}</p>
                    <p slot="loading" class="alert alert-info" role="alert">
                        <img src="https://carpoolear.com.ar/static/img/loader.gif" alt="" class="ajax-loader" />
                        {{ $t('cargandoNotificaciones') }}
                    </p>
                </Loading>
            </div>
        </template>

    </div>
</template>
<script>
import { mapGetters } from 'vuex';
import Loading from '../Loading.vue';
import RateItem from '../RateItem';

let emptyCols = {
    col1: [],
    col2: [],
    col3: []
};

export default {
    data () {
        return {
            rating: {},
            referencesCol: {}
        };
    },
    methods: {
        cleanCols (array) {
            this[array] = JSON.parse(JSON.stringify(emptyCols));
        },
        makeRows (arrayToCheck, arrayToPush) {
            if (this[arrayToCheck]) {
                this.cleanCols(arrayToPush);
                if (this.isMobile) {
                    this[arrayToPush].col1 = this[arrayToCheck].slice(0);
                } else {
                    let i, j;
                    let rows = this.isTablet ? 2 : 3;
                    for (j = 0; j < rows; j++) {
                        i = j;
                        for (i; i < this[arrayToCheck].length; i += rows) {
                            this[arrayToPush][`col${j + 1}`].push(this[arrayToCheck][i]);
                        }
                    }
                }
            }
        }
    },
    computed: {
        ...mapGetters({
            'user': 'auth/user',
            'rates': 'profile/rates',
            'isMobile': 'device/isMobile',
            'isTablet': 'device/isTablet',
            'isDesktop': 'device/isDesktop',
            'config': 'auth/appConfig',
            'references': 'profile/references'
        })
    },
    watch: {
        rates: {
            handler: function (val, oldVal) {
                this.makeRows('rates', 'rating');
            }
        },
        references: {
            handler: function (val, oldVal) {
                if (this.config && this.config.module_references) {
                    this.makeRows('references', 'referencesCol');
                }
            }
        },
        isMobile: {
            handler: function (val, oldVal) {
                console.log('isMobileChange');
                this.makeRows('rates', 'rating');
                if (this.config && this.config.module_references) {
                    this.makeRows('references', 'referencesCol');
                }
            }
        },
        isDesktop: {
            handler: function (val, oldVal) {
                this.makeRows('rates', 'rating');
                if (this.config && this.config.module_references) {
                    this.makeRows('references', 'referencesCol');
                }
            }
        }
    },
    components: {
        Loading,
        RateItem
    },
    props: [
        'id'
    ]
};
</script>
<style scoped>
    .profile-rates-component {
        padding-bottom: 6em;
    }
</style>
