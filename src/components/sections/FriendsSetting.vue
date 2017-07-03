<template>
  <div class="friends-component" >
    <div class="row">   
        
        <Loading :data="pendings" :hideOnEmpty="true">
            <h1 slot="title">Solicitudes de amistad</h1>
            <div id="friends-list">
                <FriendCard v-for="user in pendings" :user="user">
                    <template slot>
                        <button @click="onAcceptClick(user)" class="btn btn-primary"> Acceptar </button>
                        <button @click="onRejectClick(user)" class="btn"> Rechazar </button>
                        <span v-if="idRequesting == user.id">En proceso...</span>
                    </template>
                </FriendCard>
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
                <FriendCard v-for="user in friends" :user="user">
                    <template slot>
                        
                        <button @click="onDeleteClick(user)" class="btn btn-primary"> Eliminar </button>
                        <span v-if="idRequesting == user.id">En proceso...</span>
                        
                    </template>
                </FriendCard>
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
import FriendCard from './FriendCard';

export default {
    name: 'friends_setting',
    data () {
        return {
            text: '',
            idRequesting: 0
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
            'delete': 'friends/delete'
        }),

        onTextChange () {
            this.search({value: this.text});
        },

        onAcceptClick (user) {
            this.idRequesting = user.id;
            this.accept(user.id).then(() => {
                this.idRequesting = 0;
            }, () => {
                this.idRequesting = 0;
            });
        },

        onRejectClick (user) {
            this.idRequesting = user.id;
            this.reject(user.id).then(() => {
                this.idRequesting = 0;
            }, () => {
                this.idRequesting = 0;
            });
        },

        onDeleteClick (user) {
            this.idRequesting = user.id;
            this.delete(user.id).then(() => {
                this.idRequesting = 0;
            }, () => {
                this.idRequesting = 0;
            });
        }
    },

    mounted () {
        this.search({});
        this.lookPeginds();
    },
    components: {
        Loading,
        FriendCard
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  
</style>
