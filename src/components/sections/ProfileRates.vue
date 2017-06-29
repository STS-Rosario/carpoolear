<template>
    <div class="profile-rates-component">
    <Loading :data="rates">
        <div class="list-group">
            <div class="list-group-item" v-for="rate in rates">
                <RateItem :user="user" :rate="rate"></RateItem>
            </div>
         </div>
         <!--
        <div v-if="morePages">
            <button class="btn btn-primary" @click="nextPage">Más resultados</button>
        </div>
        -->

        <p slot="no-data" class="alert alert-warning"  role="alert">No hay calificaciones</p> 
        <p slot="loading" class="alert alert-info" role="alert">Cargando calificaciones ...</p>
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

        };
    },
    computed: {
        ...mapGetters({
            'user': 'auth/user',
            'rates': 'profile/rates'
        })
    },
    components: {
        Loading,
        RateItem
    }
};
</script>
