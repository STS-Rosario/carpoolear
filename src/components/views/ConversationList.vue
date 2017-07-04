<template>  
<div class="conversation-component margin-header">
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
                            <li v-for="conversation in conversations" class="list-group-item" @click="onChangeConversation(conversation)" :class="{'unread': conversation.unread, 'active': selected && conversation.id === selected.id  }" >
                                <img alt="" :src="conversation.image | conversation-image" class="conversation_image circle-box" />
                                <span class="conversation-title">{{conversation.title}}</span>
                                <span class="conversation-timestamp">{{ conversation.updated_at | moment("h:mm a") }}</span>
                                <div>
                                    <span v-if="conversation.last_message"> {{ conversation.last_message.text }} </span>
                                </div>
                                
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
                            <li v-for="user in users" class="list-group-item" @click="createConversation(user)">
                                <img alt="" :src="user.image | profile-image" class="conversation_image circle-box" />
                                {{user.name}}
                            </li>  
                            <li slot="no-data" class="list-group-item alert alert-warning"  role="alert">No hay concidencias</li> 
                            <li slot="loading" class="list-group-item alert alert-info" role="alert">Buscando usuarios</li>
                        </Loading>
                    </template> 
                </ul>
            </div>
        </div>
        <div class="col-xs-24 col-md-16">
            <div class="">
                <router-view></router-view>
            </div>
        </div>
    </div>
</div>
</template>
<script>
import {mapGetters, mapActions} from 'vuex';
import {Thread} from '../../classes/Threads.js';
import Loading from '../Loading.vue';
import router from '../../router';

export default {
    name: 'conversation-list',
    data () {
        return {
            textSearch: ''
        };
    },

    computed: {
        ...mapGetters({
            conversations: 'conversations/list',
            moreConversations: 'conversations/listMorePage',
            users: 'conversations/users',
            selected: 'conversations/selectedConversation'
        }),

        hide () {
            return this.$route.meta.hide;
        }
    },

    methods: {
        ...mapActions({
            conversationsSearch: 'conversations/listSearch',
            searchUser: 'conversations/getUserList',
            create: 'conversations/createConversation',
            unreadMessage: 'conversations/getUnreaded',
            select: 'conversations/select'
        }),

        nextPage () {
            this.conversationsSearch({next: true});
        },

        onSearchUser () {
            this.searchUser(this.textSearch);
        },

        createConversation (user) {
            this.create(user).then((c) => {
                this.textSearch = '';
                router.push({ name: 'conversation-chat', params: { id: c.id } });
            }).catch(() => {

            });
        },

        onChangeConversation (conversation) {
            router.push({ name: 'conversation-chat', params: { id: conversation.id } });
        }
    },

    beforeDestroy () {
        this.thread.stop();
        this.select(null);
    },

    watch: {
        '$route': function () {
            if (!this.$route.meta.hide) {
                this.select(null);
            }
        }
    },

    mounted () {
        this.conversationsSearch();
        this.thread = new Thread(() => {
            this.unreadMessage();
        });
        this.thread.run(5000);
    },

    components: {
        Loading
    }
};
</script>