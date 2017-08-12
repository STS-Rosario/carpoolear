<template>
    <div class="conversation_chat" v-if="conversation">
        <div class="list-group">
            <div class="list-group-item">
                <router-link v-if="conversation.users.length === 2" :to="{ name: 'profile', params: userProfile() }">
                    <h2> {{conversation.title}} </h2>
                </router-link>
                <h2 v-else> {{conversation.title}} </h2>
                <p class="chat_last_connection">
                    <strong>Última conexión: </strong>
                    <span class="">{{lastConnection | moment("calendar")}}</span>
                </p>
            </div>
            <div id="messagesWrapper" ref="messagesWrapper" class="list-group-item clearfix">
                <div>
                    <button id='btn-more' @click="searchMore" v-if="!lastPageConversation" class="btn text-center btn-full-width"> Ver más mensajes </button>
                </div>
                <MessageView v-for="m in messages" :message="m" :user="user" :users="conversation.users"></MessageView>
            </div>
            <div class="list-group-item">
                <div class="input-group">
                    <input ref="ipt-text" id="ipt-text" v-model="message" type="text" class="form-control" placeholder="Escribir mensaje..." v-jump:click="'btn-send'" maxlength="255" autofocus>
                    <span class="input-group-btn">
                        <button ref="btn-send" id="btn-send" class="btn btn-default" :class="message.length > 0 ? 'active' : ''" type="button" @click="sendMessage" v-jump:focus="'ipt-text'">
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
import router from '../../router';
import moment from 'moment';
import bus from '../../services/bus-event.js';

export default {
    name: 'conversation-chat',
    data () {
        return {
            message: '',
            mustJump: false
        };
    },
    computed: {
        ...mapGetters({
            'conversation': 'conversations/selectedConversation',
            'user': 'auth/user',
            'messages': 'conversations/messagesList',
            'lastPageConversation': 'conversations/lastPageConversation',
            'timestampConversation': 'conversations/timestampConversation',
            'isMobile': 'device/isMobile',
            'selectedConversation': 'conversations/selectedConversation'
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
            'unreadMessage': 'conversations/getUnreadMessages',
            'setTitle': 'actionbars/setTitle',
            'setSubTitle': 'actionbars/setSubTitle'
        }),

        userProfile () {
            let id = 0;
            if (this.conversation.users[0].id === this.user.id) {
                id = 1;
            };
            return {
                id: this.conversation.users[id].id,
                userProfile: this.conversation.users[id]
            };
        },

        sendMessage () {
            this.sending = true;
            this.send(this.message).then(data => {
                this.sending = false;
            }).catch(() => {
                this.sending = false;
            });
            this.message = '';
        },

        onBackClick () {
            router.back();
        },

        jumpEndOfConversation () {
            if (this.isMobile) {
                window.scrollTo(0, document.body.scrollHeight);
            } else {
                let div = this.$refs.messagesWrapper;
                if (div) {
                    div.scrollTop = div.scrollHeight;
                }
            }
        },

        searchMore () {
            this.findMessage({more: true});
        }
    },
    beforeDestroy () {
        bus.off('back-click', this.onBackClick);
        // this.thread.stop();
    },
    mounted () {
        this.select(parseInt(this.id));
        this.thread = new Thread(() => {
            this.unreadMessage();
        });
        bus.on('back-click', this.onBackClick);
        // this.thread.run(5000);
    },
    updated () {
        if (this.mustJump) {
            this.jumpEndOfConversation();
            this.mustJump = false;
        }
        if (this.conversation) {
            this.setTitle(this.conversation.title);
            this.setSubTitle('Última conexión: ' + moment().calendar(this.lastConnection));
        }
    },
    watch: {
        'id': function () {
            this.select(parseInt(this.id));
        },
        isMobile: function () {
            if (!this.id && this.isMobile) {
                router.push({ name: 'conversations-list' });
            }
        },
        messages: function () {
            this.mustJump = true;
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

<style scoped>
    #btn-more {
        padding: 1em 0;
    }
    #btn-send {
        color: #ccc;
        transition: color 200ms linear;
    }
    #btn-send.active {
        color: #333;
    }
    @media only screen and (max-width: 768px) {
        .list-group-item {
            border: 0;
        }
        .list-group-item:last-child {
            border-top: 1px solid #ddd;
            bottom: 0;
            left: 0;
            width: 100%;
            position: fixed;
        }
        .conversation_chat .input-group-btn:last-child>.btn {
            height: 44px;
        }
        .btn, .btn-primary, body, #btn-more {
            font-size: 12px;
            margin-bottom: 1em;
        }
        #messagesWrapper {
            padding-top: 0;
        }
    }
</style>
