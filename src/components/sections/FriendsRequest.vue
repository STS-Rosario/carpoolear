<template>
  <div class="friends-component" >
    <div class="row">   
        <h1>Buscar amigos</h1>
        <div class="form-group">
            <label for="input-name">Buscar: </label>
            <input v-on:input="onTextChange" v-model="text" type="text" class="form-control" id="input-name" placeholder="Buscar amigo">
        </div>
        <Loading :data="users">
            <div id="friends-list">
                <template v-for="user in users">
                    <div class="col-lg-6 col-md-8 col-sm-12">
                        {{user.name}}
                    </div>
                </template>
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

export default {
    name: 'friends_request',
    data () {
        return {
            text: ''
        };
    },
    computed: {
        ...mapGetters({
            users: 'friends/users'
        })
    },
    methods: {
        ...mapActions({
            'search': 'friends/searchUsers'
        }),

        onTextChange () {
            console.log(this.text);
            this.search(this.text);
        }
    },

    mounted () {
        // this.search({});
    },
    components: {
        Loading
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  
</style>
