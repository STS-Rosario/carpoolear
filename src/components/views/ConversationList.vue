<template>  
<div class="conversation-component">
    <div class="row">
        <div class="col-xs-24 col-md-8" :class="{'hidden-xs': hide}">
            <div class="conversation_list">
                <ul class="list-group">
                    <li class="list-group-item">
                        <div class="input-group">
                            <input v-model="textSearch" @input="onSearchUser" type="text" class="form-control" placeholder="Buscar personas">
                            <span class="input-group-btn">
                                <button class="btn btn-default" type="button">
                                    <i class="fa fa-search" aria-hidden="true"></i>
                                </button>
                            </span>
                        </div>
                    </li>
                    <template v-if="textSearch.length == 0">
                        <Loading :data="conversations"> 
                            <li v-for="conversation in conversations" class="list-group-item" >
                                Gato con botas
                            </li> 
                            <li v-if="moreConversations" class="list-group-item" >
                                <button class="btn btn-primary btn-block" @click="nextPage">Más resultados</button>
                            </li>
                            <li slot="no-data" class="list-group-item alert alert-warning"  role="alert">No tienes conversaciones...</li> 
                            <li slot="loading" class="list-group-item alert alert-info" role="alert">Cargando conversaciones ...</li>
                        </Loading> 
                    </template>
                    <template v-else>
                        <Loading :data="users"> 
                            <li v-for="user in users" class="list-group-item" >
                                {{user.name}}
                            </li>  
                            <li slot="no-data" class="list-group-item alert alert-warning"  role="alert">No hay concidencias</li> 
                            <li slot="loading" class="list-group-item alert alert-info" role="alert">Buscando usuarios</li>
                        </Loading>
                    </template> 
                </ul>
            </div>
        </div>
        <div class="col-xs-24-col-md-16">
            <div class="">
                <router-view></router-view>
            </div>
        </div>
    </div>
</div>
</template>
<script>
import {mapGetters, mapActions} from 'vuex';
import Loading from '../Loading.vue';

export default {
    name: 'conversation-list',
    data () {
        return {
            textSearch: ''
        };
    },
    mounted () {
        this.conversationsSearch();
    },
    computed: {
        ...mapGetters({
            conversations: 'conversations/list',
            moreConversations: 'conversations/listMorePage',
            users: 'conversations/users'
        }),

        hide () {
            return this.$route.meta.hide;
        }
    },

    methods: {
        ...mapActions({
            conversationsSearch: 'conversations/listSearch',
            searchUser: 'conversations/getUserList'
        }),
        nextPage () {
            this.conversationsSearch({next: true});
        },
        onSearchUser () {
            this.searchUser(this.textSearch);
        }
    },
    components: {
        Loading
    }
};
</script>