<template>
    <div class="conversation_chat" v-if="conversation">
        <div class="list-group">
            <div class="list-group-item conversation_user_header hidden-xs">
                <router-link
                    v-if="conversation.users.length === 2"
                    :to="{ name: 'profile', params: userProfile() }"
                    v-show="isMobile"
                >
                    <div
                        class="conversation_image conversation_image_chat circle-box"
                        v-imgSrc="conversation.image"
                    ></div>
                </router-link>
                <router-link
                    v-if="conversation.users.length === 2"
                    :to="{ name: 'profile', params: userProfile() }"
                >
                    <h2>{{ conversation.title }}</h2>
                </router-link>
                <h2 v-else>{{ conversation.title }}</h2>
                <CoordinateTrip></CoordinateTrip>
                <p class="chat_last_connection">
                    <strong>{{ $t('ultimaConexion') }}</strong>
                    <span class="">{{
                        lastConnection | moment('calendar')
                    }}</span>
                </p>
            </div>
            <div
                id="messagesWrapper"
                ref="messagesWrapper"
                class="list-group-item clearfix"
            >
                <div>
                    <button
                        id="btn-more"
                        @click="searchMore"
                        v-if="!lastPageConversation"
                        class="btn text-center btn-full-width"
                    >
                        {{ $t('verMasMensajes') }}
                    </button>
                </div>
                <MessageView
                    v-for="m in messages"
                    :key="m.id"
                    :message="m"
                    :user="user"
                    :users="conversation.users"
                ></MessageView>
            </div>
            <div class="list-group-item message-composer">
                <div class="message-composer-editor-wrap">
                    <editor
                        ref="messageEditor"
                        :initial-value="editorInitialValue"
                        initial-edit-type="wysiwyg"
                        :options="editorOptionsWithPlaceholder"
                        height="140px"
                        class="message-composer-editor"
                        @change="onEditorChange"
                    />
                    <button
                        ref="btn-send"
                        id="btn-send"
                        class="btn btn-default message-composer-send"
                        :class="editorHasContent ? 'active' : ''"
                        type="button"
                        @click="sendMessage"
                        :disabled="sending.message"
                        :title="$t('enviarMensaje')"
                    >
                        <i class="fa fa-play" aria-hidden="true"></i>
                    </button>
                </div>
            </div>
        </div>
    </div>
    <div v-else>
        <p slot="no-data" class="alert alert-warning" role="alert">
            {{ $t('seleccioneAlgunaConversacion') }}
        </p>
    </div>
</template>
<script>
import '@toast-ui/editor/dist/toastui-editor.css';
import { mapGetters, mapActions } from 'vuex';
import { Editor } from '@toast-ui/vue-editor';
import MessageView from '../MessageView';
import router from '../../router';
import moment from 'moment';
import bus from '../../services/bus-event.js';
import CoordinateTrip from '../elements/CoordinateTrip';

