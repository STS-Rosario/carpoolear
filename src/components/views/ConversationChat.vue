<template>
    <div class="conversation_chat" v-if="conversation">   
        <div class="list-group">
            <div class="list-group-item">
                <h2> {{conversation.title}} </h2>    
                <span class="chat_last_connection"> {{lastConnection | moment("calendar")}}  </span>
            </div>
            <div class="list-group-item">
                <div > 
                    <button @click="searchMore" v-if="!lastPageConversation" class="btn"> Ver más mensajes </button>
                </div>
                <MessageView v-for="m in messages" :message="m" :user="user" :users="conversation.users">
                </MessageView>
            </div>
            <div class="list-group-item">
                <div class="input-group">
                    <input v-model="message" type="text" class="form-control" placeholder="Escribir mensaje...">
                    <span class="input-group-btn">
                        <button class="btn btn-default" type="button" @click="sendMessage">
                            <i class="fa fa-play" aria-hidden="true"></i>
                        </button>
                    </span>
                </div>
            </div>
        </div>
        
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
                console.log('DONE');
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
        this.thread.stop();
    },
    mounted () {
        this.select(parseInt(this.id));
        this.thread = new Thread(() => {
            this.unreadMessage();
        });
        this.thread.run(5000);
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