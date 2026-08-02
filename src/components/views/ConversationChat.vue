<template>
    <div class="conversation_chat" v-if="conversation">
        <div class="list-group">
            <div class="list-group-item conversation_user_header hidden-xs">
                <template v-if="isGroupChat">
                    <div class="conversation_user_header_title_row">
                        <h2>{{ groupChatTitle }}</h2>
                        <router-link
                            v-if="groupTripId"
                            class="messages-page__trip-link"
                            :to="{ name: 'detail_trip', params: { id: groupTripId } }"
                        >
                            {{ $t('verDetalleViaje') }}
                        </router-link>
                    </div>
                    <ConversationParticipants :users="conversation.users" />
                    <button
                        type="button"
                        class="btn btn-link conversation-notifications-toggle"
                        @click="toggleNotifications"
                    >
                        {{
                            conversation.notifications_enabled
                                ? $t('groupChatMuteNotifications')
                                : $t('groupChatUnmuteNotifications')
                        }}
                    </button>
                </template>
                <template v-else>
                <router-link
                    v-if="otherUserProfileRoute"
                    :to="otherUserProfileRoute"
                    v-show="isMobile"
                >
                    <div
                        class="conversation_image conversation_image_chat circle-box"
                        v-imgSrc="conversation.image"
                    ></div>
                </router-link>
                <div
                    v-if="otherUserProfileRoute"
                    class="conversation_user_header_title_row"
                >
                    <h2>
                        <router-link
                            class="conversation_user_header__name-link"
                            :to="otherUserProfileRoute"
                        >
                            {{ conversation.title }}
                        </router-link>
                    </h2>
                    <UserRatingsCounts :ratings="otherUserRatings" />
                </div>
                <h2 v-else>{{ conversation.title }}</h2>
                <CoordinateTrip></CoordinateTrip>
                <p
                    v-if="lastConnectionFormatted"
                    class="chat_last_connection"
                >
                    <strong>{{ $t('ultimaConexion') }}</strong>
                    <span> {{ lastConnectionFormatted }}</span>
                </p>
                </template>
            </div>
            <div
                id="messagesWrapper"
                ref="messagesWrapper"
                class="list-group-item clearfix conversation-messages"
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
                <template
                    v-for="item in messagesWithDaySeparators"
                    :key="item.type === 'day' ? item.key : item.message.id"
                >
                    <div
                        v-if="item.type === 'day'"
                        class="message-day-separator"
                    >
                        <span class="message-day-separator__label">{{
                            item.label
                        }}</span>
                    </div>
                    <MessageView
                        v-else
                        :message="item.message"
                        :user="user"
                        :users="conversation.users"
                        :isGroupChat="isGroupChat"
                    ></MessageView>
                </template>
            </div>
            <div class="list-group-item message-composer">
                <div class="message-composer-editor-wrap">
                    <editor
                        :key="editorKey"
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
                        <i class="fa fa-paper-plane" aria-hidden="true"></i>
                    </button>
                </div>
            </div>
        </div>
    </div>
    <div v-else>
        <p class="alert alert-warning" role="alert">
            {{ $t('seleccioneAlgunaConversacion') }}
        </p>
    </div>
</template>
<script>
import { mapState, mapActions } from 'pinia';
import { useConversationsStore } from '../../stores/conversations';
import { useAuthStore } from '../../stores/auth';
import { useDeviceStore } from '../../stores/device';
import { useActionbarsStore } from '../../stores/actionbars';
import ToastUiEditor from '../elements/ToastUiEditor.vue';
import MessageView from '../MessageView';
import router from '../../router';
import dayjs from '../../dayjs';
import bus from '../../services/bus-event.js';
import dialogs from '../../services/dialogs.js';
import CoordinateTrip from '../elements/CoordinateTrip';
import UserRatingsCounts from '../elements/UserRatingsCounts.vue';
import ConversationParticipants from '../elements/ConversationParticipants.vue';
import {
    formatTripGroupChatTitle,
    isTripGroupConversation
} from '../../utils/tripGroupChatTitle.js';
import {
    getOtherParticipant,
    getOtherParticipantRatings
} from '../../utils/conversationOtherUserRatings.js';
import { buildMessagesWithDaySeparators } from '../../utils/chatMessageDaySeparators.js';

