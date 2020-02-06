<template>
    <div class="conversation_chat" v-if="conversation">
        <div class="list-group">
            <div class="list-group-item conversation_user_header hidden-xs">
                <router-link v-if="conversation.users.length === 2" :to="{ name: 'profile', params: userProfile() }" v-show="isMobile">
                    <div class="conversation_image conversation_image_chat circle-box" v-imgSrc="conversation.image" ></div>
                </router-link>
                <router-link v-if="conversation.users.length === 2" :to="{ name: 'profile', params: userProfile() }">
                    <h2> {{conversation.title}} </h2>
                </router-link>
                <h2 v-else> {{conversation.title}} </h2>
                <CoordinateTrip></CoordinateTrip>
                <p class="chat_last_connection">
                    <strong>Última conexión: </strong>
                    <span class="">{{lastConnection | moment("calendar")}}</span>
                </p>
            </div>
            <div id="messagesWrapper" ref="messagesWrapper" class="list-group-item clearfix">
                <div>
                    <button id='btn-more' @click="searchMore" v-if="!lastPageConversation" class="btn text-center btn-full-width"> Ver más mensajes </button>
                </div>
                <MessageView v-for="m in messages" v-bind:key="m.id" :message="m" :user="user" :users="conversation.users"></MessageView>
            </div>
            <div class="list-group-item">
                <div class="input-group">
                    <input ref="ipt-text" id="ipt-text" v-model="message" type="text" class="form-control" placeholder="Escribir mensaje..." v-jump:click="'btn-send'" maxlength="800">
                    <span class="input-group-btn">
                        <button ref="btn-send" id="btn-send" class="btn btn-default" :class="message.length > 0 ? 'active' : ''" type="button" @click="sendMessage" v-jump:focus="'ipt-text'" :disabled="sending.message">
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
import { mapGetters, mapActions } from 'vuex';
import MessageView from '../MessageView';
import router from '../../router';
import moment from 'moment';
import bus from '../../services/bus-event.js';
import CoordinateTrip from '../elements/CoordinateTrip';

export default {
    name: 'conversation-chat',
    data () {
        return {
            message: '',
            mustJump: false,
            sending: {
                message: false
            }
        };
    },
    computed: {
        ...mapGetters({
            'conversation': 'conversations/selectedConversation',
            'user': 'auth/user',
            'messages': 'conversations/messagesList',
            'lastPageConversation': 'conversations/lastPageConversation',
            'title': 'actionbars/title',
            'isMobile': 'device/isMobile',
            'config': 'auth/appConfig'
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
            'setSubTitle': 'actionbars/setSubTitle',
            'setImgTitle': 'actionbars/setImgTitle'
        }),

        userProfile () {
            let id = 0;
            if (this.conversation.users[0].id === this.user.id) {
                id = 1;
            };
            return {
                id: this.conversation.users[id].id,
                userProfile: this.conversation.users[id],
                activeTab: 1
            };
        },

        sendMessage () {
            if (this.message.length) {
                this.$set(this.sending, 'message', true);
                this.send(this.message).finally(() => {
                    this.$set(this.sending, 'message', false);
                });
                this.message = '';
            }
        },

        onBackClick () {
            // router.back();
            router.push({ name: 'conversations-list' });
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
            this.findMessage({ more: true });
        },

        refresh () {
            this.select(parseInt(this.id)).then(() => {
                bus.on('back-click', this.onBackClick);
                if (this.conversation) {
                    this.setTitle(this.conversation.title);
                    this.setSubTitle('Última conexión: ' + moment(this.lastConnection).calendar());
                    this.setImgTitle(this.conversation.image);
                }
            });
        }
    },
    beforeDestroy () {
        bus.off('back-click', this.onBackClick);
    },
    mounted () {
        this.refresh();
    },
    updated () {
        if (this.mustJump) {
            this.jumpEndOfConversation();
            this.mustJump = false;
        }
        if (this.conversation) {
            this.setTitle(this.conversation.title);
            this.setSubTitle('Última conexión: ' + moment(this.lastConnection).calendar());
            this.setImgTitle(this.conversation.image);

            bus.emit('header-title-change');
        }
    },
    watch: {
        'id': function () {
            this.refresh();
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
        MessageView,
        CoordinateTrip
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
