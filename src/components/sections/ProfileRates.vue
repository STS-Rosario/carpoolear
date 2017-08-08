<template>
    <div class="profile-rates-component container clearfix">
        <h2>Calificaciones</h2>
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

            <p slot="no-data" class="alert alert-warning"  role="alert">No hay calificaciones</p>
            <p slot="loading" class="alert alert-info" role="alert">
                <img src="https://carpoolear.com.ar/static/img/loader.gif" alt="" class="ajax-loader" />
                Cargando calificaciones ...
            </p>
        </Loading>


    </div>
</template>
<script>
import {mapGetters} from 'vuex';
import Loading from '../Loading.vue';
import RateItem from '../RateItem';

export default {
    data () {
        return {
            rating: {
                col1: [],
                col2: [],
                col3: []
            }
        };
    },
    methods: {
        makeRows () {
            if (this.rates) {
                this.rating = {
                    col1: [],
                    col2: [],
                    col3: []
                };
                let i;
                let temp = [];
                if (this.isMobile) {
                    this.rating.col1 = this.rates;
                } else if (this.isTablet) {
                    i = 0;
                    for (i; i < this.rates.length; i += 2) {
                        temp.push(this.rates[i]);
                    }
                    this.rating.col1 = temp;
                    temp = [];
                    i = 1;
                    for (i; i < this.rates.length; i += 2) {
                        temp.push(this.rates[i]);
                    }
                    this.rating.col2 = temp;
                } else {
                    i = 0;
                    temp = [];
                    for (i; i < this.rates.length; i += 3) {
                        temp.push(this.rates[i]);
                    }
                    this.rating.col1 = temp;
                    i = 1;
                    temp = [];
                    for (i; i < this.rates.length; i += 3) {
                        temp.push(this.rates[i]);
                    }
                    this.rating.col2 = temp;
                    i = 2;
                    temp = [];
                    for (i; i < this.rates.length; i += 3) {
                        temp.push(this.rates[i]);
                    }
                    this.rating.col3 = temp;
                }
            }
        }
    },
    computed: {
        ...mapGetters({
            'user': 'auth/user',
            'rates': 'profile/rates',
            'isMobile:': 'device/isMobile',
            'isTablet': 'device/isTablet',
            'isDesktop': 'device/isDesktop'
        })
    },
    watch: {
        rates: {
            handler: function (val, oldVal) {
                this.makeRows();
            }
        },
        isMobile: {
            handler: function (val, oldVal) {
                this.makeRows();
            }
        },
        isDesktop: {
            handler: function (val, oldVal) {
                this.makeRows();
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
