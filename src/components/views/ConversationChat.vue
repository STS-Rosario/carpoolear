<template>
    <div class="conversation_chat" v-if="conversation">
        <div class="list-group">
            <div class="list-group-item">
                <h2> {{conversation.title}} </h2>
                <p class="chat_last_connection">
                    <strong>Última conexión: </strong>
                    <span class="">{{lastConnection | moment("calendar")}}</span>
                </p>
            </div>
            <div class="list-group-item clearfix">
                <div>
                    <button @click="searchMore" v-if="!lastPageConversation" class="btn text-center btn-full-width" v-jump:click.blur="'btn_login'"> Ver más mensajes </button>
                </div>
                <MessageView v-for="m in messages" :message="m" :user="user" :users="conversation.users"></MessageView>
            </div>
            <div class="list-group-item">
                <div class="input-group">
                    <input v-model="message" type="text" class="form-control" placeholder="Escribir mensaje..." v-jump:click="'btn-send'">
                    <span class="input-group-btn">
                        <button ref="btn-send" id="btn-send" class="btn btn-default" type="button" @click="sendMessage">
                            <i class="fa fa-play" aria-hidden="true"></i>
                        </button>
                    </span>
                </div>
            </div>
        </div>

    </div>
    <div v-else>
      <p slot="no-data" class="alert alert-warning"  role="alert">Seleccione alguna conversación</p>

    </div>
</template>
<script>
import {mapGetters, mapActions} from 'vuex';
import {Thread} from '../../classes/Threads.js';
import MessageView from '../MessageView';

export default {
    name: 'conversation-chat',
    data () {
        return {
            message: ''
        };
    },
    computed: {
        ...mapGetters({
            'conversation': 'conversations/selectedConversation',
            'user': 'auth/user',
            'messages': 'conversations/messagesList',
            'lastPageConversation': 'conversations/lastPageConversation',
            'timestampConversation': 'conversations/timestampConversation'
        }),
        lastConnection () {
            let users = this.conversation.users.filter(item => item.id !== this.user.id);
            if (users.length > 1) {
                return '';
            } else {
                return users[0].last_connection;
            }
        }
    },
    methods: {
        ...mapActions({
            'select': 'conversations/select',
            'send': 'conversations/sendMessage',
            'findMessage': 'conversations/findMessage',
            'unreadMessage': 'conversations/getUnreadMessages'
        }),

        sendMessage () {
            this.sending = true;
            this.send(this.message).then(data => {
                this.message = '';
                this.sending = false;
            }).catch(() => {
                this.sending = false;
            });
        },

        searchMore () {
            this.findMessage({more: true});
        }
    },
    beforeDestroy () {
        // this.thread.stop();
    },
    mounted () {
        this.select(parseInt(this.id));
        this.thread = new Thread(() => {
            this.unreadMessage();
        });
        // this.thread.run(5000);
    },
    watch: {
        'id': function () {
            this.select(parseInt(this.id));
        }
    },
    props: [
        'id'
    ],
    components: {
        MessageView
    }
};
</script>
