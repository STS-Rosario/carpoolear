<template>
  <div class="friends-component" >
    <div class="row">
        <h1>Buscar contacto</h1>
        <div class="form-group">
            <label for="input-name">Buscar: </label>
            <input v-on:input="onTextChange" v-model="text" type="text" class="form-control" id="input-name" placeholder="Buscar amigo">
        </div>
        <Loading :data="users">
            <div id="friends-list">
                <FriendCard v-for="user in users" :user="user">
                    <template slot>
                        <button @click="onAddClick(user)" v-if="user.state == 'none'" class="btn btn-primary"> Agregar amigo </button>
                        <button v-if="user.state != 'none'" class="btn"> Solicitud enviada </button>
                        <span v-if="idRequesting == user.id">En proceso...</span>
                    </template>
                </FriendCard>
            </div>
            <p slot="no-data" class="alert alert-warning"  role="alert">No hay resultados</p>
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
    name: 'friends_request',
    data () {
        return {
            text: '',
            idRequesting: 0
        };
    },
    computed: {
        ...mapGetters({
            users: 'friends/users'
        })
    },
    methods: {
        ...mapActions({
            'search': 'friends/searchUsers',
            'request': 'friends/request'
        }),

        onTextChange () {
            this.search(this.text);
        },

        onAddClick (user) {
            this.idRequesting = user.id;
            this.request(user.id).then(() => {
                this.idRequesting = 0;
            }, () => {
                this.idRequesting = 0;
            });
        }
    },

    mounted () {
        // this.search({});
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