export default {
    name: 'conversation-chat',
    data() {
        return {
            editorInitialValue: '',
            editorHasContent: false,
            mustJump: false,
            sending: {
                message: false
            },
            editorOptions: {
                usageStatistics: false,
                hideModeSwitch: true,
                toolbarItems: [
                    ['bold', 'italic', 'strike'],
                    ['ul', 'ol']
                ],
                minHeight: '100px'
            }
        };
    },
    computed: {
        editorOptionsWithPlaceholder() {
            return {
                ...this.editorOptions,
                placeholder: this.$t('escribirMensaje')
            };
        },
        ...mapGetters({
            conversation: 'conversations/selectedConversation',
            user: 'auth/user',
            messages: 'conversations/messagesList',
            lastPageConversation: 'conversations/lastPageConversation',
            title: 'actionbars/title',
            isMobile: 'device/isMobile',
            config: 'auth/appConfig'
        }),
        lastConnection() {
            let users = this.conversation.users.filter(
                (item) => item.id !== this.user.id
            );
            if (users.length > 1) {
                return '';
            } else {
                return users[0].last_connection;
            }
        }
    },
    methods: {
        ...mapActions({
            select: 'conversations/select',
            send: 'conversations/sendMessage',
            findMessage: 'conversations/findMessage',
            unreadMessage: 'conversations/getUnreadMessages',
            setTitle: 'actionbars/setTitle',
            setTitleLink: 'actionbars/setTitleLink',
            setSubTitle: 'actionbars/setSubTitle',
            setImgTitle: 'actionbars/setImgTitle'
        }),

        userProfile() {
            let id = 0;
            if (this.conversation.users[0].id === this.user.id) {
                id = 1;
            }
            return {
                id: this.conversation.users[id].id,
                userProfile: this.conversation.users[id],
                activeTab: 1
            };
        },

        onEditorChange() {
            const editor = this.$refs.messageEditor;
            if (!editor) return;
            const md = editor.invoke('getMarkdown') || '';
            this.editorHasContent = md.trim().length > 0;
        },

        sendMessage() {
            const editor = this.$refs.messageEditor;
            if (!editor) return;
            const text = (editor.invoke('getMarkdown') || '').trim();
            if (text.length) {
                this.$set(this.sending, 'message', true);
                this.send(text).finally(() => {
                    this.$set(this.sending, 'message', false);
                    this.$forceUpdate();
                });
                editor.invoke('setMarkdown', '');
                this.editorHasContent = false;
            }
        },

        onBackClick() {
            // router.back();
            router.push({ name: 'conversations-list' });
        },

        jumpEndOfConversation() {
            if (this.isMobile) {
                window.scrollTo(0, document.body.scrollHeight);
            } else {
                let div = this.$refs.messagesWrapper;
                if (div) {
                    div.scrollTop = div.scrollHeight;
                }
            }
        },

        searchMore() {
            this.findMessage({ more: true });
        },

        refresh() {
            this.select(this.id).then(() => {
                bus.on('back-click', this.onBackClick);
                if (this.conversation) {
                    this.setTitle(this.conversation.title);
                    const otherUser = this.conversation.users.find(
                        (user) => user.id !== this.user.id
                    );
                    this.setTitleLink({
                        name: 'profile',
                        params: {
                            id: otherUser.id,
                            userProfile: otherUser,
                            activeTab: 1
                        }
                    });
                    this.setSubTitle(
                        this.$t('ultimaConexion') +
                            moment(this.lastConnection).calendar()
                    );
                    this.setImgTitle(this.conversation.image);
                }
            });
        }
    },
    beforeDestroy() {
        bus.off('back-click', this.onBackClick);
    },
    mounted() {
        this.refresh();
    },
    updated() {
        if (this.mustJump) {
            this.jumpEndOfConversation();
            this.mustJump = false;
        }
        if (this.conversation) {
            this.setTitle(this.conversation.title);
            const otherUser = this.conversation.users.find(
                (user) => user.id !== this.user.id
            );
            this.setTitleLink({
                name: 'profile',
                params: {
                    id: otherUser.id,
                    userProfile: otherUser,
                    activeTab: 1
                }
            });
            this.setSubTitle(
                this.$t('ultimaConexion') + moment(this.lastConnection).calendar()
            );
            this.setImgTitle(this.conversation.image);

            bus.emit('header-title-change');
        }
    },
    watch: {
        id: function () {
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
    props: ['id'],
    components: {
        Editor,
        MessageView,
        CoordinateTrip
    }
};
</script>

<style scoped>
#btn-more {
    padding: 1em 0;
    margin-top: 1.5rem;
}
#btn-send {
    color: #ccc;
    transition: color 200ms linear;
}
#btn-send.active {
    color: #333;
}
.message-composer-editor-wrap {
    display: flex;
    align-items: flex-end;
    gap: 8px;
}
.message-composer-editor {
    flex: 1;
    min-width: 0;
    border: 1px solid #ccc;
    border-radius: 4px;
}
.message-composer-send {
    flex-shrink: 0;
    height: 36px;
    min-width: 44px;
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
    .message-composer-editor-wrap {
        align-items: stretch;
    }
    .message-composer-send {
        height: 44px;
    }
    .btn,
    .btn-primary,
    body,
    #btn-more {
        font-size: 12px;
        margin-bottom: 1em;
    }
    #messagesWrapper {
        padding-top: 0;
        padding-bottom: 65px;
    }
}
</style>
