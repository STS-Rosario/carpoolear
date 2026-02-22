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
                    <strong>{{ t('ultimaConexion') }}</strong>
                    <span class="">{{
                        formatDate(lastConnection, 'calendar')
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
                        {{ t('verMasMensajes') }}
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
            <div class="list-group-item">
                <div class="input-group">
                    <input
                        ref="iptText"
                        id="ipt-text"
                        v-model="message"
                        type="text"
                        class="form-control"
                        :placeholder="t('escribirMensaje')"
                        v-jump:click="'btn-send'"
                        maxlength="800"
                    />
                    <span class="input-group-btn">
                        <button
                            ref="btnSend"
                            id="btn-send"
                            class="btn btn-default"
                            :class="message.length > 0 ? 'active' : ''"
                            type="button"
                            @click="sendMessage"
                            v-jump:focus="'ipt-text'"
                            :disabled="sending.message"
                        >
                            <i class="fa fa-play" aria-hidden="true"></i>
                        </button>
                    </span>
                </div>
            </div>
        </div>
    </div>
    <div v-else>
        <p class="alert alert-warning" role="alert">
            {{ t('seleccioneAlgunaConversacion') }}
        </p>
    </div>
</template>
<script setup>
import { ref, reactive, computed, watch, onMounted, onUpdated, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useConversationsStore } from '@/stores/conversations';
import { useAuthStore } from '@/stores/auth';
import { useActionbarsStore } from '@/stores/actionbars';
import { useDeviceStore } from '@/stores/device';
import { formatDate } from '@/composables/useFormatters';
import MessageView from '../MessageView';
import moment from 'moment';
import bus from '../../services/bus-event.js';
import CoordinateTrip from '../elements/CoordinateTrip';

const { t } = useI18n();
const router = useRouter();
const conversationsStore = useConversationsStore();
const authStore = useAuthStore();
const actionbarsStore = useActionbarsStore();
const deviceStore = useDeviceStore();

const props = defineProps({
    id: {
        type: [String, Number],
        required: false
    }
});

const message = ref('');
const mustJump = ref(false);
const sending = reactive({ message: false });
const messagesWrapper = ref(null);

const conversation = computed(() => conversationsStore.selectedConversation);
const user = computed(() => authStore.user);
const messages = computed(() => conversationsStore.messagesList);
const lastPageConversation = computed(() => conversationsStore.lastPageConversation);
const isMobile = computed(() => deviceStore.isMobile);
const config = computed(() => authStore.appConfig);

const lastConnection = computed(() => {
    if (!conversation.value) return '';
    let users = conversation.value.users.filter(
        (item) => item.id !== user.value.id
    );
    if (users.length > 1) {
        return '';
    } else {
        return users[0].last_connection;
    }
});

const userProfile = () => {
    let id = 0;
    if (conversation.value.users[0].id === user.value.id) {
        id = 1;
    }
    return {
        id: conversation.value.users[id].id,
        userProfile: conversation.value.users[id],
        activeTab: 1
    };
};

const sendMessage = () => {
    if (message.value.length) {
        sending.message = true;
        conversationsStore.sendMessage(message.value).finally(() => {
            sending.message = false;
        });
        message.value = '';
    }
};

const onBackClick = () => {
    router.push({ name: 'conversations-list' });
};

const jumpEndOfConversation = () => {
    if (isMobile.value) {
        window.scrollTo(0, document.body.scrollHeight);
    } else {
        let div = messagesWrapper.value;
        if (div) {
            div.scrollTop = div.scrollHeight;
        }
    }
};

const searchMore = () => {
    conversationsStore.findMessage({ more: true });
};

const refresh = () => {
    conversationsStore.select(props.id).then(() => {
        bus.off('back-click', onBackClick);
        bus.on('back-click', onBackClick);
        if (conversation.value) {
            actionbarsStore.setTitle(conversation.value.title);
            const otherUser = conversation.value.users.find(
                (u) => u.id !== user.value.id
            );
            actionbarsStore.setTitleLink({
                name: 'profile',
                params: {
                    id: otherUser.id,
                    userProfile: otherUser,
                    activeTab: 1
                }
            });
            actionbarsStore.setSubTitle(
                t('ultimaConexion') +
                    moment(lastConnection.value).calendar()
            );
            actionbarsStore.setImgTitle(conversation.value.image);
        }
    });
};

onBeforeUnmount(() => {
    bus.off('back-click', onBackClick);
});

onMounted(() => {
    refresh();
});

onUpdated(() => {
    if (mustJump.value) {
        jumpEndOfConversation();
        mustJump.value = false;
    }
    if (conversation.value) {
        actionbarsStore.setTitle(conversation.value.title);
        const otherUser = conversation.value.users.find(
            (u) => u.id !== user.value.id
        );
        actionbarsStore.setTitleLink({
            name: 'profile',
            params: {
                id: otherUser.id,
                userProfile: otherUser,
                activeTab: 1
            }
        });
        actionbarsStore.setSubTitle(
            t('ultimaConexion') + moment(lastConnection.value).calendar()
        );
        actionbarsStore.setImgTitle(conversation.value.image);

        bus.emit('header-title-change');
    }
});

watch(() => props.id, () => {
    refresh();
});

watch(isMobile, () => {
    if (!props.id && isMobile.value) {
        router.push({ name: 'conversations-list' });
    }
});

watch(messages, () => {
    mustJump.value = true;
});
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
    .conversation_chat .input-group-btn:last-child > .btn {
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
