<template>
  <div class="friends-component" >
    <div class="row">   
        <h1>Solicitudes de amistad</h1>
        <Loading :data="pendings">
            <div id="friends-list">
                <template v-for="p in pendings">
                    <div class="col-lg-6 col-md-8 col-sm-12">
                    </div>
                </template>
            </div>
            <p slot="no-data" class="alert alert-warning"  role="alert">No hay solicitudes nuevas</p> 
            <p slot="loading" class="alert alert-info" role="alert">Cargando solicitudes ...</p>
        </Loading>

        <h1>Amigos</h1>
        <div class="form-group">
            <label for="input-name">Buscar: </label>
            <input v-on:input="onTextChange" v-model="text" type="text" class="form-control" id="input-name" placeholder="Buscar amigo">

            <router-link :to="{name: 'friends_search'}" tag="button" class="btn"> Buscar personas </router-link>
        </div>
        <Loading :data="friends">
            <div id="friends-list">
                <template v-for="friend in friends">
                    <div class="col-lg-6 col-md-8 col-sm-12">
                    </div>
                </template>
            </div>
            <p slot="no-data" class="alert alert-warning"  role="alert">{{noResult}}</p> 
            <p slot="loading" class="alert alert-info" role="alert">Cargando amigos ...</p>
        </Loading>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex';
import Loading from '../Loading.vue';

export default {
    name: 'friends_setting',
    data () {
        return {
            text: ''
        };
    },
    computed: {
        ...mapGetters({
            friends: 'friends/friends',
            pendings: 'friends/pendings'
        }),

        noResult () {
            if (this.text.length) {
                return 'No hay resultados';
            } else {
                return 'No tienes ningún amigo aún.';
            }
        }
    },
    methods: {
        ...mapActions({
            'search': 'friends/friendsSearch',
            'lookPeginds': 'friends/pending',
            'accept': 'friends/accept',
            'reject': 'friends/reject',
            'cancel': 'friends/cancel'
        }),

        onTextChange () {
            this.search({value: this.text});
        }
    },

    mounted () {
        this.search({});
        this.lookPeginds();
    },
    components: {
        Loading
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  
</style>