export default {
    name: 'conversation-chat',
    data() {
        return {
            editorInitialValue: '',
            editorKey: 0,
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
        ...mapState(useConversationsStore, {
            conversation: 'selectedConversation',
            messages: 'messagesList',
            lastPageConversation: 'lastPageConversation'
        }),
        ...mapState(useAuthStore, {
            user: 'user',
            config: 'appConfig'
        }),
        ...mapState(useActionbarsStore, {
            title: 'title'
        }),
        ...mapState(useDeviceStore, {
            isMobile: 'isMobile'
        }),
        /**
         * Last-connection timestamp for the other participant in a 1:1 chat.
         * In group-style conversations (more than one other user) there is no single value; returns null.
         */
        lastConnectionRaw() {
            const other = getOtherParticipant(
                this.conversation?.users,
                this.user?.id
            );
            return other?.last_connection ?? null;
        },
        otherUserRatings() {
            return getOtherParticipantRatings(
                this.conversation?.users,
                this.user?.id
            );
        },
        otherUserProfileRoute() {
            const otherUser = getOtherParticipant(
                this.conversation?.users,
                this.user?.id
            );
            if (!otherUser?.id) {
                return null;
            }
            return {
                name: 'profile',
                params: {
                    id: otherUser.id,
                    userProfile: otherUser,
                    activeTab: 1
                }
            };
        },
        lastConnectionFormatted() {
            const raw = this.lastConnectionRaw;
            if (raw == null || raw === '') {
                return '';
            }
            const d = dayjs(raw);
            if (!d.isValid()) {
                return '';
            }
            return d.calendar();
        },
        isGroupChat() {
            return isTripGroupConversation(this.conversation);
        },
        groupChatTitle() {
            return formatTripGroupChatTitle(
                this.$t.bind(this),
                this.conversation?.trip_date
            );
        },
        groupTripId() {
            return (
                this.conversation?.trip?.id ||
                this.conversation?.trip_id ||
                null
            );
        },
        messagesWithDaySeparators() {
            return buildMessagesWithDaySeparators(
                this.messages,
                this.$t.bind(this)
            );
        }
    },
    methods: {
        dayjs,
        ...mapActions(useConversationsStore, {
            select: 'select',
            send: 'sendMessage',
            findMessage: 'findMessage',
            unreadMessage: 'getUnreadMessages',
            setConversationNotifications: 'setConversationNotifications'
        }),
        ...mapActions(useActionbarsStore, {
            setTitle: 'setTitle',
            setTitleLink: 'setTitleLink',
            setSubTitle: 'setSubTitle',
            setHeaderRatings: 'setHeaderRatings',
            setImgTitle: 'setImgTitle'
        }),

        userProfile() {
            return this.otherUserProfileRoute?.params || { id: 0 };
        },

        onEditorChange() {
            const editor = this.$refs.messageEditor;
            if (!editor) return;
            const md = editor.invoke('getMarkdown') || '';
            this.editorHasContent = md.trim().length > 0;
        },

        sendMessage() {
            if (this.$redirectToIdentityValidationIfRequired()) return;
            if (this.$redirectToMyTripsIfPendingRatingsRequired()) return;
            const editor = this.$refs.messageEditor;
            if (!editor) return;
            const text = (editor.invoke('getMarkdown') || '').trim();
            if (text.length) {
                this.sending.message = true;
                this.send(text)
                    .catch((err) => {
                        if (this.$checkError(err, 'identity_validation_required')) {
                            this.$router.push({ name: 'identity_validation' });
                            dialogs.message(this.$t('debesValidarIdentidadParaAccion'), {
                                estado: 'error'
                            });
                        }
                    })
                    .finally(() => {
                        this.sending.message = false;
                        this.editorKey += 1;
                        this.editorHasContent = false;
                        this.$forceUpdate();
                    });
            }
        },

        onBackClick() {
            // router.back();
            router.push({ name: 'conversations-list' });
        },

        jumpEndOfConversation() {
            const run = () => {
                const div = this.$refs.messagesWrapper;
                if (div) {
                    div.scrollTop = div.scrollHeight;
                }
            };
            this.$nextTick(() => {
                run();
                requestAnimationFrame(run);
            });
        },

        searchMore() {
            this.findMessage({ more: true });
        },

        toggleNotifications() {
            if (!this.conversation) {
                return;
            }
            const enabled = !this.conversation.notifications_enabled;
            this.setConversationNotifications({
                id: this.conversation.id,
                enabled
            }).then(() => {
                dialogs.message(
                    enabled
                        ? this.$t('groupChatNotificationsOn')
                        : this.$t('groupChatNotificationsOff')
                );
            });
        },

        syncChatHeader() {
            if (!this.conversation) {
                return;
            }
            const title = this.isGroupChat
                ? this.groupChatTitle
                : this.conversation.title;
            this.setTitle(title);
            if (this.isGroupChat) {
                this.setTitleLink({});
                this.setSubTitle('');
                this.setHeaderRatings(null);
                this.setImgTitle('');
                return;
            }
            const otherUser = getOtherParticipant(
                this.conversation.users,
                this.user.id
            );
            if (otherUser) {
                this.setTitleLink({
                    name: 'profile',
                    params: {
                        id: otherUser.id,
                        userProfile: otherUser,
                        activeTab: 1
                    }
                });
            } else {
                this.setTitleLink({});
            }
            this.setSubTitle(
                this.lastConnectionFormatted
                    ? `${this.$t('ultimaConexion')} ${this.lastConnectionFormatted}`
                    : ''
            );
            this.setHeaderRatings(this.otherUserRatings);
            this.setImgTitle(this.conversation.image);
        },

        refresh() {
            this.select(this.id).then(() => {
                bus.on('back-click', this.onBackClick);
                this.syncChatHeader();
                this.jumpEndOfConversation();
            });
        }
    },
    beforeUnmount() {
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
            this.syncChatHeader();
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
        editor: ToastUiEditor,
        MessageView,
        CoordinateTrip,
        UserRatingsCounts,
        ConversationParticipants
    }
};
</script>

<style scoped>
.conversation_user_header_title_row {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    flex-wrap: wrap;
}
.conversation_user_header_title_row h2 {
    margin: 0;
}
#btn-more {
    padding: 1em 0;
    margin-top: 1.5rem;
}
#btn-send {
    color: #fff;
    transition: opacity 200ms linear, background-color 200ms linear;
}
#btn-send.active {
    color: #fff;
}
.message-composer-editor-wrap {
    position: relative;
    display: block;
}
.message-composer-editor {
    width: 100%;
    min-width: 0;
    border: 1px solid #ccc;
    border-radius: 0.75rem;
}
.message-composer-send {
    position: absolute;
    right: 0.5rem;
    bottom: 0.5rem;
    z-index: 50;
    width: 2.5rem;
    height: 2.5rem;
    min-width: 2.5rem;
    border-radius: 0.5rem;
    padding: 0;
}
@media only screen and (max-width: 768px) {
    .list-group-item {
        border: 0;
    }
    .message-composer {
        position: static;
        border-top: none;
        padding-left: 8px;
        padding-right: 8px;
    }
    .message-composer-editor-wrap {
        position: relative;
        display: block;
    }
    .message-composer-editor {
        overflow: hidden;
    }
    .message-composer-editor :deep(.toastui-editor-defaultUI-toolbar) {
        overflow-x: auto;
        -webkit-overflow-scrolling: touch;
        padding: 0 8px;
    }
    .message-composer-editor :deep(.toastui-editor-defaultUI) {
        border-radius: 0;
    }
    .message-composer-send {
        width: 2.75rem;
        height: 2.75rem;
        min-width: 2.75rem;
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
    }
}
</style>
